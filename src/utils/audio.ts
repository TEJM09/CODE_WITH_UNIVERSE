// Futuristic Web Audio Synthesizer & Howler.js Background Music Engine
import { Howl, Howler } from 'howler';
import { generateSynthwaveTrack, SYNTHWAVE_TRACKS, SynthwaveTrackMeta } from './synthwaveGenerator';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Muted by default to prevent unwanted noise
  private volume: number = 0.5;

  // Howler.js Background Music Player State
  private musicHowl: Howl | null = null;
  private currentTrackId: string = 'neon-horizon';
  private isMusicPlaying: boolean = false;
  private musicVolume: number = 0.4;
  private isMusicLoading: boolean = false;
  private musicListeners: Set<() => void> = new Set();
  private muteListeners: Set<(muted: boolean) => void> = new Set();
  private audioTrackUrls: Map<string, string> = new Map();

  constructor() {
    // Lazy initialize on first user interaction
  }

  private getContext(): AudioContext | null {
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

  public addMuteListener(listener: (muted: boolean) => void): () => void {
    this.muteListeners.add(listener);
    return () => this.muteListeners.delete(listener);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      Howler.mute(muted);
    } catch (_) {}
    if (this.musicHowl) {
      this.musicHowl.volume(muted ? 0 : this.musicVolume);
      if (muted) {
        this.musicHowl.pause();
        this.isMusicPlaying = false;
      }
    }
    this.muteListeners.forEach((cb) => {
      try {
        cb(muted);
      } catch (_) {}
    });
    this.notifyMusicChange();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.volume = this.musicVolume; // Keep sound effects volume in sync with the slider
    try {
      Howler.volume(this.musicVolume);
    } catch (_) {}
    if (this.musicHowl) {
      this.musicHowl.volume(this.isMuted ? 0 : this.musicVolume);
    }
    if (this.musicVolume <= 0.01) {
      this.pauseMusic();
      this.setMuted(true);
    }
    this.notifyMusicChange();
  }

  public stopAllAudio() {
    this.pauseMusic();
    if (this.musicHowl) {
      try {
        this.musicHowl.stop();
      } catch (_) {}
    }
    try {
      Howler.stop();
    } catch (_) {}
    this.notifyMusicChange();
  }

  // ==========================================
  // HOWLER.JS BACKGROUND MUSIC PLAYER
  // ==========================================

  public getAllTracks(): SynthwaveTrackMeta[] {
    return SYNTHWAVE_TRACKS;
  }

  public getCurrentTrackId(): string {
    return this.currentTrackId;
  }

  public getCurrentTrackMeta(): SynthwaveTrackMeta {
    return (
      SYNTHWAVE_TRACKS.find((t) => t.id === this.currentTrackId) || SYNTHWAVE_TRACKS[0]
    );
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getIsMusicLoading(): boolean {
    return this.isMusicLoading;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public addMusicListener(listener: () => void) {
    this.musicListeners.add(listener);
  }

  public removeMusicListener(listener: () => void) {
    this.musicListeners.delete(listener);
  }

  private notifyMusicChange() {
    this.musicListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Music listener error:', err);
      }
    });
  }

  /**
   * Initializes or loads the Howl instance for the requested track
   */
  private async loadTrackHowl(trackId: string): Promise<Howl> {
    if (this.musicHowl && this.currentTrackId === trackId) {
      return this.musicHowl;
    }

    // Stop and unload previous Howl
    if (this.musicHowl) {
      this.musicHowl.stop();
      this.musicHowl.unload();
      this.musicHowl = null;
    }

    this.isMusicLoading = true;
    this.currentTrackId = trackId;
    this.notifyMusicChange();

    try {
      let audioUrl = this.audioTrackUrls.get(trackId);
      if (!audioUrl) {
        audioUrl = await generateSynthwaveTrack(trackId);
        this.audioTrackUrls.set(trackId, audioUrl);
      }

      return new Promise<Howl>((resolve, reject) => {
        const howl = new Howl({
          src: [audioUrl!],
          format: ['wav'],
          loop: true,
          volume: this.isMuted ? 0 : this.musicVolume,
          html5: false,
          onload: () => {
            this.isMusicLoading = false;
            this.musicHowl = howl;
            this.notifyMusicChange();
            resolve(howl);
          },
          onloaderror: (_id, err) => {
            this.isMusicLoading = false;
            this.notifyMusicChange();
            reject(new Error(`Howler load error: ${err}`));
          },
          onplay: () => {
            this.isMusicPlaying = true;
            this.notifyMusicChange();
          },
          onpause: () => {
            this.isMusicPlaying = false;
            this.notifyMusicChange();
          },
          onstop: () => {
            this.isMusicPlaying = false;
            this.notifyMusicChange();
          },
        });
      });
    } catch (error) {
      this.isMusicLoading = false;
      this.notifyMusicChange();
      throw error;
    }
  }

  /**
   * Starts playing the cinematic synthwave soundtrack
   */
  public async playMusic(trackId?: string) {
    const targetTrackId = trackId || this.currentTrackId;

    try {
      const howl = await this.loadTrackHowl(targetTrackId);
      if (!howl.playing()) {
        howl.volume(this.isMuted ? 0 : this.musicVolume);
        howl.play();
        this.isMusicPlaying = true;
        this.notifyMusicChange();
      }
    } catch (err) {
      console.error('Failed to play background synthwave track:', err);
    }
  }

  /**
   * Pauses the background synthwave soundtrack
   */
  public pauseMusic() {
    if (this.musicHowl && this.musicHowl.playing()) {
      this.musicHowl.pause();
      this.isMusicPlaying = false;
      this.notifyMusicChange();
    }
  }

  /**
   * Toggles playback between play and pause
   */
  public async toggleMusic() {
    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      await this.playMusic();
    }
  }

  /**
   * Returns the track ID mapped to a specific universe
   */
  public getUniverseTrackId(universeId: string): string {
    switch (universeId) {
      case 'world_1': return 'world_1_neon_prime';
      case 'world_2': return 'world_2_recursive_nexus';
      case 'world_3': return 'world_3_architectural_matrix';
      case 'world_4': return 'world_4_biomechanical_canopy';
      case 'world_5': return 'world_5_prismatic_overdrive';
      case 'world_6': return 'world_6_hex_void_echoes';
      case 'world_7': return 'world_7_starlight_constellation';
      case 'world_8': return 'world_8_core_meltdown';
      default: return 'world_1_neon_prime';
    }
  }

  /**
   * Automatically switches soundtrack to match the selected universe
   */
  public async switchUniverseTrack(universeId: string) {
    const trackId = this.getUniverseTrackId(universeId);
    if (this.currentTrackId !== trackId) {
      await this.switchTrack(trackId);
    }
  }

  /**
   * Switches to a new soundtrack and plays it if currently active
   */
  public async switchTrack(trackId: string) {
    const wasPlaying = this.isMusicPlaying;
    this.currentTrackId = trackId;

    if (wasPlaying) {
      await this.playMusic(trackId);
    } else {
      await this.loadTrackHowl(trackId);
    }
  }

  // ==========================================
  // FUTURISTIC WEB AUDIO SYNTHESIZERS (SFX)
  // ==========================================

  // Futuristic UI Click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Quantum Laser Attack
  public playLaser() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  // Enemy Hit / Boss Damage
  public playHit() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  // Shield Overcharge
  public playShield() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  // Victory Fanfare / Challenge Passed
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.35);
    });
  }

  // Level Up Glorious Sound
  public playLevelUp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major pentatonic
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
    });
  }

  // Error notification: soft gentle tone with low volume, NO harsh sawtooth buzzer
  public playError() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  // Warp / Universe Portal Transition
  public playPortal() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25 * this.volume, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  }

  // ====================================================
  // UNIVERSE-SPECIFIC AUDIO SIGNATURES (Distinct per World)
  // ====================================================

  /**
   * Plays a unique thematic audio signature sound for each universe
   */
  public playUniverseSignature(universeId: string) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    switch (universeId) {
      case 'world_1': {
        // Earth Prime: High-voltage dual electric chirp
        const freqs = [880, 1320];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.18);
        });
        break;
      }

      case 'world_2': {
        // Function Nexus: Triple recursive call-stack pulse
        const freqs = [440, 660, 880];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.07);
          gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.07);
          osc.stop(ctx.currentTime + i * 0.07 + 0.25);
        });
        break;
      }

      case 'world_3': {
        // Object Realm: Regal golden triad chord
        const chord = [523.25, 659.25, 783.99]; // C Major Triad
        chord.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        });
        break;
      }

      case 'world_4': {
        // Inheritance Kingdom: Deep organic resonant filter sweep
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.2);
        filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        break;
      }

      case 'world_5': {
        // Polymorphism City: Prismatic dual FM sweep
        const carrier = ctx.createOscillator();
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gain = ctx.createGain();
        carrier.type = 'sine';
        mod.type = 'sawtooth';
        carrier.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        carrier.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3);
        mod.frequency.setValueAtTime(220, ctx.currentTime);
        modGain.gain.setValueAtTime(300, ctx.currentTime);
        mod.connect(modGain);
        modGain.connect(carrier.frequency);
        gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        carrier.connect(gain);
        gain.connect(ctx.destination);
        mod.start();
        carrier.start();
        mod.stop(ctx.currentTime + 0.35);
        carrier.stop(ctx.currentTime + 0.35);
        break;
      }

      case 'world_6': {
        // Memory Dimension: Deep sub drop with metallic ringing echo
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);

        // Metallic bell echo
        const bell = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bell.type = 'triangle';
        bell.frequency.setValueAtTime(1864, ctx.currentTime + 0.1);
        bellGain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime + 0.1);
        bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        bell.connect(bellGain);
        bellGain.connect(ctx.destination);
        bell.start(ctx.currentTime + 0.1);
        bell.stop(ctx.currentTime + 0.6);
        break;
      }

      case 'world_7': {
        // STL Galaxy: 4-note sparkling celestial constellation bell
        const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
        notes.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);
          gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
        });
        break;
      }

      case 'world_8': {
        // Core Compiler: Blazing darksynth industrial boss power surge
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(75, ctx.currentTime);
        osc2.frequency.setValueAtTime(150, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.25);
        osc1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.35 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
        break;
      }

      default:
        this.playPortal();
    }
  }

  // ====================================================
  // TIMER & WORLD DISRUPTION AUDIO
  // ====================================================

  /**
   * Subtle tick sound played when the mission timer is low (silenced per user request)
   */
  public playTimerTick() {
    // Silenced per user preference
    return;
  }

  /**
   * Dramatic alert siren and glitch feedback when a world is disrupted (silenced per user request)
   */
  public playDisruptionAlarm() {
    // Silenced per user preference: removed buzzer sound
    return;
  }

  /**
   * Restored world harmonization chime when stabilization completes
   */
  public playRestored() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [392, 523.25, 659.25, 783.99, 1046.5]; // G, C, E, G, C
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
    });
  }
}

export const sound = new SoundEngine();
