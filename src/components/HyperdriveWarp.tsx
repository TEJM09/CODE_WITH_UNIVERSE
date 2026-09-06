import React, { useEffect, useState } from 'react';
import { Sparkles, Compass, Shield, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface HyperdriveWarpProps {
  isOpen: boolean;
  universeName: string;
  universeOrder: number;
  topic: string;
  onComplete: () => void;
}

export const HyperdriveWarp: React.FC<HyperdriveWarpProps> = ({
  isOpen,
  universeName,
  universeOrder,
  topic,
  onComplete,
}) => {
  const [warpPhase, setWarpPhase] = useState<'charging' | 'jumping' | 'arrival'>('charging');

  useEffect(() => {
    if (!isOpen) return;

    // Play hyperspace warp sound
    sound.playPortal();
    setWarpPhase('charging');

    const jumpTimer = setTimeout(() => {
      setWarpPhase('jumping');
    }, 250);

    const arrivalTimer = setTimeout(() => {
      setWarpPhase('arrival');
    }, 950);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1400);

    return () => {
      clearTimeout(jumpTimer);
      clearTimeout(arrivalTimer);
      clearTimeout(completeTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden bg-black/95">
      {/* Hyperdrive Star Streaks Canvas / SVG */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="warpGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#7C3AED" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Singularity Glow */}
        <circle
          cx="50%"
          cy="50%"
          r={warpPhase === 'jumping' ? '180' : '80'}
          fill="url(#warpGlow)"
          className="transition-all duration-300 animate-pulse"
        />

        {/* Radiating Warp Tunnel Lines */}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          const rad = (angle * Math.PI) / 180;
          const innerR = warpPhase === 'jumping' ? 40 : 20;
          const outerR = warpPhase === 'jumping' ? 1200 : 300;
          const x1 = 50 + Math.cos(rad) * (innerR / 20);
          const y1 = 50 + Math.sin(rad) * (innerR / 20);
          const x2 = 50 + Math.cos(rad) * (outerR / 12);
          const y2 = 50 + Math.sin(rad) * (outerR / 12);

          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={i % 2 === 0 ? '#00E5FF' : '#00FFB2'}
              strokeWidth={warpPhase === 'jumping' ? '2.5' : '1'}
              strokeOpacity={warpPhase === 'jumping' ? '0.85' : '0.4'}
              strokeDasharray={warpPhase === 'jumping' ? '20, 10' : 'none'}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Holographic Cockpit Visor Reticle */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-lg">
        {/* Reticle brackets */}
        <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#00E5FF]/60 flex items-center justify-center animate-spin-slow relative">
          <div className="w-20 h-20 rounded-full border border-[#00FFB2]/50 flex items-center justify-center">
            <Zap className="w-8 h-8 text-[#00E5FF] animate-pulse" />
          </div>
          <div className="absolute -top-3 px-2 bg-black text-[9px] font-mono text-[#00E5FF] font-bold">
            LOCK: 100%
          </div>
        </div>

        {/* Telemetry Banner */}
        <div className="space-y-1.5 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF] text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-ping" />
            {warpPhase === 'charging' && 'Preparing your challenge...'}
            {warpPhase === 'jumping' && 'Traveling to destination...'}
            {warpPhase === 'arrival' && 'Arriving! Get ready to code...'}
          </div>

          <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(0,229,255,0.8)]">
            World {universeOrder}: {universeName}
          </h2>

          <p className="text-sm text-[#00FFB2] font-medium">
            Focus: {topic}
          </p>
        </div>

        <div className="text-xs text-gray-300 flex items-center gap-3 bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
          <span>Level ready</span>
          <span>•</span>
          <span className="text-[#00E5FF]">Get Ready</span>
        </div>
      </div>
    </div>
  );
};
