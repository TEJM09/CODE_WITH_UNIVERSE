// Procedural Cinematic Synthwave Music Generator for Howler.js
// Renders rich studio-grade stereo 16-bit 44.1kHz audio tracks in memory

export interface SynthwaveTrackMeta {
  id: string;
  universeId?: string;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  durationSeconds: number;
  description: string;
  icon: string;
}

export const SYNTHWAVE_TRACKS: SynthwaveTrackMeta[] = [
  {
    id: 'world_1_neon_prime',
    universeId: 'world_1',
    title: 'Neon Prime',
    genre: 'High-Voltage Synthwave',
    bpm: 116,
    key: 'D Minor',
    durationSeconds: 16.55,
    description: 'Electric 80s punchy bassline, bright analog poly-pads, and soaring cyberpunk lead melody for Earth Prime.',
    icon: '⚡',
  },
  {
    id: 'world_2_recursive_nexus',
    universeId: 'world_2',
    title: 'Recursive Nexus',
    genre: 'Ultraviolet Ambient Synth',
    bpm: 104,
    key: 'A Minor',
    durationSeconds: 18.46,
    description: 'Cascading arpeggiated melodic stacks, deep sub-pulses, and spatial echoing leads for Function Nexus.',
    icon: '🔮',
  },
  {
    id: 'world_3_architectural_matrix',
    universeId: 'world_3',
    title: 'Architectural Matrix',
    genre: 'Neo-Classical Retro Chiptune',
    bpm: 118,
    key: 'G Minor',
    durationSeconds: 16.27,
    description: 'Regal poly-synth chord progressions, bright crystalline harmonics, and rhythmic bass for Object Realm.',
    icon: '🏛️',
  },
  {
    id: 'world_4_biomechanical_canopy',
    universeId: 'world_4',
    title: 'Biomechanical Canopy',
    genre: 'Deep Bio-Atmosphere Synth',
    bpm: 98,
    key: 'E Minor',
    durationSeconds: 19.59,
    description: 'Sub-bass organic drones, warm resonant sweep filters, and lush canopy pads for Inheritance Kingdom.',
    icon: '🌿',
  },
  {
    id: 'world_5_prismatic_overdrive',
    universeId: 'world_5',
    title: 'Prismatic Overdrive',
    genre: 'Cybernetic Hi-NRG Wave',
    bpm: 128,
    key: 'B Minor',
    durationSeconds: 15.0,
    description: 'High-speed syncopated bass, prismatic multi-tone arps, and relentless cyber drive for Polymorphism City.',
    icon: '💎',
  },
  {
    id: 'world_6_hex_void_echoes',
    universeId: 'world_6',
    title: 'Hex Void Echoes',
    genre: 'Deep Cosmic Sub-Space',
    bpm: 88,
    key: 'C Minor',
    durationSeconds: 21.8,
    description: 'Eerie sub-drones, glassy metallic bells, and mysterious pointer memory reverberations for Memory Dimension.',
    icon: '👻',
  },
  {
    id: 'world_7_starlight_constellation',
    universeId: 'world_7',
    title: 'Starlight Constellation',
    genre: 'Cosmic Dreamwave',
    bpm: 122,
    key: 'F Major',
    durationSeconds: 15.73,
    description: 'Shimmering starlight bell plucks, uplifting major chords, and energetic arcade pulse for STL Galaxy.',
    icon: '🌌',
  },
  {
    id: 'world_8_core_meltdown',
    universeId: 'world_8',
    title: 'Core Meltdown Protocol',
    genre: 'Industrial Darksynth Boss',
    bpm: 134,
    key: 'D Minor',
    durationSeconds: 14.32,
    description: 'Blazing heavy distortion darksynth bass, alarm stabs, and intense boss battle rhythm for Core Compiler.',
    icon: '🔥',
  },
  // Legacy aliases
  {
    id: 'neon-horizon',
    universeId: 'world_1',
    title: 'Neon Horizon',
    genre: 'Cinematic Synthwave',
    bpm: 116,
    key: 'D Minor',
    durationSeconds: 16.55,
    description: 'Pumping 80s bassline, lush analog poly-pads, and soaring cyberpunk lead melody.',
    icon: '🌆',
  },
  {
    id: 'cyber-matrix',
    universeId: 'world_2',
    title: 'Cyber Matrix',
    genre: 'Dark Ambient Synth',
    bpm: 96,
    key: 'A Minor',
    durationSeconds: 20.0,
    description: 'Pulsating resonant sub-drones, mysterious cosmic arpeggios, and industrial gated beats.',
    icon: '🌌',
  },
  {
    id: 'starlight-nexus',
    universeId: 'world_7',
    title: 'Starlight Nexus',
    genre: 'Cosmic Dreamwave',
    bpm: 124,
    key: 'F Major',
    durationSeconds: 15.48,
    description: 'Glittering starlight bell plucks, uplifting retro chords, and energetic arcade pulse.',
    icon: '✨',
  },
];

// Helper to convert AudioBuffer into a WAV Blob
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, format, true); // AudioFormat 1 = PCM
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitDepth, true); // BitsPerSample

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const left = buffer.getChannelData(0);
  const right = numChannels > 1 ? buffer.getChannelData(1) : left;

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Left Channel Sample
    let sL = Math.max(-1, Math.min(1, left[i]));
    view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
    offset += 2;

    // Right Channel Sample
    if (numChannels > 1) {
      let sR = Math.max(-1, Math.min(1, right[i]));
      view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Convert MIDI note number to frequency (Hz)
const m2f = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

// Cache generated track Object URLs
const trackUrlCache = new Map<string, string>();

/**
 * Procedurally synthesizes a stereo Cinematic Synthwave track and returns a Blob URL
 */
export async function generateSynthwaveTrack(trackId: string = 'neon-horizon'): Promise<string> {
  if (trackUrlCache.has(trackId)) {
    return trackUrlCache.get(trackId)!;
  }

  const sampleRate = 44100;
  let bpm = 116;
  let bars = 8;

  if (trackId === 'world_2_recursive_nexus' || trackId === 'cyber-matrix') {
    bpm = 104;
  } else if (trackId === 'world_3_architectural_matrix') {
    bpm = 118;
  } else if (trackId === 'world_4_biomechanical_canopy') {
    bpm = 98;
  } else if (trackId === 'world_5_prismatic_overdrive') {
    bpm = 128;
  } else if (trackId === 'world_6_hex_void_echoes') {
    bpm = 88;
  } else if (trackId === 'world_7_starlight_constellation' || trackId === 'starlight-nexus') {
    bpm = 122;
  } else if (trackId === 'world_8_core_meltdown') {
    bpm = 134;
  } else {
    bpm = 116;
  }

  const beatSec = 60 / bpm;
  const barSec = beatSec * 4;
  const totalDuration = barSec * bars;

  // Initialize OfflineAudioContext for ultrafast multi-threaded rendering
  const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineCtx) {
    throw new Error('Web Audio OfflineAudioContext not supported');
  }

  const actx = new OfflineCtx(2, Math.ceil(sampleRate * totalDuration), sampleRate);

  // Master Gain & Limiter
  const masterGain = actx.createGain();
  masterGain.gain.setValueAtTime(0.75, 0);

  const masterCompressor = actx.createDynamicsCompressor();
  masterCompressor.threshold.setValueAtTime(-12, 0);
  masterCompressor.knee.setValueAtTime(8, 0);
  masterCompressor.ratio.setValueAtTime(4, 0);
  masterCompressor.attack.setValueAtTime(0.005, 0);
  masterCompressor.release.setValueAtTime(0.08, 0);

  masterGain.connect(masterCompressor);
  masterCompressor.connect(actx.destination);

  // Reverb Send Simulation (Stereo Delay Feedback)
  const delayL = actx.createDelay();
  const delayR = actx.createDelay();
  delayL.delayTime.setValueAtTime(beatSec * 0.75, 0);
  delayR.delayTime.setValueAtTime(beatSec * 0.5, 0);

  const delayFeedback = actx.createGain();
  delayFeedback.gain.setValueAtTime(0.35, 0);

  const delayFilter = actx.createBiquadFilter();
  delayFilter.type = 'lowpass';
  delayFilter.frequency.setValueAtTime(2500, 0);

  delayL.connect(delayFeedback);
  delayFeedback.connect(delayFilter);
  delayFilter.connect(delayR);
  delayR.connect(delayL);

  const reverbReturn = actx.createGain();
  reverbReturn.gain.setValueAtTime(0.2, 0);
  delayL.connect(reverbReturn);
  delayR.connect(reverbReturn);
  reverbReturn.connect(masterGain);

  // CHORD PROGRESSIONS & NOTES
  // D Minor: D3, F3, A3 (50, 53, 57) | Bb: Bb2, D3, F3 (46, 50, 53) | F: F2, A2, C3 (41, 45, 48) | C: C3, E3, G3 (48, 52, 55)
  let chordChroma: number[][] = [];
  let bassNotes: number[] = [];

  if (trackId === 'world_2_recursive_nexus' || trackId === 'cyber-matrix') {
    // Function Nexus: Am, F, C, Em, Am, Dm, F, E
    chordChroma = [
      [57, 60, 64], // Am
      [53, 57, 60], // F
      [48, 52, 55], // C
      [52, 55, 59], // Em
      [57, 60, 64], // Am
      [50, 53, 57], // Dm
      [53, 57, 60], // F
      [52, 56, 59], // E
    ];
    bassNotes = [33, 29, 36, 28, 33, 26, 29, 28]; // A1, F1, C2, E1...
  } else if (trackId === 'world_3_architectural_matrix') {
    // Object Realm: Gm, Eb, Bb, F, Gm, Cm, Eb, D
    chordChroma = [
      [55, 58, 62], // Gm
      [51, 55, 58], // Eb
      [46, 50, 53], // Bb
      [53, 57, 60], // F
      [55, 58, 62], // Gm
      [48, 51, 55], // Cm
      [51, 55, 58], // Eb
      [50, 54, 57], // D
    ];
    bassNotes = [31, 27, 34, 29, 31, 24, 27, 26]; // G1, Eb1, Bb1, F1...
  } else if (trackId === 'world_4_biomechanical_canopy') {
    // Inheritance Kingdom: Em, C, G, D, Em, Am, C, Bm
    chordChroma = [
      [52, 55, 59], // Em
      [48, 52, 55], // C
      [55, 59, 62], // G
      [50, 54, 57], // D
      [52, 55, 59], // Em
      [57, 60, 64], // Am
      [48, 52, 55], // C
      [47, 50, 54], // Bm
    ];
    bassNotes = [28, 24, 31, 26, 28, 33, 24, 23]; // E1, C1, G1, D1...
  } else if (trackId === 'world_5_prismatic_overdrive') {
    // Polymorphism City: Bm, G, D, A, Bm, Em, G, F#
    chordChroma = [
      [47, 50, 54], // Bm
      [43, 47, 50], // G
      [50, 54, 57], // D
      [45, 49, 52], // A
      [47, 50, 54], // Bm
      [52, 55, 59], // Em
      [43, 47, 50], // G
      [42, 46, 49], // F#
    ];
    bassNotes = [35, 31, 38, 33, 35, 28, 31, 30]; // B1, G1, D2, A1...
  } else if (trackId === 'world_6_hex_void_echoes') {
    // Memory Dimension: Cm, Ab, Eb, Bb, Cm, Fm, Ab, G
    chordChroma = [
      [48, 51, 55], // Cm
      [44, 48, 51], // Ab
      [51, 55, 58], // Eb
      [46, 50, 53], // Bb
      [48, 51, 55], // Cm
      [53, 56, 60], // Fm
      [44, 48, 51], // Ab
      [43, 47, 50], // G
    ];
    bassNotes = [36, 32, 39, 34, 36, 29, 32, 31]; // C2, Ab1, Eb2, Bb1...
  } else if (trackId === 'world_7_starlight_constellation' || trackId === 'starlight-nexus') {
    // STL Galaxy: F, C, Dm, Bb, F, Gm, Bb, C
    chordChroma = [
      [53, 57, 60], // F
      [48, 52, 55], // C
      [50, 53, 57], // Dm
      [46, 50, 53], // Bb
      [53, 57, 60], // F
      [55, 58, 62], // Gm
      [46, 50, 53], // Bb
      [48, 52, 55], // C
    ];
    bassNotes = [29, 36, 38, 34, 29, 31, 34, 36];
  } else if (trackId === 'world_8_core_meltdown') {
    // Core Compiler: Dm, Bb, Gm, A, Dm, Eb, Bb, A
    chordChroma = [
      [50, 53, 57], // Dm
      [46, 50, 53], // Bb
      [43, 46, 50], // Gm
      [45, 49, 52], // A
      [50, 53, 57], // Dm
      [51, 55, 58], // Eb
      [46, 50, 53], // Bb
      [45, 49, 52], // A
    ];
    bassNotes = [38, 34, 31, 33, 38, 39, 34, 33];
  } else {
    // Earth Prime / Neon Horizon (D Minor)
    chordChroma = [
      [50, 53, 57], // Dm
      [46, 50, 53], // Bb
      [41, 45, 48], // F
      [48, 52, 55], // C
      [50, 53, 57], // Dm
      [55, 58, 62], // Gm
      [46, 50, 53], // Bb
      [45, 49, 52], // A
    ];
    bassNotes = [38, 34, 41, 36, 38, 43, 34, 33]; // D2, Bb1, F2, C2, D2, G2, Bb1, A1
  }

  // 1. DRUM SYNTHESIS (Kick, Gated Snare, Hi-Hats, Crash)
  for (let b = 0; b < bars; b++) {
    const barStart = b * barSec;

    for (let beat = 0; beat < 4; beat++) {
      const beatTime = barStart + beat * beatSec;

      // KICK DRUM (Beat 0 and Beat 2, plus syncopated beat 1.75 or 2.5)
      const isKick = beat === 0 || beat === 2 || (trackId === 'neon-horizon' && beat === 1);
      if (isKick) {
        const kickOsc = actx.createOscillator();
        const kickGain = actx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, beatTime);
        kickOsc.frequency.exponentialRampToValueAtTime(38, beatTime + 0.12);

        kickGain.gain.setValueAtTime(0.9, beatTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.25);

        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);

        kickOsc.start(beatTime);
        kickOsc.stop(beatTime + 0.25);
      }

      // 80s GATED SNARE / CLAP (Beat 1 and 3)
      if (beat === 1 || beat === 3) {
        // Body tone
        const snareOsc = actx.createOscillator();
        const snareToneGain = actx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(190, beatTime);
        snareOsc.frequency.exponentialRampToValueAtTime(80, beatTime + 0.1);

        snareToneGain.gain.setValueAtTime(0.4, beatTime);
        snareToneGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.12);

        snareOsc.connect(snareToneGain);
        snareToneGain.connect(masterGain);
        snareOsc.start(beatTime);
        snareOsc.stop(beatTime + 0.12);

        // White noise burst
        const noiseLen = 0.22;
        const noiseBuf = actx.createBuffer(1, Math.ceil(sampleRate * noiseLen), sampleRate);
        const output = noiseBuf.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = actx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const noiseFilter = actx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1200, beatTime);

        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.5, beatTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, beatTime + noiseLen);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseGain.connect(delayL);

        noiseSrc.start(beatTime);
        noiseSrc.stop(beatTime + noiseLen);
      }

      // HI-HATS (16th notes: 4 ticks per beat)
      for (let tick = 0; tick < 4; tick++) {
        const hatTime = beatTime + tick * (beatSec / 4);
        const isOpen = tick === 2; // Open hat on off-beat

        const hatLen = isOpen ? 0.14 : 0.04;
        const hatBuf = actx.createBuffer(1, Math.ceil(sampleRate * hatLen), sampleRate);
        const data = hatBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const hatSrc = actx.createBufferSource();
        hatSrc.buffer = hatBuf;

        const hatFilter = actx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(7500, hatTime);

        const hatGain = actx.createGain();
        const vel = isOpen ? 0.25 : tick === 0 ? 0.18 : 0.1;
        hatGain.gain.setValueAtTime(vel, hatTime);
        hatGain.gain.exponentialRampToValueAtTime(0.001, hatTime + hatLen);

        hatSrc.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(masterGain);

        hatSrc.start(hatTime);
        hatSrc.stop(hatTime + hatLen);
      }
    }
  }

  // 2. ROLLING ARPEGGIATED SYNTH BASSLINE (16th notes)
  for (let b = 0; b < bars; b++) {
    const root = bassNotes[b % bassNotes.length];
    const barStart = b * barSec;

    for (let step = 0; step < 16; step++) {
      const stepTime = barStart + step * (beatSec / 4);
      // Octave switching pattern: root, root+12, root, root+12
      const note = step % 2 === 1 ? root + 12 : root;
      const freq = m2f(note);

      const bassOsc1 = actx.createOscillator();
      const bassOsc2 = actx.createOscillator();
      bassOsc1.type = 'sawtooth';
      bassOsc2.type = 'square';
      bassOsc1.frequency.setValueAtTime(freq, stepTime);
      bassOsc2.frequency.setValueAtTime(freq * 0.998, stepTime); // Detune

      const bassFilter = actx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.Q.setValueAtTime(4, stepTime);
      bassFilter.frequency.setValueAtTime(1400, stepTime);
      bassFilter.frequency.exponentialRampToValueAtTime(320, stepTime + (beatSec / 4) * 0.85);

      const bassGain = actx.createGain();
      bassGain.gain.setValueAtTime(0.4, stepTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, stepTime + (beatSec / 4) * 0.9);

      bassOsc1.connect(bassFilter);
      bassOsc2.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(masterGain);

      bassOsc1.start(stepTime);
      bassOsc2.start(stepTime);
      bassOsc1.stop(stepTime + beatSec / 4);
      bassOsc2.stop(stepTime + beatSec / 4);
    }
  }

  // 3. LUSH ANALOG CHORD PADS (Sustained with detuned stereo supersaw)
  for (let b = 0; b < bars; b++) {
    const chords = chordChroma[b % chordChroma.length];
    const barStart = b * barSec;
    const padDuration = barSec;

    chords.forEach((midi, idx) => {
      [-7, 0, 7].forEach((detuneCents) => {
        const padOsc = actx.createOscillator();
        padOsc.type = 'sawtooth';
        padOsc.frequency.setValueAtTime(m2f(midi), barStart);
        padOsc.detune.setValueAtTime(detuneCents + (idx % 2 === 0 ? 4 : -4), barStart);

        const padFilter = actx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.Q.setValueAtTime(1.5, barStart);
        padFilter.frequency.setValueAtTime(800, barStart);
        padFilter.frequency.linearRampToValueAtTime(2200, barStart + padDuration * 0.5);
        padFilter.frequency.linearRampToValueAtTime(800, barStart + padDuration);

        const padGain = actx.createGain();
        padGain.gain.setValueAtTime(0.001, barStart);
        padGain.gain.linearRampToValueAtTime(0.07, barStart + 0.3);
        padGain.gain.setValueAtTime(0.07, barStart + padDuration - 0.3);
        padGain.gain.linearRampToValueAtTime(0.001, barStart + padDuration);

        padOsc.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(masterGain);
        padGain.connect(delayL);

        padOsc.start(barStart);
        padOsc.stop(barStart + padDuration);
      });
    });
  }

  // 4. CRYSTAL ARPEGGIO (16th notes ping-ponging through chords)
  for (let b = 0; b < bars; b++) {
    const chords = chordChroma[b % chordChroma.length];
    const barStart = b * barSec;

    for (let step = 0; step < 16; step++) {
      const arpTime = barStart + step * (beatSec / 4);
      const noteIdx = step % chords.length;
      const octaveShift = Math.floor(step / 4) % 2 === 0 ? 12 : 24;
      const arpNote = chords[noteIdx] + octaveShift;
      const freq = m2f(arpNote);

      const arpOsc = actx.createOscillator();
      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(freq, arpTime);

      const arpGain = actx.createGain();
      arpGain.gain.setValueAtTime(0.08, arpTime);
      arpGain.gain.exponentialRampToValueAtTime(0.001, arpTime + 0.15);

      arpOsc.connect(arpGain);
      arpGain.connect(masterGain);
      arpGain.connect(delayR);

      arpOsc.start(arpTime);
      arpOsc.stop(arpTime + 0.15);
    }
  }

  // 5. SOARING CYBERPUNK LEAD MELODY (Bars 4 through 8)
  let melodyNotes: { bar: number; beat: number; dur: number; note: number }[] = [];

  if (trackId === 'world_2_recursive_nexus' || trackId === 'cyber-matrix') {
    // Function Nexus: Mysterious recursive melodies in A Minor
    melodyNotes = [
      { bar: 2, beat: 0, dur: 1.5, note: 69 }, // A4
      { bar: 2, beat: 2, dur: 1.0, note: 72 }, // C5
      { bar: 3, beat: 0, dur: 2.0, note: 71 }, // B4
      { bar: 4, beat: 0, dur: 1.5, note: 74 }, // D5
      { bar: 4, beat: 2, dur: 1.0, note: 76 }, // E5
      { bar: 5, beat: 0, dur: 2.5, note: 72 }, // C5
      { bar: 6, beat: 0, dur: 1.0, note: 69 }, // A4
      { bar: 6, beat: 2, dur: 1.5, note: 67 }, // G4
      { bar: 7, beat: 0, dur: 3.0, note: 69 }, // A4
    ];
  } else if (trackId === 'world_3_architectural_matrix') {
    // Object Realm: Neo-classical grand chords in G Minor
    melodyNotes = [
      { bar: 2, beat: 0, dur: 1.5, note: 67 }, // G4
      { bar: 2, beat: 2, dur: 1.0, note: 70 }, // Bb4
      { bar: 3, beat: 0, dur: 1.5, note: 74 }, // D5
      { bar: 3, beat: 2, dur: 1.0, note: 72 }, // C5
      { bar: 4, beat: 0, dur: 2.0, note: 75 }, // Eb5
      { bar: 4, beat: 2.5, dur: 0.8, note: 74 }, // D5
      { bar: 5, beat: 0, dur: 2.0, note: 70 }, // Bb4
      { bar: 6, beat: 0, dur: 1.5, note: 72 }, // C5
      { bar: 6, beat: 2, dur: 1.0, note: 69 }, // A4
      { bar: 7, beat: 0, dur: 3.0, note: 67 }, // G4
    ];
  } else if (trackId === 'world_4_biomechanical_canopy') {
    // Inheritance Kingdom: Organic deep atmospheric motif in E Minor
    melodyNotes = [
      { bar: 2, beat: 0, dur: 2.0, note: 64 }, // E4
      { bar: 2, beat: 2.5, dur: 1.0, note: 67 }, // G4
      { bar: 3, beat: 0, dur: 2.0, note: 71 }, // B4
      { bar: 4, beat: 0, dur: 1.5, note: 69 }, // A4
      { bar: 4, beat: 2, dur: 1.0, note: 67 }, // G4
      { bar: 5, beat: 0, dur: 2.5, note: 64 }, // E4
      { bar: 6, beat: 0, dur: 1.5, note: 62 }, // D4
      { bar: 6, beat: 2, dur: 1.0, note: 64 }, // E4
      { bar: 7, beat: 0, dur: 3.0, note: 64 }, // E4
    ];
  } else if (trackId === 'world_5_prismatic_overdrive') {
    // Polymorphism City: Fast energetic cybernetic leads in B Minor
    melodyNotes = [
      { bar: 2, beat: 0, dur: 1.0, note: 71 }, // B4
      { bar: 2, beat: 1.5, dur: 1.0, note: 74 }, // D5
      { bar: 3, beat: 0, dur: 1.5, note: 78 }, // F#5
      { bar: 3, beat: 2, dur: 1.0, note: 76 }, // E5
      { bar: 4, beat: 0, dur: 1.0, note: 79 }, // G5
      { bar: 4, beat: 1.5, dur: 1.0, note: 78 }, // F#5
      { bar: 5, beat: 0, dur: 2.0, note: 74 }, // D5
      { bar: 6, beat: 0, dur: 1.0, note: 76 }, // E5
      { bar: 6, beat: 1.5, dur: 1.5, note: 74 }, // D5
      { bar: 7, beat: 0, dur: 3.0, note: 71 }, // B4
    ];
  } else if (trackId === 'world_6_hex_void_echoes') {
    // Memory Dimension: Eerie spacious echoes in C Minor
    melodyNotes = [
      { bar: 2, beat: 0, dur: 2.5, note: 72 }, // C5
      { bar: 3, beat: 0, dur: 2.0, note: 75 }, // Eb5
      { bar: 4, beat: 0, dur: 2.0, note: 74 }, // D5
      { bar: 4, beat: 2.5, dur: 1.0, note: 70 }, // Bb4
      { bar: 5, beat: 0, dur: 2.5, note: 68 }, // Ab4
      { bar: 6, beat: 0, dur: 2.0, note: 70 }, // Bb4
      { bar: 7, beat: 0, dur: 3.0, note: 72 }, // C5
    ];
  } else if (trackId === 'world_7_starlight_constellation' || trackId === 'starlight-nexus') {
    // STL Galaxy: Uplifting cosmic dreamwave in F Major
    melodyNotes = [
      { bar: 2, beat: 0, dur: 1.0, note: 72 }, // C5
      { bar: 2, beat: 1.5, dur: 1.0, note: 74 }, // D5
      { bar: 3, beat: 0, dur: 2.0, note: 77 }, // F5
      { bar: 4, beat: 0, dur: 1.5, note: 76 }, // E5
      { bar: 4, beat: 2, dur: 1.0, note: 72 }, // C5
      { bar: 5, beat: 0, dur: 2.0, note: 74 }, // D5
      { bar: 6, beat: 0, dur: 1.5, note: 77 }, // F5
      { bar: 6, beat: 2, dur: 1.0, note: 79 }, // G5
      { bar: 7, beat: 0, dur: 3.0, note: 81 }, // A5
    ];
  } else if (trackId === 'world_8_core_meltdown') {
    // Core Compiler: High intensity boss darksynth in D Minor
    melodyNotes = [
      { bar: 2, beat: 0, dur: 0.8, note: 74 }, // D5
      { bar: 2, beat: 1.0, dur: 0.8, note: 74 }, // D5
      { bar: 2, beat: 2.0, dur: 1.0, note: 77 }, // F5
      { bar: 3, beat: 0, dur: 1.5, note: 81 }, // A5
      { bar: 3, beat: 2, dur: 1.0, note: 79 }, // G5
      { bar: 4, beat: 0, dur: 1.0, note: 82 }, // Bb5
      { bar: 4, beat: 1.5, dur: 1.0, note: 81 }, // A5
      { bar: 5, beat: 0, dur: 2.0, note: 77 }, // F5
      { bar: 6, beat: 0, dur: 1.0, note: 76 }, // E5
      { bar: 6, beat: 1.5, dur: 1.5, note: 77 }, // F5
      { bar: 7, beat: 0, dur: 3.0, note: 74 }, // D5
    ];
  } else {
    // Earth Prime / Neon Horizon Lead
    melodyNotes = [
      { bar: 2, beat: 0, dur: 1.5, note: 74 }, // D5
      { bar: 2, beat: 2, dur: 1.0, note: 77 }, // F5
      { bar: 3, beat: 0, dur: 2.0, note: 76 }, // E5
      { bar: 3, beat: 2.5, dur: 1.0, note: 72 }, // C5
      { bar: 4, beat: 0, dur: 1.5, note: 74 }, // D5
      { bar: 4, beat: 2, dur: 1.0, note: 79 }, // G5
      { bar: 5, beat: 0, dur: 2.0, note: 77 }, // F5
      { bar: 6, beat: 0, dur: 1.5, note: 81 }, // A5
      { bar: 6, beat: 2, dur: 1.0, note: 79 }, // G5
      { bar: 7, beat: 0, dur: 3.0, note: 74 }, // D5
    ];
  }

  melodyNotes.forEach((m) => {
    const noteTime = m.bar * barSec + m.beat * beatSec;
    const durSec = m.dur * beatSec;
    const freq = m2f(m.note);

    const leadOsc = actx.createOscillator();
    leadOsc.type = 'sawtooth';
    leadOsc.frequency.setValueAtTime(freq, noteTime);

    // Subtle vibrato
    const lfo = actx.createOscillator();
    const lfoGain = actx.createGain();
    lfo.frequency.setValueAtTime(5.5, noteTime);
    lfoGain.gain.setValueAtTime(6.0, noteTime);
    lfo.connect(leadOsc.frequency);
    lfo.start(noteTime + 0.15);
    lfo.stop(noteTime + durSec);

    const leadFilter = actx.createBiquadFilter();
    leadFilter.type = 'lowpass';
    leadFilter.Q.setValueAtTime(3, noteTime);
    leadFilter.frequency.setValueAtTime(3200, noteTime);

    const leadGain = actx.createGain();
    leadGain.gain.setValueAtTime(0.001, noteTime);
    leadGain.gain.linearRampToValueAtTime(0.18, noteTime + 0.05);
    leadGain.gain.setValueAtTime(0.18, noteTime + durSec - 0.08);
    leadGain.gain.linearRampToValueAtTime(0.001, noteTime + durSec);

    leadOsc.connect(leadFilter);
    leadFilter.connect(leadGain);
    leadGain.connect(masterGain);
    leadGain.connect(delayL);
    leadGain.connect(delayR);

    leadOsc.start(noteTime);
    leadOsc.stop(noteTime + durSec);
  });

  // Render the audio graph to an AudioBuffer
  const renderedBuffer = await actx.startRendering();

  // Convert buffer to standard WAV Blob & Object URL
  const wavBlob = audioBufferToWavBlob(renderedBuffer);
  const objectUrl = URL.createObjectURL(wavBlob);

  trackUrlCache.set(trackId, objectUrl);
  return objectUrl;
}
