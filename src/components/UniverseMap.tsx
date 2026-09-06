import React, { useState } from 'react';
import {
  Globe,
  Lock,
  CheckCircle2,
  Play,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  Cpu,
  Box,
  Layers,
  Terminal,
  Database,
  X,
  Users,
  Award,
  Radio,
  Swords,
  Compass,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Universe, PlayerProgress, Level } from '../types';
import { sound } from '../utils/audio';
import { getUniverseTheme, UniverseVisualTheme } from '../data/universeThemes';
import { UniverseBackdrop } from './UniverseBackdrop';
import {
  isWorldDisrupted,
  getRemainingDisruptionSeconds,
  restoreWorld,
  subscribeToDisruptions,
} from '../utils/disruptionManager';
import { ambianceManager } from '../utils/ambianceManager';

interface UniverseMapProps {
  universes: Universe[];
  progress: PlayerProgress;
  onSelectLevel: (levelId: string, universeId: string) => void;
}

// Bespoke Sector Ambient Artwork Component for the 8 Worlds
const SectorCardVisual: React.FC<{
  universeId: string;
  theme: UniverseVisualTheme;
  isUnlocked: boolean;
}> = ({ universeId, theme, isUnlocked }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
      {/* Sector Radial Core Glow */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-2xl opacity-40 pointer-events-none transition-all duration-500 group-hover:opacity-75 group-hover:scale-125"
        style={{ backgroundColor: theme.primaryColor }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl opacity-30 pointer-events-none transition-all duration-500 group-hover:opacity-60"
        style={{ backgroundColor: theme.accentColor }}
      />

      {/* Unique SVG Visual Artwork per World */}
      {universeId === 'world_1' && (
        /* EARTH PRIME: Matrix Bitstream, Wireframe Coordinates & Radar Conduits */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Wireframe Grid Matrix */}
          <line x1="0" y1="80" x2="300" y2="80" stroke="#00E5FF" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.35" />
          <line x1="0" y1="200" x2="300" y2="200" stroke="#00E5FF" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.3" />
          <line x1="0" y1="320" x2="300" y2="320" stroke="#00E5FF" strokeWidth="0.75" opacity="0.25" />
          <line x1="75" y1="0" x2="75" y2="400" stroke="#00E5FF" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.2" />
          <line x1="225" y1="0" x2="225" y2="400" stroke="#00E5FF" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.2" />

          {/* Radar Ring Pulses */}
          <circle cx="150" cy="150" r="45" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" className="animate-spin-slow" />
          <circle cx="150" cy="150" r="70" fill="none" stroke="#00B4D8" strokeWidth="0.75" opacity="0.3" className="animate-pulse-slow" />

          {/* Floating Data Bits */}
          <text x="18" y="45" fill="#00E5FF" fontSize="9" fontFamily="monospace" opacity="0.75">01000011 0101</text>
          <text x="185" y="365" fill="#00FFB2" fontSize="9" fontFamily="monospace" opacity="0.7">int flux=100;</text>

          {/* Laser Scanning Line */}
          {isUnlocked && (
            <line x1="0" y1="0" x2="300" y2="0" stroke="#00E5FF" strokeWidth="2" filter="drop-shadow(0 0 6px #00E5FF)" className="animate-laser-sweep" />
          )}
        </svg>
      )}

      {universeId === 'world_2' && (
        /* FUNCTION NEXUS: Cyberpunk Megacity Towers, Neon Skybridges & Call-Stack Frames */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="tower-grad-w2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Cyber Megacity Silhouettes */}
          <polygon points="15,400 15,180 55,150 55,400" fill="url(#tower-grad-w2)" opacity="0.4" />
          <polygon points="70,400 70,110 120,80 120,400" fill="url(#tower-grad-w2)" opacity="0.5" />
          <polygon points="180,400 180,90 235,60 235,400" fill="url(#tower-grad-w2)" opacity="0.6" />
          <polygon points="250,400 250,190 290,160 290,400" fill="url(#tower-grad-w2)" opacity="0.4" />

          {/* Skybridge Lasers */}
          <line x1="55" y1="170" x2="180" y2="170" stroke="#E879F9" strokeWidth="1.5" filter="drop-shadow(0 0 6px #E879F9)" />
          <line x1="120" y1="120" x2="235" y2="120" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Subroutine Call Badges */}
          <text x="20" y="50" fill="#E879F9" fontSize="9" fontFamily="monospace" opacity="0.8">call_stack.push()</text>
          <text x="160" y="375" fill="#C084FC" fontSize="9" fontFamily="monospace" opacity="0.75">return f(n - 1);</text>

          {/* Moving Horizontal Beam */}
          {isUnlocked && (
            <line x1="0" y1="140" x2="0" y2="240" stroke="#C084FC" strokeWidth="2" filter="drop-shadow(0 0 8px #E879F9)" className="animate-beam-scan-x" />
          )}
        </svg>
      )}

      {universeId === 'world_3' && (
        /* OBJECT REALM: Amber Polyhedral Citadels, Constructor Rings & Encapsulation Shields */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Sacred Polyhedral Citadel Facets */}
          <polygon points="150,60 210,120 190,210 110,210 90,120" fill="#291A04" stroke="#FFD166" strokeWidth="1.5" opacity="0.65" filter="drop-shadow(0 0 10px #FFD166)" />
          <line x1="150" y1="60" x2="150" y2="210" stroke="#F59E0B" strokeWidth="1" opacity="0.6" />
          <line x1="150" y1="60" x2="110" y2="210" stroke="#FDE68A" strokeWidth="0.75" opacity="0.4" />
          <line x1="150" y1="60" x2="190" y2="210" stroke="#FDE68A" strokeWidth="0.75" opacity="0.4" />

          {/* Rotating Constructor Rings */}
          <ellipse cx="150" cy="150" rx="90" ry="30" fill="none" stroke="#FFD166" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.7" className="animate-spin-slow" />
          <ellipse cx="150" cy="150" rx="120" ry="40" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" className="animate-spin-slow-reverse" />

          {/* Encapsulation Badges */}
          <text x="16" y="45" fill="#FFD166" fontSize="9" fontFamily="monospace" opacity="0.85">class Entity &#123;</text>
          <text x="24" y="60" fill="#F59E0B" fontSize="8" fontFamily="monospace" opacity="0.75">private: int hp;</text>
          <text x="175" y="370" fill="#FDE68A" fontSize="9" fontFamily="monospace" opacity="0.8">public: void init()</text>
        </svg>
      )}

      {universeId === 'world_4' && (
        /* INHERITANCE KINGDOM: Bioluminescent World-Tree, Ancestral Helixes & Spores */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Bioluminescent Fractal Branches */}
          <path d="M 150 400 Q 150 250 80 150 Q 50 80 20 50" fill="none" stroke="#00FFB2" strokeWidth="2.5" filter="drop-shadow(0 0 8px #00FFB2)" className="animate-sap-pulse" />
          <path d="M 150 400 Q 150 250 220 150 Q 250 80 280 50" fill="none" stroke="#00FFB2" strokeWidth="2.5" filter="drop-shadow(0 0 8px #00FFB2)" className="animate-sap-pulse" />
          <path d="M 150 270 Q 130 180 150 90" fill="none" stroke="#34D399" strokeWidth="2" opacity="0.8" />

          {/* Lineage Branch Nodes */}
          <circle cx="20" cy="50" r="9" fill="#00FFB2" opacity="0.8" filter="drop-shadow(0 0 10px #00FFB2)" />
          <circle cx="280" cy="50" r="9" fill="#00FFB2" opacity="0.8" filter="drop-shadow(0 0 10px #00FFB2)" />
          <circle cx="150" cy="90" r="11" fill="#6EE7B7" opacity="0.9" filter="drop-shadow(0 0 12px #6EE7B7)" />

          <text x="95" y="42" fill="#00FFB2" fontSize="9" fontFamily="monospace" fontWeight="bold">BaseClass: Core</text>
          <text x="14" y="375" fill="#34D399" fontSize="9" fontFamily="monospace">Derived: Champion</text>
        </svg>
      )}

      {universeId === 'world_5' && (
        /* POLYMORPHISM CITY: Shifting Prismatic Facets, Dynamic Refraction & V-Tables */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Central Prismatic Crystal */}
          <polygon points="150,110 195,170 150,250 105,170" fill="#FF4D6D" opacity="0.6" stroke="#FB7185" strokeWidth="2" filter="drop-shadow(0 0 16px #FF4D6D)" />
          
          {/* Refracting Multi-Beam Lasers */}
          <line x1="150" y1="110" x2="30" y2="40" stroke="#FF4D6D" strokeWidth="2" filter="drop-shadow(0 0 6px #FF4D6D)" />
          <line x1="195" y1="170" x2="280" y2="120" stroke="#FB7185" strokeWidth="2" filter="drop-shadow(0 0 6px #FB7185)" />
          <line x1="150" y1="250" x2="40" y2="350" stroke="#E11D48" strokeWidth="1.5" />
          <line x1="105" y1="170" x2="260" y2="330" stroke="#FDA4AF" strokeWidth="1.5" />

          {/* V-Table Interface Badges */}
          <text x="16" y="40" fill="#FF4D6D" fontSize="9" fontFamily="monospace">virtual void act()=0;</text>
          <text x="140" y="370" fill="#FB7185" fontSize="9" fontFamily="monospace">void act() override;</text>
        </svg>
      )}

      {universeId === 'world_6' && (
        /* MEMORY DIMENSION: Hexadecimal Memory Matrix, Pointers & RAII Bubble */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Hex Memory Address Grid */}
          <g opacity="0.8">
            <rect x="25" y="90" width="70" height="32" rx="5" fill="#190C38" stroke="#8B5CF6" strokeWidth="1" />
            <text x="32" y="110" fill="#A78BFA" fontSize="8" fontFamily="monospace">0x7FFE01</text>

            <rect x="115" y="90" width="70" height="32" rx="5" fill="#190C38" stroke="#06B6D4" strokeWidth="1" />
            <text x="122" y="110" fill="#67E8F9" fontSize="8" fontFamily="monospace">0x7FFE08</text>

            <rect x="205" y="90" width="70" height="32" rx="5" fill="#190C38" stroke="#8B5CF6" strokeWidth="1" />
            <text x="212" y="110" fill="#A78BFA" fontSize="8" fontFamily="monospace">0x7FFE10</text>
          </g>

          {/* Pointer Connectors */}
          <path d="M 95 106 L 115 106" stroke="#06B6D4" strokeWidth="2" filter="drop-shadow(0 0 4px #06B6D4)" />
          <path d="M 185 106 L 205 106" stroke="#8B5CF6" strokeWidth="2" filter="drop-shadow(0 0 4px #8B5CF6)" />

          {/* Smart Pointer RAII Bubble */}
          <circle cx="150" cy="220" r="50" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="5 3" className="animate-spin-slow" />
          <circle cx="150" cy="220" r="35" fill="none" stroke="#06B6D4" strokeWidth="1" />
          <text x="105" y="224" fill="#67E8F9" fontSize="9" fontFamily="monospace" fontWeight="bold">unique_ptr</text>

          <text x="16" y="45" fill="#8B5CF6" fontSize="9" fontFamily="monospace">int* ptr = &amp;addr;</text>
          <text x="160" y="370" fill="#06B6D4" fontSize="9" fontFamily="monospace">delete[] buffer;</text>
        </svg>
      )}

      {universeId === 'world_7' && (
        /* STL GALAXY: Planetary Container Spheres, Iterator Ring Highways & Armada */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Ringed Vector Planet */}
          <circle cx="90" cy="140" r="35" fill="#071938" stroke="#3B82F6" strokeWidth="1.5" filter="drop-shadow(0 0 10px #3B82F6)" />
          <ellipse cx="90" cy="140" rx="65" ry="16" fill="none" stroke="#F97316" strokeWidth="1.5" strokeDasharray="5 3" className="animate-spin-slow" />
          <text x="65" y="143" fill="#60A5FA" fontSize="8" fontFamily="monospace" fontWeight="bold">vector</text>

          {/* Map Planet */}
          <circle cx="220" cy="180" r="30" fill="#071938" stroke="#F97316" strokeWidth="1.5" filter="drop-shadow(0 0 10px #F97316)" />
          <ellipse cx="220" cy="180" rx="55" ry="14" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="5 3" className="animate-spin-slow-reverse" />
          <text x="200" y="183" fill="#FB923C" fontSize="8" fontFamily="monospace" fontWeight="bold">map&lt;K,V&gt;</text>

          {/* Iterator Orbit Track */}
          <path d="M 120 140 Q 160 80 200 170" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 2" filter="drop-shadow(0 0 6px #60A5FA)" />

          <text x="16" y="45" fill="#60A5FA" fontSize="9" fontFamily="monospace">std::sort(begin, end);</text>
          <text x="155" y="370" fill="#FB923C" fontSize="9" fontFamily="monospace">O(log N) speed</text>
        </svg>
      )}

      {universeId === 'world_8' && (
        /* CORE COMPILER: Molten Magma Reactor, Spinning -O3 Rings & Microcode Lightning */
        <svg
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="plasma-w8" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Molten Reactor Core */}
          <circle cx="150" cy="160" r="55" fill="url(#plasma-w8)" filter="drop-shadow(0 0 20px #EF4444)" className="animate-pulse-slow" />
          
          {/* Dual -O3 Optimizer Rings */}
          <ellipse cx="150" cy="160" rx="90" ry="30" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="8 4" filter="drop-shadow(0 0 8px #EF4444)" className="animate-spin-slow" />
          <ellipse cx="150" cy="160" rx="120" ry="40" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 3" className="animate-spin-slow-reverse" />

          {/* Lightning Conduits */}
          <path d="M 150 90 L 150 15" stroke="#FBBF24" strokeWidth="2" filter="drop-shadow(0 0 6px #FBBF24)" className="animate-lightning-flicker" />
          <path d="M 150 230 L 150 340" stroke="#FBBF24" strokeWidth="2" filter="drop-shadow(0 0 6px #FBBF24)" className="animate-lightning-flicker" />

          <text x="110" y="163" fill="#FFF" fontSize="13" fontFamily="Orbitron" fontWeight="bold" filter="drop-shadow(0 0 6px #FFF)">g++ -O3</text>
          <text x="16" y="45" fill="#F87171" fontSize="9" fontFamily="monospace">asm volatile(&quot;nop&quot;);</text>
          <text x="145" y="370" fill="#FBBF24" fontSize="9" fontFamily="monospace">Zero Overhead</text>
        </svg>
      )}

      {/* Floating Animated Sector Sparks */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-6 left-8 w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: theme.primaryColor, animationDuration: '3s' }}
        />
        <div
          className="absolute top-1/3 right-6 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: theme.accentColor, animationDuration: '2.4s' }}
        />
        <div
          className="absolute bottom-12 left-1/4 w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: theme.primaryColor, animationDuration: '4s' }}
        />
      </div>
    </div>
  );
};

export const UniverseMap: React.FC<UniverseMapProps> = ({
  universes,
  progress,
  onSelectLevel,
}) => {
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [modalTab, setModalTab] = useState<'missions' | 'team'>('missions');
  const [cheeredMember, setCheeredMember] = useState<string | null>(null);
  const [, setTick] = useState<number>(0);

  // Live timer tick for world disruption countdowns
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    const unsubscribe = subscribeToDisruptions(() => {
      setTick((t) => t + 1);
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const getUniverseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return Globe;
      case 'Cpu': return Cpu;
      case 'Box': return Box;
      case 'Shield': return Shield;
      case 'Sparkles': return Sparkles;
      case 'Layers': return Layers;
      case 'Database': return Database;
      case 'Terminal': return Terminal;
      default: return Globe;
    }
  };

  const handleCheerMember = (memberName: string) => {
    sound.playLevelUp();
    setCheeredMember(memberName);
    setTimeout(() => setCheeredMember(null), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> 8 PARALLEL CODE WORLDS & GUARDIAN SQUADS
        </div>
        <h1 className="font-['Orbitron'] text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
          THE 8 PARALLEL UNIVERSES
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 font-mono">
          Each dimension possesses a unique visual landscape, C++ paradigm, and specialized Guardian Vanguard squad.
        </p>
      </div>

      {/* Map Nodes & Pathways Grid */}
      <div className="relative max-w-6xl mx-auto py-4">
        {/* Ambient Constellation Grid SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ stroke: 'rgba(0, 229, 255, 0.25)', strokeWidth: 1.5, strokeDasharray: '4 4' }}>
          <line x1="12%" y1="20%" x2="38%" y2="20%" />
          <line x1="38%" y1="20%" x2="62%" y2="20%" />
          <line x1="62%" y1="20%" x2="88%" y2="20%" />
          <line x1="88%" y1="20%" x2="88%" y2="70%" />
          <line x1="88%" y1="70%" x2="62%" y2="70%" />
          <line x1="62%" y1="70%" x2="38%" y2="70%" />
          <line x1="38%" y1="70%" x2="12%" y2="70%" />
          <line x1="12%" y1="70%" x2="12%" y2="20%" />
          <line x1="38%" y1="20%" x2="62%" y2="70%" strokeOpacity="0.15" />
          <line x1="62%" y1="20%" x2="38%" y2="70%" strokeOpacity="0.15" />
        </svg>

        {/* Universes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {universes.map((uni) => {
            const isUnlocked = progress.unlockedUniverses.includes(uni.id);
            const isCompleted = progress.completedUniverses.includes(uni.id);
            const completedCount = uni.levels.filter((l) =>
              progress.completedLevels.includes(l.id)
            ).length;
            const Icon = getUniverseIcon(uni.icon);
            const theme = getUniverseTheme(uni.id);

            // Dynamic Sector Background Gradients per World
            const sectorGradients: Record<string, string> = {
              world_1: 'linear-gradient(155deg, rgba(3,21,37,0.95) 0%, rgba(7,31,54,0.9) 50%, rgba(5,12,26,0.98) 100%)',
              world_2: 'linear-gradient(155deg, rgba(25,9,51,0.95) 0%, rgba(42,17,82,0.9) 50%, rgba(10,4,20,0.98) 100%)',
              world_3: 'linear-gradient(155deg, rgba(41,26,4,0.95) 0%, rgba(59,38,8,0.9) 50%, rgba(14,9,2,0.98) 100%)',
              world_4: 'linear-gradient(155deg, rgba(3,36,26,0.95) 0%, rgba(5,54,40,0.9) 50%, rgba(2,20,15,0.98) 100%)',
              world_5: 'linear-gradient(155deg, rgba(45,6,18,0.95) 0%, rgba(66,11,28,0.9) 50%, rgba(18,2,7,0.98) 100%)',
              world_6: 'linear-gradient(155deg, rgba(25,12,56,0.95) 0%, rgba(36,16,82,0.9) 50%, rgba(10,3,23,0.98) 100%)',
              world_7: 'linear-gradient(155deg, rgba(7,25,56,0.95) 0%, rgba(14,40,86,0.9) 50%, rgba(4,12,28,0.98) 100%)',
              world_8: 'linear-gradient(155deg, rgba(51,10,10,0.95) 0%, rgba(77,15,15,0.9) 50%, rgba(23,3,3,0.98) 100%)',
            };

            const cardBg = sectorGradients[uni.id] || sectorGradients.world_1;
            const remainingDisruption = getRemainingDisruptionSeconds(uni.id);
            const isDisrupted = remainingDisruption > 0;

            return (
              <div
                key={uni.id}
                id={`map-node-${uni.id}`}
                onClick={() => {
                  if (isUnlocked) {
                    // Play unique audio signature and shift global space-time sector ambiance
                    sound.playUniverseSignature(uni.id);
                    ambianceManager.shiftSector(uni.id, true);
                    setSelectedUniverse(uni);
                    setModalTab('missions');
                  } else {
                    sound.playError();
                  }
                }}
                style={{
                  background: cardBg,
                  borderColor: isDisrupted
                    ? '#FF4D6D'
                    : isCompleted
                    ? '#00FFB2'
                    : isUnlocked
                    ? theme.primaryColor
                    : 'rgba(31, 41, 55, 0.6)',
                  boxShadow: isDisrupted
                    ? '0 0 32px rgba(255, 77, 109, 0.45), inset 0 0 20px rgba(255, 77, 109, 0.2)'
                    : isCompleted
                    ? `0 0 32px rgba(0, 255, 178, 0.35), inset 0 0 20px ${theme.primaryColor}20`
                    : isUnlocked
                    ? `0 0 24px ${theme.primaryColor}35, inset 0 0 15px ${theme.primaryColor}15`
                    : 'none',
                }}
                className={`group relative overflow-hidden rounded-3xl p-5 sm:p-6 border transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[360px] ${
                  isUnlocked
                    ? 'hover:scale-[1.03] hover:shadow-[0_0_38px_rgba(255,255,255,0.25)]'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Bespoke Sector Ambient Card Visuals & Animations */}
                <SectorCardVisual
                  universeId={uni.id}
                  theme={theme}
                  isUnlocked={isUnlocked}
                />

                {/* Top Badge & Node Status */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold tracking-wider"
                      style={{
                        backgroundColor: `${theme.primaryColor}25`,
                        color: theme.primaryColor,
                        border: `1px solid ${theme.primaryColor}70`,
                        boxShadow: `0 0 10px ${theme.primaryColor}30`,
                      }}
                    >
                      WORLD 0{uni.order}
                    </span>

                    {isDisrupted ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/20 px-2 py-0.5 rounded-full border border-[#FF4D6D]/50 shadow-[0_0_12px_rgba(255,77,109,0.4)] animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" /> DISRUPTED ({Math.floor(remainingDisruption / 60)}:{String(remainingDisruption % 60).padStart(2, '0')})
                      </span>
                    ) : isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#00FFB2] bg-[#00FFB2]/20 px-2 py-0.5 rounded-full border border-[#00FFB2]/50 shadow-[0_0_12px_rgba(0,255,178,0.4)]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RESTORED
                      </span>
                    ) : isUnlocked ? (
                      <span
                        className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm"
                        style={{
                          color: theme.primaryColor,
                          backgroundColor: `${theme.primaryColor}18`,
                          borderColor: `${theme.primaryColor}50`,
                          boxShadow: `0 0 8px ${theme.primaryColor}25`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-ping"
                          style={{ backgroundColor: theme.primaryColor }}
                        />{' '}
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded-full border border-gray-700/50">
                        <Lock className="w-3.5 h-3.5" /> LOCKED
                      </span>
                    )}
                  </div>

                  {/* Planet Visual Orbit Icon with Atmospheric Theme */}
                  <div className="flex justify-center my-3">
                    <div
                      className={`planet w-20 h-20 flex items-center justify-center p-1 transition-transform duration-500 group-hover:scale-110 shadow-lg`}
                      style={{
                        background: isCompleted
                          ? 'linear-gradient(135deg, #00FFB2, #00E5FF)'
                          : isUnlocked
                          ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
                          : '#1F2937',
                        boxShadow: isUnlocked
                          ? `0 0 25px ${theme.primaryColor}50, inset 0 0 15px ${theme.primaryColor}30`
                          : 'none',
                        border: isUnlocked
                          ? `2px solid ${theme.primaryColor}`
                          : '2px dashed #4B5563',
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-[#070B14] flex items-center justify-center">
                        <Icon
                          className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: isUnlocked ? theme.primaryColor : '#6B7280' }}
                        />
                      </div>
                    </div>
                  </div>

                  <h3
                    className="font-['Orbitron'] text-lg font-bold text-white text-center mb-1 transition-colors group-hover:brightness-125"
                    style={{
                      textShadow: isUnlocked ? `0 0 12px ${theme.primaryColor}40` : 'none',
                    }}
                  >
                    {uni.name}
                  </h3>
                  <p className="text-[11px] text-gray-300 font-mono text-center line-clamp-1 mb-2">
                    {uni.topic}
                  </p>

                  {/* Custom Team Vanguard Insignia Pill */}
                  <div
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border text-[10px] font-mono text-gray-200 backdrop-blur-sm"
                    style={{ borderColor: `${theme.primaryColor}30` }}
                  >
                    <span>{theme.team.insignia}</span>
                    <span className="truncate font-semibold" style={{ color: theme.primaryColor }}>
                      {theme.team.name}
                    </span>
                  </div>
                </div>

                {/* Progress bar and sector counter */}
                <div className="relative z-10 pt-3 border-t border-white/10 mt-3">
                  <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-1.5">
                    <span>Purge Progress</span>
                    <span className="text-white font-bold">{completedCount} / {uni.levels.length} Cleared</span>
                  </div>
                  <div className="w-full h-2 bg-[#0B1120] rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        backgroundColor: theme.primaryColor,
                        boxShadow: `0 0 8px ${theme.primaryColor}80`,
                        width: `${(completedCount / uni.levels.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Universe Details & Squad Vanguard Modal */}
      {selectedUniverse && (() => {
        const theme = getUniverseTheme(selectedUniverse.id);
        const Icon = getUniverseIcon(selectedUniverse.icon);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
            <div
              className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              style={{
                borderColor: `${theme.primaryColor}60`,
                boxShadow: `0 0 60px ${theme.primaryColor}30`,
              }}
            >
              {/* Universe Visual Backdrop in Modal */}
              <UniverseBackdrop
                universeId={selectedUniverse.id}
                className="absolute inset-0 w-full h-full opacity-35"
              />

              {/* Close Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedUniverse(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1F2937] transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header with Landmark & Team Insignia */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center p-1 shadow-[0_0_24px_rgba(0,229,255,0.4)] flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                      boxShadow: `0 0 24px ${theme.primaryColor}50`,
                    }}
                  >
                    <div className="w-full h-full bg-[#070B14] rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8" style={{ color: theme.primaryColor }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
                        style={{
                          backgroundColor: `${theme.primaryColor}20`,
                          color: theme.primaryColor,
                          border: `1px solid ${theme.primaryColor}40`,
                        }}
                      >
                        WORLD 0{selectedUniverse.order}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {selectedUniverse.subtitle}
                      </span>
                    </div>
                    <h2 className="font-['Orbitron'] text-2xl font-bold text-white mt-1">
                      {selectedUniverse.name}
                    </h2>
                    <p className="text-xs text-gray-300 font-mono mt-0.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                      Landmark: <span className="text-white font-semibold">{theme.landmark}</span>
                    </p>
                  </div>
                </div>

                {/* Team Vanguard Crest Badge */}
                <div
                  className="p-3 rounded-2xl bg-black/60 border backdrop-blur-md flex items-center gap-3"
                  style={{ borderColor: `${theme.primaryColor}40` }}
                >
                  <span className="text-2xl">{theme.team.insignia}</span>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Allied Vanguard</span>
                    <span className="text-xs font-bold font-['Orbitron']" style={{ color: theme.primaryColor }}>
                      {theme.team.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Disruption Alert Banner if Sector is Destabilized */}
              {selectedUniverse && getRemainingDisruptionSeconds(selectedUniverse.id) > 0 && (
                <div className="relative z-10 mb-6 p-4 rounded-2xl bg-[#FF4D6D]/15 border border-[#FF4D6D]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-[0_0_20px_rgba(255,77,109,0.25)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 animate-pulse">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono font-bold text-[#FF4D6D]">
                        DIMENSIONAL MATRIX DISRUPTED
                      </div>
                      <p className="text-xs text-gray-300">
                        This sector entered containment cooldown after a mission timer expired. Stabilization remaining:{' '}
                        <span className="text-[#FF4D6D] font-bold font-mono">
                          {Math.floor(getRemainingDisruptionSeconds(selectedUniverse.id) / 60)}:
                          {String(getRemainingDisruptionSeconds(selectedUniverse.id) % 60).padStart(2, '0')}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playShield();
                      restoreWorld(selectedUniverse.id);
                      sound.playRestored();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#00FFB2] hover:bg-[#00FFB2]/90 text-black font-['Orbitron'] text-xs font-bold shadow-[0_0_15px_rgba(0,255,178,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5" /> Quick Stabilize
                  </button>
                </div>
              )}

              {/* Modal Tabs */}
              <div className="relative z-10 flex gap-2 mb-6 bg-[#0B1120]/90 p-1.5 rounded-2xl border border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setModalTab('missions');
                  }}
                  style={{
                    background: modalTab === 'missions'
                      ? `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`
                      : 'transparent',
                    boxShadow: modalTab === 'missions' ? `0 0 15px ${theme.primaryColor}50` : 'none',
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-['Orbitron'] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    modalTab === 'missions'
                      ? 'text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Swords className="w-4 h-4" /> SECTOR MISSIONS & BOSS ({selectedUniverse.levels.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setModalTab('team');
                  }}
                  style={{
                    background: modalTab === 'team'
                      ? `linear-gradient(to right, ${theme.accentColor}, ${theme.primaryColor})`
                      : 'transparent',
                    boxShadow: modalTab === 'team' ? `0 0 15px ${theme.accentColor}50` : 'none',
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-['Orbitron'] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    modalTab === 'team'
                      ? 'text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" /> ALLIED VANGUARD TEAM ({theme.team.members.length})
                </button>
              </div>

              {/* TAB 1: Sector Missions */}
              {modalTab === 'missions' && (
                <div className="relative z-10 space-y-4 animate-fade-in">
                  <p className="text-xs sm:text-sm text-gray-200 bg-[#0B1120]/80 border border-[#1F2937] p-4 rounded-2xl leading-relaxed">
                    {selectedUniverse.description}
                  </p>

                  <div className="space-y-3">
                    {selectedUniverse.levels.map((lvl) => {
                      const isLevelCompleted = progress.completedLevels.includes(lvl.id);
                      const isBoss = lvl.type === 'boss';

                      return (
                        <div
                          key={lvl.id}
                          id={`level-row-${lvl.id}`}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md ${
                            isLevelCompleted
                              ? 'bg-[#0B1120]/90 border-[#00FFB2]/30 shadow-[0_0_12px_rgba(0,255,178,0.1)]'
                              : isBoss
                              ? 'bg-gradient-to-r from-[#1E1B4B]/90 to-[#111827] border-[#7C3AED]/60 shadow-[0_0_16px_rgba(124,58,237,0.2)]'
                              : 'bg-[#0B1120]/80 border-[#1F2937]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                              {lvl.enemy?.avatar || '👾'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white font-['Orbitron']">
                                  {lvl.title}
                                </span>
                                {isBoss && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#FF4D6D]/20 text-[#FF4D6D] text-[10px] font-mono font-bold border border-[#FF4D6D]/30 animate-pulse">
                                    CORRUPTION BOSS
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                                {lvl.story}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
                                <span style={{ color: theme.primaryColor }}>+{lvl.rewards.xp} XP</span>
                                <span className="text-[#FFD166]">+{lvl.rewards.coins} Coins</span>
                                {lvl.rewards.item && (
                                  <span className="text-[#00FFB2]">🎁 {lvl.rewards.item}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            id={`launch-level-btn-${lvl.id}`}
                            onClick={() => {
                              sound.playClick();
                              setSelectedUniverse(null);
                              onSelectLevel(lvl.id, selectedUniverse.id);
                            }}
                            style={{
                              backgroundColor: isLevelCompleted ? undefined : theme.primaryColor,
                              boxShadow: isLevelCompleted ? undefined : `0 0 16px ${theme.primaryColor}60`,
                            }}
                            className={`px-4 py-2 rounded-xl font-['Orbitron'] text-xs font-bold flex items-center gap-2 transition-all duration-300 flex-shrink-0 ${
                              isLevelCompleted
                                ? 'bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/40 hover:bg-[#00FFB2]/30'
                                : 'text-black hover:brightness-110'
                            }`}
                          >
                            {isLevelCompleted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> REPLAY SECTOR
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-black" /> LAUNCH MISSION
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Allied Vanguard Team */}
              {modalTab === 'team' && (
                <div className="relative z-10 space-y-6 animate-fade-in">
                  {/* Team Banner */}
                  <div
                    className="p-5 rounded-2xl bg-gradient-to-r from-black/80 to-[#111827] border backdrop-blur-md"
                    style={{ borderColor: `${theme.primaryColor}30` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{theme.team.insignia}</span>
                          <span className="font-['Orbitron'] text-lg font-bold text-white">
                            {theme.team.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          Division: <span className="text-white font-semibold">{theme.team.division}</span>
                        </p>
                        <p className="text-xs italic text-[#00FFB2] font-serif mt-1">
                          “{theme.team.motto}”
                        </p>
                      </div>

                      {/* Squad Combat Perk */}
                      <div
                        className="sm:max-w-xs p-3 rounded-xl bg-[#070B14]/80 border"
                        style={{ borderColor: `${theme.primaryColor}40` }}
                      >
                        <span
                          className="text-[10px] font-mono font-bold block uppercase flex items-center gap-1"
                          style={{ color: theme.primaryColor }}
                        >
                          <Zap className="w-3 h-3" /> {theme.team.squadPerk.name}
                        </span>
                        <p className="text-[11px] text-gray-300 mt-1">
                          {theme.team.squadPerk.combatBonus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {theme.team.members.map((member) => (
                      <div
                        key={member.id}
                        className="p-4 rounded-2xl bg-[#0B1120]/90 border border-white/10 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                              {member.avatar}
                            </span>
                            <div>
                              <h4 className="font-['Orbitron'] text-sm font-bold text-white">
                                {member.name}
                              </h4>
                              <span
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                                style={{
                                  color: theme.primaryColor,
                                  backgroundColor: `${theme.primaryColor}15`,
                                  borderColor: `${theme.primaryColor}30`,
                                }}
                              >
                                {member.callsign}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-mono font-bold text-[#FFD166] block mb-1.5">
                            {member.role}
                          </span>

                          <p className="text-xs text-gray-300 leading-relaxed mb-2">
                            {member.bio}
                          </p>

                          <div className="p-2.5 rounded-xl bg-[#070B14] border border-[#1F2937] text-[11px] text-gray-300 space-y-1">
                            <span className="text-[10px] font-mono text-[#00FFB2] font-bold block">
                              SPECIAL ABILITY:
                            </span>
                            <p>{member.specialAbility}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] italic text-gray-400 font-mono mb-2">
                            {member.quote}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleCheerMember(member.name)}
                            style={{
                              borderColor: `${theme.primaryColor}30`,
                            }}
                            className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                          >
                            <Radio className="w-3 h-3" style={{ color: theme.primaryColor }} />
                            {cheeredMember === member.name ? '✨ VANGUARD RALLIED!' : 'Rally Member'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
