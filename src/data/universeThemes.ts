import React from 'react';

export interface SquadMember {
  id: string;
  name: string;
  callsign: string;
  role: string;
  avatar: string;
  bio: string;
  specialAbility: string;
  quote: string;
}

export interface UniverseTeam {
  name: string;
  division: string;
  motto: string;
  insignia: string;
  crestIcon: string;
  color: string;
  accentColor: string;
  squadPerk: {
    name: string;
    description: string;
    combatBonus: string;
  };
  members: SquadMember[];
}

export interface UniverseVisualTheme {
  id: string;
  universeName: string;
  order: number;
  landmark: string;
  atmosphere: string;
  skylineStyle: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  bgGradient: string;
  particles: string[];
  team: UniverseTeam;
}

export const UNIVERSE_THEMES: Record<string, UniverseVisualTheme> = {
  world_1: {
    id: 'world_1',
    universeName: 'Earth Prime',
    order: 1,
    landmark: 'Genesis Matrix Solar Relay & Wireframe Orbitals',
    atmosphere: 'High-voltage electric blue atmosphere with cascading matrix bitstreams and crystalline data ribbons.',
    skylineStyle: 'Neon-lined terrestrial skyscrapers and hovering atmospheric conduits.',
    primaryColor: '#00E5FF',
    accentColor: '#00B4D8',
    glowColor: 'rgba(0, 229, 255, 0.4)',
    bgGradient: 'from-[#031525] via-[#071F36] to-[#050C1A]',
    particles: ['#00E5FF', '#38BDF8', '#7DD3FC', '#0284C7'],
    team: {
      name: 'Logic Vanguard Unit-01',
      division: 'Genesis Planetary Defense Core',
      motto: 'From Binary Sparks to Continental Power',
      insignia: '⚡🌐',
      crestIcon: 'Globe',
      color: '#00E5FF',
      accentColor: '#00B4D8',
      squadPerk: {
        name: 'Arithmetic Resonance Surge',
        description: 'Amplifies basic variable computations and optimizes standard input/output bandwidth.',
        combatBonus: '+15% Logic Attack Damage against Bit Glitchers and Overflow anomalies.',
      },
      members: [
        {
          id: 'ada-bitstream',
          name: 'Commander Ada Bitstream',
          callsign: 'ZERO-ONE',
          role: 'Syntax Arbiter & Squadron Leader',
          avatar: '👩‍🚀',
          bio: 'Legendary space architect who formulated the first self-healing variable buffers across Earth Prime.',
          specialAbility: 'Type Harmonizer — Calibrates mismatched double and int conversions instantaneously.',
          quote: '“Precision in the smallest bit prevents the collapse of entire continents.”',
        },
        {
          id: 'lex-cat',
          name: 'Lex "Byte-Cat" Purr',
          callsign: 'GLITCH-SNIFFER',
          role: 'Combat Sensor & Anomaly Detector',
          avatar: '🐱‍💻',
          bio: 'A cybernetically enhanced feline with infrared optical sensors tailored to sniff out corrupted boolean flags.',
          specialAbility: 'Semicolon Scent — Instantly pinpoints omitted termination delimiters.',
          quote: '“Mrow! That boolean state was flipped by the Void Specter!”',
        },
        {
          id: 'nova-turing',
          name: 'Dr. Nova Turing',
          callsign: 'MATH-MATRIX',
          role: 'Arithmetic Engine Specialist',
          avatar: '👨‍🔬',
          bio: 'Quantum mathematician whose modular arithmetic equations power Earth Prime’s magnetic defense grid.',
          specialAbility: 'Modulus Barrier — Neutralizes integer overflow shockwaves.',
          quote: '“Numbers do not deceive. Only uninitialized memory lies.”',
        },
      ],
    },
  },

  world_2: {
    id: 'world_2',
    universeName: 'Function Nexus',
    order: 2,
    landmark: 'Subroutine Skyline & Quantum Call-Stack Monoliths',
    atmosphere: 'Deep ultraviolet twilight punctuated by soaring neon magenta fiber bridges and floating return-value conduits.',
    skylineStyle: 'Cyberpunk metropolis towers glowing with recursive function declarations.',
    primaryColor: '#7C3AED',
    accentColor: '#C084FC',
    glowColor: 'rgba(124, 58, 237, 0.45)',
    bgGradient: 'from-[#190933] via-[#2A1152] to-[#0A0414]',
    particles: ['#7C3AED', '#A855F7', '#C084FC', '#E879F9'],
    team: {
      name: 'Subroutine Cyber-Ops (SCO)',
      division: 'Call-Stack Infiltration Wing',
      motto: 'Return Values, Break Limitations',
      insignia: '🔮⚡',
      crestIcon: 'Cpu',
      color: '#7C3AED',
      accentColor: '#C084FC',
      squadPerk: {
        name: 'Stack Frame Overcharge',
        description: 'Guarantees recursion safety and accelerates array traversal indexing by 2x.',
        combatBonus: '+20% Critical Damage on function calls and string manipulation operations.',
      },
      members: [
        {
          id: 'vector-vance',
          name: 'Captain Vector Vance',
          callsign: 'RECURSION-ONE',
          role: 'Call-Stack Commander',
          avatar: '🤖',
          bio: 'A cyber-synth tactical commander capable of executing 10,000 subroutines simultaneously without stack overflow.',
          specialAbility: 'Tail-Call Optimization — Deflects enemy counter-attacks during nested iterations.',
          quote: '“Every complex problem is merely a sequence of elegant sub-functions waiting to execute.”',
        },
        {
          id: 'kira-stack',
          name: 'Kira Stack-Tracer',
          callsign: 'SCOPE-GHOST',
          role: 'Memory Scope Infiltrator',
          avatar: '🧝‍♀️',
          bio: 'Master of local and global scope variables, specializing in breaking through corrupted namespace barriers.',
          specialAbility: 'Scope Cloak — Prevents variables from leaking into hostile scopes.',
          quote: '“Stay within your scope, or the compiler will optimize you out.”',
        },
        {
          id: 'byte-hound',
          name: 'Byte-Hound Unit-7',
          callsign: 'ARRAY-TRACKER',
          role: 'Boundary Patrol Cyber-K9',
          avatar: '🐕‍🦺',
          bio: 'Military-grade tactical hound trained to guard array indices and intercept out-of-bounds attempts.',
          specialAbility: 'Index Shield — Barks warnings whenever array limits are approached.',
          quote: '“*Woof!* Array index [5] out of bounds detected in sector 2!”',
        },
      ],
    },
  },

  world_3: {
    id: 'world_3',
    universeName: 'Object Realm',
    order: 3,
    landmark: 'Golden Polyhedral Citadel of Encapsulated Sanctums',
    atmosphere: 'Radiant golden amber radiance with floating geometric class blueprints and spinning constructor rings.',
    skylineStyle: 'Sacred architectural spires protected by glowing public and private encapsulation shields.',
    primaryColor: '#FFD166',
    accentColor: '#F59E0B',
    glowColor: 'rgba(255, 209, 102, 0.45)',
    bgGradient: 'from-[#291A04] via-[#3B2608] to-[#0E0902]',
    particles: ['#FFD166', '#FBBF24', '#F59E0B', '#FDE68A'],
    team: {
      name: 'Class Architects & Sanctum Knights',
      division: 'Encapsulation Citadel Order',
      motto: 'Encapsulate Truth, Instantiate Victory',
      insignia: '🛡️🏛️',
      crestIcon: 'Box',
      color: '#FFD166',
      accentColor: '#F59E0B',
      squadPerk: {
        name: 'Constructor Fortress Aegis',
        description: 'Reinforces object boundaries with private access modifiers, preventing state corruption.',
        combatBonus: 'Generates an indestructible 30 HP energy shield whenever a valid class constructor is initialized.',
      },
      members: [
        {
          id: 'thorne-architect',
          name: 'Grand Architect Thorne',
          callsign: 'OBJECT-LORD',
          role: 'Master Instantiator & Grand Paladin',
          avatar: '🧙‍♂️',
          bio: 'Keeper of the sacred OOP Blueprints who carved the first encapsulation sanctuaries from crystal bedrock.',
          specialAbility: 'Default Constructor Surge — Instantiates reinforced protective drones on demand.',
          quote: '“An object without encapsulation is a castle without walls.”',
        },
        {
          id: 'isolde-private',
          name: 'Lady Isolde Private-Key',
          callsign: 'GETTER-GUARD',
          role: 'Access Modifier Sentinel',
          avatar: '🛡️',
          bio: 'Guardian of private member variables who smites unauthorized direct memory writes with radiant light.',
          specialAbility: 'Getter/Setter Aegis — Grants absolute data integrity against glitch probes.',
          quote: '“Private means private. Access via authorized public methods only!”',
        },
        {
          id: 'gizmo-fabricator',
          name: 'Gizmo Constructor',
          callsign: 'AUTO-FABRIC',
          role: 'Destructor & Resource Mechanic',
          avatar: '🦾',
          bio: 'Mechanical prodigy who ensures that every instantiated object is gracefully deallocated when leaving scope.',
          specialAbility: 'Destructor Trap — Releases an explosive EMP wave when objects are destroyed.',
          quote: '“I build them strong, and clean them up clean!”',
        },
      ],
    },
  },

  world_4: {
    id: 'world_4',
    universeName: 'Inheritance Kingdom',
    order: 4,
    landmark: 'Bioluminescent World-Tree of Ancestral Class Trees',
    atmosphere: 'Verdant emerald nebula woven with glowing DNA-like class inheritance helixes and floating ancient monoliths.',
    skylineStyle: 'Organic fractal branches of base and derived classes spiraling into the starry heavens.',
    primaryColor: '#00FFB2',
    accentColor: '#10B981',
    glowColor: 'rgba(0, 255, 178, 0.45)',
    bgGradient: 'from-[#03241A] via-[#053628] to-[#02140F]',
    particles: ['#00FFB2', '#34D399', '#10B981', '#6EE7B7'],
    team: {
      name: 'Dynasty Heirguard',
      division: 'Royal Lineage Protection Legion',
      motto: 'Ancestral Logic, Inherited Might',
      insignia: '👑🧬',
      crestIcon: 'Shield',
      color: '#00FFB2',
      accentColor: '#10B981',
      squadPerk: {
        name: 'Heritage Ancestral Aura',
        description: 'Derives attributes and combat enhancements from legendary Base Class ancestors.',
        combatBonus: '+25% Bonus XP and Coins on all derived class and inheritance puzzle completions.',
      },
      members: [
        {
          id: 'valerius-paladin',
          name: 'High Paladin Valerius',
          callsign: 'BASE-CLASS',
          role: 'Dynastic Guardian & Base Protector',
          avatar: '🧝‍♂️',
          bio: 'Centuries-old warrior whose genetic code forms the base class for thousands of derived kingdom champions.',
          specialAbility: 'Super-Constructor Rally — Passes down +25 attack power to all derived allies.',
          quote: '“Stand tall on the shoulders of your ancestral base classes.”',
        },
        {
          id: 'aurelia-virtual',
          name: 'Princess Aurelia Polymorph',
          callsign: 'OVERRIDE-STAR',
          role: 'Virtual Method Heiress',
          avatar: '👸',
          bio: 'Noble heiress capable of overriding ancestral behaviors on the fly to adapt to unpredictable enemy tactics.',
          specialAbility: 'Dynamic Override — Swaps weapon affinities mid-battle without recompilation.',
          quote: '“Tradition guides our blood, but innovation overrides our destiny.”',
        },
        {
          id: 'robin-scope',
          name: 'Ranger Robin Scope',
          callsign: 'PROTECTED-ARROW',
          role: 'Protected Scope Marksman',
          avatar: '🏹',
          bio: 'Forest sniper who patrols the protected class boundaries, ensuring friendlies pass while intruders are struck down.',
          specialAbility: 'Scope Piercer — Fires arrows that bypass diamond-inheritance deadlock loops.',
          quote: '“Visible only to family and allies; invisible to the hostile world.”',
        },
      ],
    },
  },

  world_5: {
    id: 'world_5',
    universeName: 'Polymorphism City',
    order: 5,
    landmark: 'Shifting Prism Citadel & Dynamic V-Table Spire',
    atmosphere: 'Neon rose and crimson holographic prism fields that dynamically warp and refract incoming energy.',
    skylineStyle: 'Polymorphic geometric skyscrapers that change shape and function in real time.',
    primaryColor: '#FF4D6D',
    accentColor: '#FB7185',
    glowColor: 'rgba(255, 77, 109, 0.45)',
    bgGradient: 'from-[#2D0612] via-[#420B1C] to-[#120207]',
    particles: ['#FF4D6D', '#F43F5E', '#FDA4AF', '#E11D48'],
    team: {
      name: 'V-Table Shape-Shifters',
      division: 'Dynamic Dispatch Recon Fleet',
      motto: 'One Interface, Infinite Manifestations',
      insignia: '🎭🌌',
      crestIcon: 'Sparkles',
      color: '#FF4D6D',
      accentColor: '#FB7185',
      squadPerk: {
        name: 'Late-Binding Dynamic Flux',
        description: 'Resolves function pointers at runtime to exploit shifting boss elemental weaknesses.',
        combatBonus: 'Reflects 30% of incoming boss damage back to the attacker as pure runtime dissonance.',
      },
      members: [
        {
          id: 'mirage-caster',
          name: 'Mirage the Dynamic Caster',
          callsign: 'VIRTUAL-PURE',
          role: 'Dynamic Dispatch Commander',
          avatar: '🦹',
          bio: 'Mysterious sorcerer who manipulates virtual method tables like musical scores, morphing reality at will.',
          specialAbility: 'Abstract Manifestation — Instantiates pure virtual interfaces into kinetic shockwaves.',
          quote: '“One call signature, a thousand deadly outcomes.”',
        },
        {
          id: 'echo-siren',
          name: 'Echo the Virtual Siren',
          callsign: 'VTABLE-HARMONY',
          role: 'Acoustic Runtime Specialist',
          avatar: '🧜‍♀️',
          bio: 'Cyber-acoustic engineer whose harmonic frequencies keep runtime pointers aligned and free from desync.',
          specialAbility: 'Pointer Resonance — Eliminates runtime invocation latency completely.',
          quote: '“Listen closely: the V-table whispers the true destination.”',
        },
        {
          id: 'shift-bot',
          name: 'Shift Bot R-9',
          callsign: 'DYNAMIC-CAST',
          role: 'Polymorphic Mech Enforcer',
          avatar: '🦿',
          bio: 'Heavy transforming war-machine that shifts between tank, fighter, and artillery modes instantly.',
          specialAbility: 'Downcast Blast — Pierces through heavily armored boss defenses.',
          quote: '“Morphing interface profile... Target locked for polymorphic strike.”',
        },
      ],
    },
  },

  world_6: {
    id: 'world_6',
    universeName: 'Memory Dimension',
    order: 6,
    landmark: 'Astral Hexadecimal Hex-Planes & Raw Address Monoliths',
    atmosphere: 'Violet cosmic void with floating raw memory blocks (0x7FFE...), glowing pointer laser conduits, and heap galaxies.',
    skylineStyle: 'Floating crystal memory lattices connected by radiant pointer tether lines.',
    primaryColor: '#8B5CF6',
    accentColor: '#06B6D4',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    bgGradient: 'from-[#190C38] via-[#241052] to-[#0A0317]',
    particles: ['#8B5CF6', '#A78BFA', '#06B6D4', '#67E8F9'],
    team: {
      name: 'Heap & Pointer Recon Squad',
      division: 'Astral Memory Deep-Clean Unit',
      motto: 'Trace Every Address, Cleanse Every Leak',
      insignia: '🧬💎',
      crestIcon: 'Layers',
      color: '#8B5CF6',
      accentColor: '#06B6D4',
      squadPerk: {
        name: 'RAII Automatic Deallocation Field',
        description: 'Guarantees zero memory leaks and wraps raw memory in impenetrable Smart Pointer shields.',
        combatBonus: 'Restores 25 HP instantly whenever a pointer or reference is safely dereferenced.',
      },
      members: [
        {
          id: 'alistair-null',
          name: 'Commander Alistair 0xNull',
          callsign: 'DEREF-KING',
          role: 'Raw Address Sovereign',
          avatar: '🕵️‍♂️',
          bio: 'Veteran investigator who navigated the Null Pointer Void and returned with the legendary Address-of Blade.',
          specialAbility: 'Null Check Aegis — Grants immunity to segmentation faults and null-pointer strikes.',
          quote: '“Never de-reference a pointer before verifying its celestial address.”',
        },
        {
          id: 'dr-freya-alloc',
          name: 'Dr. Freya Allocator',
          callsign: 'HEAP-CHEMIST',
          role: 'Dynamic Memory Alchemist',
          avatar: '👩‍🔬',
          bio: 'Pioneered zero-fragmentation heap management algorithms across the outer memory dimensions.',
          specialAbility: 'Smart Pointer Serum — Automatically transforms wild pointers into shared and unique safe references.',
          quote: '“Heap memory is sacred; treat every allocated byte with reverence.”',
        },
        {
          id: 'scavenger-rust',
          name: 'Scavenger Rust',
          callsign: 'LEAK-SWEEPER',
          role: 'Memory Leak Annihilator Drone',
          avatar: '🧹',
          bio: 'Autonomous vacuum drone deployed to suck up dangling pointers and orphaned memory fragments.',
          specialAbility: 'Garbage Purge — Clears hazardous glitch debuffs from the combat field.',
          quote: '“*BEEP BOOP* 1,024 bytes of memory leak eradicated!”',
        },
      ],
    },
  },

  world_7: {
    id: 'world_7',
    universeName: 'STL Galaxy',
    order: 7,
    landmark: 'Container Nebula Cluster & Planetary Iterator Rings',
    atmosphere: 'Deep stellar starfield populated by ringed planets shaped like dynamic vectors, hash maps, and binary search trees.',
    skylineStyle: 'Cosmic armada of template starships navigating through O(log N) algorithm hyper-lanes.',
    primaryColor: '#3B82F6',
    accentColor: '#F97316',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    bgGradient: 'from-[#071938] via-[#0E2856] to-[#040C1C]',
    particles: ['#3B82F6', '#60A5FA', '#F97316', '#FB923C'],
    team: {
      name: 'Template Astral Fleet',
      division: 'Standard Container Armada',
      motto: 'Standardized Power, Infinite Capacity',
      insignia: '🚀🌠',
      crestIcon: 'Database',
      color: '#3B82F6',
      accentColor: '#F97316',
      squadPerk: {
        name: 'O(log N) Algorithmic Warp Drive',
        description: 'Optimizes template compilation and executes standard sorting algorithms at lightspeed.',
        combatBonus: '+30% Attack Speed and instant access to optimal algorithmic hints during complex missions.',
      },
      members: [
        {
          id: 'admiral-cassian',
          name: 'Admiral Cassian Vector',
          callsign: 'PUSH-BACK',
          role: 'Armada Flagship Commander',
          avatar: '👨‍✈️',
          bio: 'Decorated starship commander whose fleet can dynamically resize its strike capacity under heavy fire.',
          specialAbility: 'Dynamic Resize Volley — Fires salvos that scale exponentially with container size.',
          quote: '“Our capacity is unlimited; push back the invaders!”',
        },
        {
          id: 'lyra-hash',
          name: 'Astro-Navigator Lyra Map',
          callsign: 'KEY-VALUE',
          role: 'Key-Value Cartographer',
          avatar: '👩‍🚀',
          bio: 'Cartographer who mapped every sector of the STL Galaxy using O(1) hash maps and red-black tree charts.',
          specialAbility: 'Hash Leap — Instantly teleports team past hostile algorithmic bottlenecks.',
          quote: '“Give me a key, and I will unlock any coordinate in the galaxy.”',
        },
        {
          id: 'iterator-alpha',
          name: 'Iterator Drone Alpha',
          callsign: 'BEGIN-END',
          role: 'Container Traversal Scout',
          avatar: '🛸',
          bio: 'High-speed reconnaissance drone capable of scanning sequences forward, reverse, and bidirectional.',
          specialAbility: 'Range-Based Scan — Highlights enemy vulnerabilities across the entire squad formation.',
          quote: '“Scanning from begin() to end()... All anomalies marked for destruction.”',
        },
      ],
    },
  },

  world_8: {
    id: 'world_8',
    universeName: 'Core Compiler',
    order: 8,
    landmark: 'Primordial Source Volcano & Molten Microcode Reactor',
    atmosphere: 'Raging volcanic plasma storm with spinning GCC/Clang -O3 optimization rings and molten raw assembly conduits.',
    skylineStyle: 'Towering monolithic compiler reactors harnessing the primordial energy of the CodeVerse singularity.',
    primaryColor: '#EF4444',
    accentColor: '#F59E0B',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    bgGradient: 'from-[#330A0A] via-[#4D0F0F] to-[#170303]',
    particles: ['#EF4444', '#F87171', '#F59E0B', '#FBBF24'],
    team: {
      name: 'Kernel Genesis Titans',
      division: 'Primordial Singularity Guardian Order',
      motto: 'Through Optimization, We Transcend Bugs',
      insignia: '🌋🔥',
      crestIcon: 'Terminal',
      color: '#EF4444',
      accentColor: '#F59E0B',
      squadPerk: {
        name: 'Zero-Cost Optimization Singularity',
        description: 'Channel primordial compiler power to strip away all computational overhead.',
        combatBonus: '+50% Mega Strike Damage and permanent immunity to syntax anomalies during the Final Singularity.',
      },
      members: [
        {
          id: 'archon-gcc',
          name: 'Archon GCC The Unyielding',
          callsign: 'OPTIMIZER-O3',
          role: 'High Compiler Overlord',
          avatar: '👑',
          bio: 'Ancient primordial titan who forged the rules of the C++ standard in the heart of the core reactor.',
          specialAbility: 'Dead Code Elimination — Vaporizes corrupt boss shields before they can manifest.',
          quote: '“No inefficiency shall stand before the final optimization pass!”',
        },
        {
          id: 'ignis-linker',
          name: 'Ignis the Symbol Linker',
          callsign: 'RESOLVER-X',
          role: 'Symbolic Fusion Master',
          avatar: '🔥',
          bio: 'Alchemist who weaves disjointed compilation units and binary objects into a single unbreakable whole.',
          specialAbility: 'Symbolic Fusion — Fuses the defensive shields of all 8 universes together.',
          quote: '“Unresolved external symbol? Not while I hold the linker flame!”',
        },
        {
          id: 'valkyrie-jit',
          name: 'Valkyrie JIT',
          callsign: 'ASSEMBLY-BOLT',
          role: 'Microcode Vanguard Valkyrie',
          avatar: '⚡',
          bio: 'Thunder goddess who wields lightning-fast assembly instructions directly upon the silicon processor core.',
          specialAbility: 'Inline Assembly Strike — Delivers devastating critical strikes at clock-cycle speeds.',
          quote: '“Direct to the metal. Zero overhead. Maximum devastation!”',
        },
      ],
    },
  },
};

export function getUniverseTheme(universeId: string): UniverseVisualTheme {
  return UNIVERSE_THEMES[universeId] || UNIVERSE_THEMES.world_1;
}
