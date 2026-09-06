// Space-Time Sector & Region Ambiance Profiles
// Defines the acoustic, cosmic drone, and musical profiles for all parallel sectors and regions

export interface SectorAmbianceProfile {
  id: string;
  sectorCode: string;
  sectorName: string;
  regionTitle: string;
  tagline: string;
  soundscapeDesc: string;
  trackId: string;
  color: string;
  accentColor: string;
  icon: string;
  droneConfig: {
    rootFreq: number; // Hz (sub-bass / fundamental)
    harmonicRatio: number; // e.g. 1.5 (fifth), 1.25 (major third)
    filterCutoff: number; // Hz for low-pass space atmospheric filter
    filterQ: number; // Resonance
    lfoSpeed: number; // Modulation speed in Hz
    noiseLevel: number; // Cosmic wind / background pink noise gain
    waveType: OscillatorType;
  };
}

export const SECTOR_AMBIANCE_PROFILES: Record<string, SectorAmbianceProfile> = {
  // Sector 01: Earth Prime (Syntax & Variables)
  world_1: {
    id: 'world_1',
    sectorCode: 'SECTOR 01',
    sectorName: 'Earth Prime',
    regionTitle: 'Neon Cyber Metropolis',
    tagline: 'High-voltage analog pulses & electric grid resonance',
    soundscapeDesc: 'Warm 65Hz analog sub-bass drone with shimmering 116 BPM synthwave poly-leads and neon street reflections.',
    trackId: 'world_1_neon_prime',
    color: '#00E5FF',
    accentColor: '#38BDF8',
    icon: '⚡',
    droneConfig: {
      rootFreq: 65.41, // C2
      harmonicRatio: 1.5, // G2
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.08,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 02: Function Nexus (Modular Logic & Recursion)
  world_2: {
    id: 'world_2',
    sectorCode: 'SECTOR 02',
    sectorName: 'Function Nexus',
    regionTitle: 'Algorithmic Crystal Orbit',
    tagline: 'Cascading recursive pulses & ultraviolet crystalline harmonics',
    soundscapeDesc: 'Hypnotic 55Hz root note modulating through crystal delay lines and arpeggiated logic streams.',
    trackId: 'world_2_recursive_nexus',
    color: '#A855F7',
    accentColor: '#C084FC',
    icon: '🔮',
    droneConfig: {
      rootFreq: 55.0, // A1
      harmonicRatio: 1.333, // D2
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.08,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 03: Object Realm (OOP & Class Blueprints)
  world_3: {
    id: 'world_3',
    sectorCode: 'SECTOR 03',
    sectorName: 'Object Realm',
    regionTitle: 'Blueprint Celestial Citadel',
    tagline: 'Regal architectural chords & golden modular foundations',
    soundscapeDesc: 'Deep resonant 49Hz foundational low-end accompanied by regal major chord poly-pads and harmonic bells.',
    trackId: 'world_3_architectural_matrix',
    color: '#FFB703',
    accentColor: '#FBBF24',
    icon: '🏛️',
    droneConfig: {
      rootFreq: 48.99, // G1
      harmonicRatio: 1.25, // B1
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.06,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 04: Inheritance Kingdom (Hierarchy & Ancestry)
  world_4: {
    id: 'world_4',
    sectorCode: 'SECTOR 04',
    sectorName: 'Inheritance Kingdom',
    regionTitle: 'Biomechanical Canopy Sanctuary',
    tagline: 'Living code foliage, organic tree resonance & sub-harmonic canopy',
    soundscapeDesc: 'Warm 41Hz bio-frequency sub-pad swept by gentle low-pass wind filters and emerald organic hums.',
    trackId: 'world_4_biomechanical_canopy',
    color: '#00FFB2',
    accentColor: '#34D399',
    icon: '🌿',
    droneConfig: {
      rootFreq: 41.2, // E1
      harmonicRatio: 1.5, // B1
      filterCutoff: 200,
      filterQ: 0.5,
      lfoSpeed: 0.05,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 05: Polymorphism City (Dynamic Dispatch & Overriding)
  world_5: {
    id: 'world_5',
    sectorCode: 'SECTOR 05',
    sectorName: 'Polymorphism City',
    regionTitle: 'Quantum Shifting Metropolis',
    tagline: 'Phase-modulating laser conduits & high-speed virtual tables',
    soundscapeDesc: 'Energetic 61Hz frequency-modulated drone that continuously shifts phase, paired with driving cyber-wave beats.',
    trackId: 'world_5_prismatic_overdrive',
    color: '#EC4899',
    accentColor: '#F472B6',
    icon: '💎',
    droneConfig: {
      rootFreq: 61.74, // B1
      harmonicRatio: 1.333,
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.08,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 06: Memory Dimension (Pointers, Heap & Raw Allocations)
  world_6: {
    id: 'world_6',
    sectorCode: 'SECTOR 06',
    sectorName: 'Memory Dimension',
    regionTitle: 'Hex Void Abyssal Expanse',
    tagline: 'Deep vacuum sub-tones & echoing memory address reverberations',
    soundscapeDesc: 'Sub-bass 32Hz abyssal void hum with metallic pointer echoes, simulating the infinite depths of unmanaged heap space.',
    trackId: 'world_6_hex_void_echoes',
    color: '#818CF8',
    accentColor: '#A5B4FC',
    icon: '👻',
    droneConfig: {
      rootFreq: 32.7, // C1 (Sub-bass void)
      harmonicRatio: 1.5, // G1
      filterCutoff: 180,
      filterQ: 0.5,
      lfoSpeed: 0.04,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 07: STL Galaxy (Templates & Container Algorithms)
  world_7: {
    id: 'world_7',
    sectorCode: 'SECTOR 07',
    sectorName: 'STL Galaxy',
    regionTitle: 'Celestial Starlight Nebula',
    tagline: 'Nebular solar winds, template harmonics & sparkling constellation bells',
    soundscapeDesc: 'Ethereal 43Hz cosmic drone coupled with sparkling 440Hz pentatonic star plucks and uplifting dreamwave rhythms.',
    trackId: 'world_7_starlight_constellation',
    color: '#38BDF8',
    accentColor: '#7DD3FC',
    icon: '🌌',
    droneConfig: {
      rootFreq: 43.65, // F1
      harmonicRatio: 1.5, // C2
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.07,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Sector 08: Core Compiler (The Master Execution Engine)
  world_8: {
    id: 'world_8',
    sectorCode: 'SECTOR 08',
    sectorName: 'Core Compiler',
    regionTitle: 'Singularity Reactor Matrix',
    tagline: 'Industrial darksynth roar & particle accelerator alarms',
    soundscapeDesc: 'Deep 36Hz warm reactor hum and driving cyber darksynth.',
    trackId: 'world_8_core_meltdown',
    color: '#FF4D6D',
    accentColor: '#FB7185',
    icon: '🔥',
    droneConfig: {
      rootFreq: 36.71, // D1
      harmonicRatio: 1.333, // G1
      filterCutoff: 200,
      filterQ: 0.5,
      lfoSpeed: 0.08,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Global Hub: Galactic Starport (Dashboard)
  dashboard: {
    id: 'dashboard',
    sectorCode: 'STARPORT NEXUS',
    sectorName: 'Galactic Command Starport',
    regionTitle: 'Command Deck & Transit Hub',
    tagline: 'Warm interstellar telemetry & starport propulsion hum',
    soundscapeDesc: 'Calm 52Hz gravitational stabilizer hum layered with ambient telemetry radio and smooth cyber-funk synthesizer.',
    trackId: 'world_1_neon_prime',
    color: '#00E5FF',
    accentColor: '#7C3AED',
    icon: '🚀',
    droneConfig: {
      rootFreq: 52.0,
      harmonicRatio: 1.5,
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.05,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Global Region: Astral Cartography (Galaxy Map)
  map: {
    id: 'map',
    sectorCode: 'ASTRAL MAP',
    sectorName: 'Galaxy Navigation Array',
    regionTitle: 'Inter-Sector Waypoint Gateway',
    tagline: 'Deep space telescope frequencies & stellar drift hum',
    soundscapeDesc: 'Expansive 46Hz space drone with solar wind sweeps, guiding navigators across parallel multiverse corridors.',
    trackId: 'world_7_starlight_constellation',
    color: '#818CF8',
    accentColor: '#00E5FF',
    icon: '🧭',
    droneConfig: {
      rootFreq: 46.25,
      harmonicRatio: 1.5,
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.05,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Global Region: Practice Sandbox
  practice: {
    id: 'practice',
    sectorCode: 'HOLO-LAB',
    sectorName: 'Compiler Holo-Deck',
    regionTitle: 'Zero-Gravity Isolated Laboratory',
    tagline: 'Clean lab room ambiance & quantum compute cycle whir',
    soundscapeDesc: 'Focused 58Hz sub-carrier tone designed for deep analytical concentration and creative experimentation.',
    trackId: 'world_2_recursive_nexus',
    color: '#10B981',
    accentColor: '#34D399',
    icon: '🧪',
    droneConfig: {
      rootFreq: 58.27,
      harmonicRatio: 1.333,
      filterCutoff: 200,
      filterQ: 0.5,
      lfoSpeed: 0.05,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Global Region: Hall of Heroes (Leaderboard)
  leaderboard: {
    id: 'leaderboard',
    sectorCode: 'APEX HALL',
    sectorName: 'Hall of Apex Coders',
    regionTitle: 'Astral Pantheon Gallery',
    tagline: 'Resonant triumphal brass pads & celestial monument chime',
    soundscapeDesc: 'Majestic 50Hz monument drone reverbing with harmonic overtones honoring the top guardians of the multiverse.',
    trackId: 'world_3_architectural_matrix',
    color: '#F59E0B',
    accentColor: '#FBBF24',
    icon: '🏆',
    droneConfig: {
      rootFreq: 49.0,
      harmonicRatio: 1.5,
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.05,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },

  // Global Region: Glitch Colosseum (Arena)
  arena: {
    id: 'arena',
    sectorCode: 'COLOSSEUM',
    sectorName: 'Glitch Colosseum',
    regionTitle: 'Dimensional Hazard Arena',
    tagline: 'High-tension combat pulse & warning siren harmonics',
    soundscapeDesc: 'Warm sub-frequency drone preparing guardians for competitive duel bouts.',
    trackId: 'world_8_core_meltdown',
    color: '#EF4444',
    accentColor: '#F87171',
    icon: '⚔️',
    droneConfig: {
      rootFreq: 55.0,
      harmonicRatio: 1.333,
      filterCutoff: 220,
      filterQ: 0.5,
      lfoSpeed: 0.08,
      noiseLevel: 0.005,
      waveType: 'sine',
    },
  },
};

export function getSectorProfile(sectorOrUniverseId: string): SectorAmbianceProfile {
  return (
    SECTOR_AMBIANCE_PROFILES[sectorOrUniverseId] ||
    SECTOR_AMBIANCE_PROFILES.world_1 ||
    SECTOR_AMBIANCE_PROFILES.dashboard
  );
}
