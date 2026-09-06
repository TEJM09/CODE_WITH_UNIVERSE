// Global Background Ambiance Manager
// Dynamically manages atmospheric cosmic drones, synthwave soundtracks, and space-time warp transitions
// across parallel universes and regional sectors.

import { sound } from './audio';
import {
  SectorAmbianceProfile,
  SECTOR_AMBIANCE_PROFILES,
  getSectorProfile,
} from './ambianceProfiles';

class GlobalAmbianceManager {
  private ctx: AudioContext | null = null;
  private currentSectorId: string = 'dashboard';
  private previousSectorId: string | null = null;
  private isTransitioning: boolean = false;
  private transitionTimer: NodeJS.Timeout | null = null;

  // Space Drone Web Audio Nodes
  private rootOsc: OscillatorNode | null = null;
  private harmonicOsc: OscillatorNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private masterDroneGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  // Configuration
  private ambianceEnabled: boolean = false;
  private ambianceVolume: number = 0.25;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  // Listeners
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Sync muting with global sound system
    if (typeof window !== 'undefined') {
      sound.addMuteListener((muted) => {
        this.setMuted(muted);
      });
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterDroneGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterDroneGain.gain.cancelScheduledValues(now);
      this.masterDroneGain.gain.setValueAtTime(muted ? 0 : (this.ambianceEnabled ? this.ambianceVolume : 0), now);
    }
    if (muted) {
      this.stopDrone();
    }
    this.notify();
  }

  public stopAll() {
    this.stopDrone();
    this.notify();
  }

  private stopDrone() {
    try {
      if (this.rootOsc) {
        this.rootOsc.stop();
        this.rootOsc.disconnect();
        this.rootOsc = null;
      }
      if (this.harmonicOsc) {
        this.harmonicOsc.stop();
        this.harmonicOsc.disconnect();
        this.harmonicOsc = null;
      }
      if (this.lfoOsc) {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
        this.lfoOsc = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      this.isInitialized = false;
    } catch (_) {}
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Ambiance listener error:', e);
      }
    });
  }

  public getActiveSector(): SectorAmbianceProfile {
    return getSectorProfile(this.currentSectorId);
  }

  public getCurrentSectorId(): string {
    return this.currentSectorId;
  }

  public getIsTransitioning(): boolean {
    return this.isTransitioning;
  }

  public isAmbianceEnabled(): boolean {
    return this.ambianceEnabled;
  }

  public getAmbianceVolume(): number {
    return this.ambianceVolume;
  }

  public setAmbianceVolume(vol: number) {
    this.ambianceVolume = Math.max(0, Math.min(1, vol));
    if (this.masterDroneGain && this.ctx) {
      const targetGain = this.ambianceEnabled && !sound.getMuted() ? this.ambianceVolume : 0;
      this.masterDroneGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterDroneGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
    this.notify();
  }

  public setAmbianceEnabled(enabled: boolean) {
    this.ambianceEnabled = enabled;
    if (!enabled) {
      this.fadeOutDrone(0.5);
    } else {
      this.initOrUpdateDrone(this.getActiveSector(), 1.0);
    }
    this.notify();
  }

  public toggleAmbiance() {
    this.setAmbianceEnabled(!this.ambianceEnabled);
  }

  /**
   * Generates a 3-second looping pink noise buffer for atmospheric cosmic wind
   */
  private createCosmicWindBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  /**
   * Initializes or updates the cosmic ambient drone synthesis for the sector
   */
  private initOrUpdateDrone(profile: SectorAmbianceProfile, rampTime: number = 1.2) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (!this.ambianceEnabled || sound.getMuted()) {
      return;
    }

    const { droneConfig } = profile;
    const now = ctx.currentTime;

    if (!this.isInitialized || !this.masterDroneGain) {
      // Create master drone gain
      this.masterDroneGain = ctx.createGain();
      this.masterDroneGain.gain.setValueAtTime(0, now);
      this.masterDroneGain.connect(ctx.destination);

      // Create filter
      this.droneFilter = ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(droneConfig.filterCutoff, now);
      this.droneFilter.Q.setValueAtTime(droneConfig.filterQ, now);
      this.droneFilter.connect(this.masterDroneGain);

      // Create LFO to modulate filter cutoff
      this.lfoOsc = ctx.createOscillator();
      this.lfoGain = ctx.createGain();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.setValueAtTime(droneConfig.lfoSpeed, now);
      this.lfoGain.gain.setValueAtTime(droneConfig.filterCutoff * 0.3, now);
      this.lfoOsc.connect(this.lfoGain);
      this.lfoGain.connect(this.droneFilter.frequency);
      this.lfoOsc.start();

      // Create Root Oscillator (Sub-bass drone)
      this.rootOsc = ctx.createOscillator();
      this.rootOsc.type = droneConfig.waveType;
      this.rootOsc.frequency.setValueAtTime(droneConfig.rootFreq, now);
      this.rootOsc.connect(this.droneFilter);
      this.rootOsc.start();

      // Create Harmonic Oscillator (Ethereal overtone)
      this.harmonicOsc = ctx.createOscillator();
      this.harmonicOsc.type = 'sine';
      this.harmonicOsc.frequency.setValueAtTime(
        droneConfig.rootFreq * droneConfig.harmonicRatio,
        now
      );
      this.harmonicOsc.connect(this.droneFilter);
      this.harmonicOsc.start();

      // Create Cosmic Wind Noise Layer
      try {
        const windBuffer = this.createCosmicWindBuffer(ctx);
        this.noiseNode = ctx.createBufferSource();
        this.noiseNode.buffer = windBuffer;
        this.noiseNode.loop = true;

        this.noiseGain = ctx.createGain();
        this.noiseGain.gain.setValueAtTime(droneConfig.noiseLevel, now);

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(600, now);
        noiseFilter.Q.setValueAtTime(1.2, now);

        this.noiseNode.connect(noiseFilter);
        noiseFilter.connect(this.noiseGain);
        this.noiseGain.connect(this.masterDroneGain);
        this.noiseNode.start();
      } catch (err) {
        console.warn('Noise generator skipped:', err);
      }

      this.isInitialized = true;
    } else {
      // Smoothly morph existing oscillators and filters to new sector parameters
      if (this.rootOsc) {
        this.rootOsc.type = droneConfig.waveType;
        this.rootOsc.frequency.cancelScheduledValues(now);
        this.rootOsc.frequency.exponentialRampToValueAtTime(
          Math.max(20, droneConfig.rootFreq),
          now + rampTime
        );
      }

      if (this.harmonicOsc) {
        this.harmonicOsc.frequency.cancelScheduledValues(now);
        this.harmonicOsc.frequency.exponentialRampToValueAtTime(
          Math.max(20, droneConfig.rootFreq * droneConfig.harmonicRatio),
          now + rampTime
        );
      }

      if (this.droneFilter) {
        this.droneFilter.frequency.cancelScheduledValues(now);
        this.droneFilter.frequency.exponentialRampToValueAtTime(
          droneConfig.filterCutoff,
          now + rampTime
        );
        this.droneFilter.Q.setValueAtTime(droneConfig.filterQ, now + rampTime);
      }

      if (this.lfoOsc && this.lfoGain) {
        this.lfoOsc.frequency.linearRampToValueAtTime(droneConfig.lfoSpeed, now + rampTime);
        this.lfoGain.gain.linearRampToValueAtTime(droneConfig.filterCutoff * 0.3, now + rampTime);
      }

      if (this.noiseGain) {
        this.noiseGain.gain.linearRampToValueAtTime(droneConfig.noiseLevel, now + rampTime);
      }
    }

    // Ramp master drone volume up to active level
    this.masterDroneGain.gain.cancelScheduledValues(now);
    this.masterDroneGain.gain.linearRampToValueAtTime(this.ambianceVolume, now + rampTime);
  }

  private fadeOutDrone(duration: number = 0.8) {
    if (this.masterDroneGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterDroneGain.gain.cancelScheduledValues(now);
      this.masterDroneGain.gain.linearRampToValueAtTime(0, now + duration);
    }
  }

  /**
   * Space-Time Warp sound effect (Silenced to eliminate unwanted noise)
   */
  public triggerWarpSound() {
    // Intentionally silenced per user directive
  }

  /**
   * Shifts the global ambiance to a new space-time sector or region.
   */
  public async shiftSector(sectorOrUniverseId: string, playWarp: boolean = false) {
    if (this.currentSectorId === sectorOrUniverseId && !this.isTransitioning) {
      return;
    }

    const nextProfile = getSectorProfile(sectorOrUniverseId);
    this.previousSectorId = this.currentSectorId;
    this.currentSectorId = sectorOrUniverseId;
    this.isTransitioning = true;
    this.notify();

    // 1. Play Space-Time Warp Transition Sound
    if (playWarp) {
      this.triggerWarpSound();
    }

    // 2. Crossfade Cosmic Ambient Drone
    if (this.ambianceEnabled && !sound.getMuted()) {
      this.initOrUpdateDrone(nextProfile, 1.4);
    }

    // 3. Crossfade Musical Soundtrack
    try {
      if (sound.getIsMusicPlaying()) {
        await sound.switchTrack(nextProfile.trackId);
      }
    } catch (err) {
      console.warn('Track shift warning:', err);
    }

    // 4. Conclude transition phase after 1.4s
    if (this.transitionTimer) clearTimeout(this.transitionTimer);
    this.transitionTimer = setTimeout(() => {
      this.isTransitioning = false;
      this.notify();
    }, 1400);
  }

  /**
   * Returns list of all available sector profiles for display/navigation
   */
  public getAllSectors(): SectorAmbianceProfile[] {
    return Object.values(SECTOR_AMBIANCE_PROFILES);
  }
}

export const ambianceManager = new GlobalAmbianceManager();
