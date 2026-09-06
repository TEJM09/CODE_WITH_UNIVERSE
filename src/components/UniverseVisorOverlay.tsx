import React from 'react';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { sound } from '../utils/audio';

interface UniverseVisorOverlayProps {
  universeId?: string;
  universeName?: string;
  isVisorActive: boolean;
  onToggleVisor: () => void;
}

export const UniverseVisorOverlay: React.FC<UniverseVisorOverlayProps> = ({
  universeName = 'Earth Prime',
  isVisorActive,
  onToggleVisor,
}) => {
  return (
    <>
      {/* Subtle Space Vignette when active */}
      {isVisorActive && (
        <div className="fixed inset-0 z-20 pointer-events-none transition-all duration-500 overflow-hidden">
          {/* Subtle soft vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_75%,rgba(7,11,20,0.5)_100%)]" />

          {/* Simple Current World Pill at Top */}
          <div className="absolute top-16 left-0 right-0 h-7 bg-black/30 border-b border-[#00E5FF]/10 backdrop-blur-[2px] flex items-center justify-between px-6 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
              <span className="font-semibold text-white">Exploring: {universeName}</span>
            </div>
            <span className="text-[11px] text-[#00E5FF] font-medium hidden sm:inline">
              C++ Learning Journey
            </span>
          </div>

          {/* Soft Corner Accents */}
          <div className="absolute top-24 left-6 w-5 h-5 border-t border-l border-[#00E5FF]/30 rounded-tl" />
          <div className="absolute top-24 right-6 w-5 h-5 border-t border-r border-[#00E5FF]/30 rounded-tr" />
          <div className="absolute bottom-12 left-6 w-5 h-5 border-b border-l border-[#00E5FF]/30 rounded-bl" />
          <div className="absolute bottom-12 right-6 w-5 h-5 border-b border-r border-[#00E5FF]/30 rounded-br" />
        </div>
      )}

      {/* Floating Space Effects Toggle */}
      <button
        type="button"
        id="toggle-cockpit-visor-btn"
        onClick={() => {
          sound.playClick();
          onToggleVisor();
        }}
        title={isVisorActive ? 'Turn off space effects' : 'Turn on space effects'}
        className={`fixed bottom-10 right-4 z-40 px-3 py-1.5 rounded-full border text-xs font-sans font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
          isVisorActive
            ? 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
            : 'bg-[#111827]/80 border-[#1F2937] text-gray-400 hover:text-white hover:border-gray-500'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Space Effects</span>
        <span className="text-[10px] px-1 py-0.5 rounded bg-black/40">
          {isVisorActive ? 'ON' : 'OFF'}
        </span>
      </button>
    </>
  );
};
