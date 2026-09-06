import React from 'react';
import { getUniverseTheme } from '../data/universeThemes';

interface UniverseBackdropProps {
  universeId: string;
  className?: string;
  interactive?: boolean;
  intensity?: 'ambient' | 'vibrant' | 'battle';
}

export const UniverseBackdrop: React.FC<UniverseBackdropProps> = ({
  universeId,
  className = '',
  intensity = 'vibrant',
}) => {
  const theme = getUniverseTheme(universeId);
  const isAbsolute = className.includes('absolute');

  return (
    <div
      className={`pointer-events-none overflow-hidden ${isAbsolute ? '' : 'relative w-full h-full'} ${className}`}
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${theme.primaryColor}22 0%, ${theme.accentColor}0D 45%, #05070d 85%)`,
      }}
    >
      {/* Dynamic Animated Ambient Glow Spots */}
      <div
        className="absolute -top-12 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-35 animate-pulse pointer-events-none"
        style={{ backgroundColor: theme.primaryColor }}
      />
      <div
        className="absolute top-1/3 -right-16 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />

      {/* Universe Specific Atmospheric SVG Landscape Artwork */}
      {universeId === 'world_1' && (
        /* EARTH PRIME: Matrix Conduits, Solar Arrays & Wireframe Planet */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="earth-grid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
            <radialGradient id="earth-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#00527A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Wireframe Hologram Globe */}
          <circle cx="500" cy="300" r="180" fill="url(#earth-core)" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="6 3" className="animate-spin-slow" />
          <ellipse cx="500" cy="300" rx="180" ry="60" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow-reverse" />
          <ellipse cx="500" cy="300" rx="180" ry="120" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.6" className="animate-pulse-slow" />
          <ellipse cx="500" cy="300" rx="60" ry="180" fill="none" stroke="#00B4D8" strokeWidth="1" opacity="0.6" />

          {/* Orbital Satellites & Conduits */}
          <circle cx="340" cy="220" r="6" fill="#00FFB2" filter="drop-shadow(0 0 6px #00FFB2)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <line x1="340" y1="220" x2="200" y2="120" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          <rect x="180" y="110" width="24" height="12" fill="#00E5FF" opacity="0.5" rx="2" />

          <circle cx="670" cy="370" r="5" fill="#FFD166" filter="drop-shadow(0 0 6px #FFD166)" className="animate-ping" style={{ animationDuration: '4s' }} />
          <line x1="670" y1="370" x2="820" y2="450" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

          {/* Ground Matrix Grid */}
          <path d="M 0 500 L 1000 500 M 0 530 L 1000 530 M 0 570 L 1000 570" stroke="#00E5FF" strokeWidth="1" opacity="0.3" />
          <path d="M 500 480 L 100 600 M 500 480 L 300 600 M 500 480 L 500 600 M 500 480 L 700 600 M 500 480 L 900 600" stroke="#00E5FF" strokeWidth="1" opacity="0.25" />

          {/* Laser Scanning Line */}
          <line x1="0" y1="0" x2="1000" y2="0" stroke="#00E5FF" strokeWidth="2" filter="drop-shadow(0 0 8px #00E5FF)" className="animate-laser-sweep" />

          {/* Data Streams */}
          <text x="80" y="80" fill="#00E5FF" opacity="0.6" fontSize="12" fontFamily="monospace">int energy = 100;</text>
          <text x="80" y="105" fill="#00B4D8" opacity="0.5" fontSize="12" fontFamily="monospace">double total = energy * 1.75;</text>
          <text x="750" y="80" fill="#00FFB2" opacity="0.6" fontSize="12" fontFamily="monospace">01000011 00101011</text>
        </svg>
      )}

      {universeId === 'world_2' && (
        /* FUNCTION NEXUS: Cyberpunk Megacity, Call-Stack Monoliths & Neon Magenta Bridges */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="nexus-tower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background Cyber City Skylines */}
          <polygon points="60,600 60,280 140,240 140,600" fill="url(#nexus-tower)" opacity="0.4" />
          <polygon points="170,600 170,180 260,180 260,600" fill="url(#nexus-tower)" opacity="0.6" />
          <polygon points="300,600 300,260 380,220 380,600" fill="url(#nexus-tower)" opacity="0.4" />
          <polygon points="420,600 420,120 520,80 520,600" fill="url(#nexus-tower)" opacity="0.8" />
          <polygon points="560,600 560,200 650,200 650,600" fill="url(#nexus-tower)" opacity="0.5" />
          <polygon points="690,600 690,150 780,110 780,600" fill="url(#nexus-tower)" opacity="0.7" />
          <polygon points="820,600 820,290 920,250 920,600" fill="url(#nexus-tower)" opacity="0.4" />

          {/* Skybridges and laser conduits */}
          <line x1="260" y1="240" x2="420" y2="240" stroke="#E879F9" strokeWidth="2.5" filter="drop-shadow(0 0 8px #E879F9)" />
          <line x1="520" y1="180" x2="690" y2="180" stroke="#00E5FF" strokeWidth="2" filter="drop-shadow(0 0 8px #00E5FF)" />
          <line x1="140" y1="360" x2="820" y2="360" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.7" />

          {/* Moving Horizontal Beam */}
          <line x1="0" y1="240" x2="0" y2="400" stroke="#C084FC" strokeWidth="2" filter="drop-shadow(0 0 10px #E879F9)" className="animate-beam-scan-x" />

          {/* Function Signature Monolith Glyphs */}
          <text x="440" y="60" fill="#E879F9" opacity="0.7" fontSize="13" fontFamily="monospace">int amplify(int x, int y);</text>
          <text x="710" y="90" fill="#00E5FF" opacity="0.6" fontSize="12" fontFamily="monospace">return x * y + 10;</text>
        </svg>
      )}

      {universeId === 'world_3' && (
        /* OBJECT REALM: Polyhedral Citadels, Amber Constructor Rings & Sacred Blueprints */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="gold-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD166" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Floating Polyhedral Citadel */}
          <polygon points="500,100 620,200 580,360 420,360 380,200" fill="url(#gold-core)" stroke="#FFD166" strokeWidth="2" filter="drop-shadow(0 0 16px #FFD166)" />
          <line x1="500" y1="100" x2="500" y2="360" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="500" y1="100" x2="420" y2="360" stroke="#FDE68A" strokeWidth="1" opacity="0.6" />
          <line x1="500" y1="100" x2="580" y2="360" stroke="#FDE68A" strokeWidth="1" opacity="0.6" />

          {/* Rotating Constructor Rings */}
          <ellipse cx="500" cy="230" rx="260" ry="70" fill="none" stroke="#FFD166" strokeWidth="1.5" strokeDasharray="10 5" opacity="0.7" className="animate-spin-slow" />
          <ellipse cx="500" cy="230" rx="340" ry="100" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.4" className="animate-spin-slow-reverse" />

          {/* Floating Access Modifier Shields */}
          <rect x="160" y="260" width="130" height="90" rx="12" fill="#291A04" stroke="#FFD166" strokeWidth="1.5" opacity="0.85" />
          <text x="175" y="295" fill="#FFD166" fontSize="11" fontFamily="monospace">class Hero &#123;</text>
          <text x="185" y="320" fill="#F59E0B" fontSize="10" fontFamily="monospace">private: int hp;</text>
          <text x="175" y="340" fill="#FFD166" fontSize="11" fontFamily="monospace">&#125;;</text>

          <rect x="710" y="260" width="140" height="90" rx="12" fill="#291A04" stroke="#00FFB2" strokeWidth="1.5" opacity="0.85" />
          <text x="725" y="295" fill="#00FFB2" fontSize="11" fontFamily="monospace">public: void heal()</text>
          <text x="735" y="320" fill="#6EE7B7" fontSize="10" fontFamily="monospace">hp += 50;</text>
        </svg>
      )}

      {universeId === 'world_4' && (
        /* INHERITANCE KINGDOM: Bioluminescent World-Tree & Ancestral Lineage Helixes */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="emerald-tree" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Bioluminescent Fractal Branches with Animated Sap Pulse */}
          <path d="M 500 600 Q 500 380 400 240 Q 340 140 240 80" fill="none" stroke="#00FFB2" strokeWidth="4" filter="drop-shadow(0 0 10px #00FFB2)" className="animate-sap-pulse" />
          <path d="M 500 600 Q 500 380 600 240 Q 660 140 760 80" fill="none" stroke="#00FFB2" strokeWidth="4" filter="drop-shadow(0 0 10px #00FFB2)" className="animate-sap-pulse" />
          <path d="M 500 420 Q 460 300 480 180 Q 490 100 500 60" fill="none" stroke="#34D399" strokeWidth="3" opacity="0.8" />

          {/* Lineage Branching Nodes */}
          <circle cx="240" cy="80" r="16" fill="#00FFB2" opacity="0.8" filter="drop-shadow(0 0 12px #00FFB2)" className="animate-pulse-slow" />
          <circle cx="760" cy="80" r="16" fill="#00FFB2" opacity="0.8" filter="drop-shadow(0 0 12px #00FFB2)" className="animate-pulse-slow" />
          <circle cx="500" cy="60" r="20" fill="#6EE7B7" opacity="0.9" filter="drop-shadow(0 0 15px #6EE7B7)" />

          <text x="440" y="38" fill="#00FFB2" fontSize="12" fontFamily="monospace" fontWeight="bold">BaseClass: SpaceCraft</text>
          <text x="135" y="60" fill="#34D399" fontSize="11" fontFamily="monospace">Derived: ScoutVessel</text>
          <text x="730" y="60" fill="#34D399" fontSize="11" fontFamily="monospace">Derived: Dreadnought</text>
        </svg>
      )}

      {universeId === 'world_5' && (
        /* POLYMORPHISM CITY: Shifting Prismatic Glass & Dynamic V-Table Beams */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Dynamic Laser Beams refract from central crystal */}
          <polygon points="500,200 570,300 500,420 430,300" fill="#FF4D6D" opacity="0.7" stroke="#FB7185" strokeWidth="2" filter="drop-shadow(0 0 20px #FF4D6D)" className="animate-pulse-slow" />
          
          <line x1="500" y1="200" x2="150" y2="100" stroke="#FF4D6D" strokeWidth="2.5" filter="drop-shadow(0 0 8px #FF4D6D)" />
          <line x1="570" y1="300" x2="880" y2="220" stroke="#FB7185" strokeWidth="2.5" filter="drop-shadow(0 0 8px #FB7185)" />
          <line x1="500" y1="420" x2="200" y2="520" stroke="#E11D48" strokeWidth="2" />
          <line x1="430" y1="300" x2="820" y2="480" stroke="#FDA4AF" strokeWidth="2" />

          {/* V-Table Interface Nodes */}
          <rect x="100" y="80" width="160" height="45" rx="8" fill="#2D0612" stroke="#FF4D6D" strokeWidth="1.5" />
          <text x="110" y="108" fill="#FF4D6D" fontSize="11" fontFamily="monospace">virtual void attack() = 0;</text>

          <rect x="740" y="200" width="180" height="45" rx="8" fill="#2D0612" stroke="#FB7185" strokeWidth="1.5" />
          <text x="750" y="228" fill="#FB7185" fontSize="11" fontFamily="monospace">void attack() override &#123;&#125;</text>
        </svg>
      )}

      {universeId === 'world_6' && (
        /* MEMORY DIMENSION: Raw Hexadecimal Addresses, Pointers & Heap Matrix */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Hexadecimal Memory Cells */}
          <g opacity="0.75">
            <rect x="140" y="180" width="100" height="50" rx="6" fill="#190C38" stroke="#8B5CF6" strokeWidth="1.5" />
            <text x="150" y="210" fill="#A78BFA" fontSize="11" fontFamily="monospace">0x7FFE01A4</text>

            <rect x="360" y="180" width="100" height="50" rx="6" fill="#190C38" stroke="#06B6D4" strokeWidth="1.5" />
            <text x="370" y="210" fill="#67E8F9" fontSize="11" fontFamily="monospace">0x7FFE01A8</text>

            <rect x="580" y="180" width="100" height="50" rx="6" fill="#190C38" stroke="#8B5CF6" strokeWidth="1.5" />
            <text x="590" y="210" fill="#A78BFA" fontSize="11" fontFamily="monospace">0x7FFE01AC</text>

            <rect x="800" y="180" width="100" height="50" rx="6" fill="#190C38" stroke="#06B6D4" strokeWidth="1.5" />
            <text x="810" y="210" fill="#67E8F9" fontSize="11" fontFamily="monospace">0x7FFE01B0</text>
          </g>

          {/* Pointer Arrows connecting addresses */}
          <path d="M 240 205 L 360 205" stroke="#06B6D4" strokeWidth="2.5" filter="drop-shadow(0 0 6px #06B6D4)" />
          <path d="M 460 205 L 580 205" stroke="#8B5CF6" strokeWidth="2.5" filter="drop-shadow(0 0 6px #8B5CF6)" />
          <path d="M 680 205 L 800 205" stroke="#06B6D4" strokeWidth="2.5" filter="drop-shadow(0 0 6px #06B6D4)" />

          {/* Smart Pointer RAII Shield Glyph */}
          <circle cx="500" cy="380" r="90" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin-slow" />
          <circle cx="500" cy="380" r="60" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
          <text x="435" y="385" fill="#8B5CF6" fontSize="12" fontFamily="monospace" fontWeight="bold">std::unique_ptr</text>
        </svg>
      )}

      {universeId === 'world_7' && (
        /* STL GALAXY: Planetary Containers, Orbiting Starships & Iterator Highways */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Ringed Vector Planet */}
          <circle cx="280" cy="240" r="70" fill="#071938" stroke="#3B82F6" strokeWidth="2" filter="drop-shadow(0 0 15px #3B82F6)" />
          <ellipse cx="280" cy="240" rx="130" ry="30" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="8 4" className="animate-spin-slow" />
          <text x="235" y="245" fill="#60A5FA" fontSize="12" fontFamily="monospace" fontWeight="bold">std::vector</text>

          {/* Map Planet */}
          <circle cx="720" cy="280" r="80" fill="#071938" stroke="#F97316" strokeWidth="2" filter="drop-shadow(0 0 15px #F97316)" />
          <ellipse cx="720" cy="280" rx="140" ry="35" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="8 4" className="animate-spin-slow-reverse" />
          <text x="660" y="285" fill="#FB923C" fontSize="12" fontFamily="monospace" fontWeight="bold">std::map&lt;K,V&gt;</text>

          {/* Iterator Highway connecting planets */}
          <path d="M 350 240 Q 500 120 640 280" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeDasharray="6 3" filter="drop-shadow(0 0 8px #60A5FA)" />
          <text x="460" y="160" fill="#00FFB2" fontSize="11" fontFamily="monospace">auto it = begin();</text>
        </svg>
      )}

      {universeId === 'world_8' && (
        /* CORE COMPILER: Molten Source Volcano & Spinning -O3 Optimizer Rings */
        <svg
          className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="plasma-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Molten Core Reactor */}
          <circle cx="500" cy="300" r="140" fill="url(#plasma-core)" filter="drop-shadow(0 0 30px #EF4444)" className="animate-pulse-slow" />
          
          {/* -O3 Optimization Rings */}
          <ellipse cx="500" cy="300" rx="260" ry="80" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="12 6" filter="drop-shadow(0 0 12px #EF4444)" className="animate-spin-slow" />
          <ellipse cx="500" cy="300" rx="340" ry="110" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 4" className="animate-spin-slow-reverse" />
          <ellipse cx="500" cy="300" rx="420" ry="140" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.5" />

          {/* Microcode Lightning Conduits */}
          <path d="M 500 160 L 500 0" stroke="#FBBF24" strokeWidth="3" filter="drop-shadow(0 0 10px #FBBF24)" className="animate-lightning-flicker" />
          <path d="M 500 440 L 500 600" stroke="#FBBF24" strokeWidth="3" filter="drop-shadow(0 0 10px #FBBF24)" className="animate-lightning-flicker" />
          <path d="M 360 300 L 0 300" stroke="#EF4444" strokeWidth="2" />
          <path d="M 640 300 L 1000 300" stroke="#EF4444" strokeWidth="2" />

          <text x="440" y="290" fill="#FFF" fontSize="18" fontFamily="Orbitron" fontWeight="bold" filter="drop-shadow(0 0 8px #FFF)">g++ -O3</text>
          <text x="415" y="325" fill="#FBBF24" fontSize="12" fontFamily="monospace">Zero-Cost Abstraction</text>
        </svg>
      )}

      {/* Floating Star / Particle Dots specific to this universe */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 left-12 w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: theme.primaryColor, animationDuration: '3s' }}
        />
        <div
          className="absolute top-1/4 right-20 w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: theme.accentColor, animationDuration: '2.5s' }}
        />
        <div
          className="absolute bottom-16 left-1/3 w-2.5 h-2.5 rounded-full animate-ping"
          style={{ backgroundColor: theme.primaryColor, animationDuration: '4s' }}
        />
        <div
          className="absolute bottom-24 right-1/4 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: theme.accentColor, animationDuration: '3.5s' }}
        />
      </div>
    </div>
  );
};
