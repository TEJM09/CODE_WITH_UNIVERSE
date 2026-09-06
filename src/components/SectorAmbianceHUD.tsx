import React, { useState, useEffect } from 'react';
import {
  Radio,
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
  X,
  Zap,
  Globe,
  Headphones,
} from 'lucide-react';
import { ambianceManager } from '../utils/ambianceManager';
import { sound } from '../utils/audio';
import { SectorAmbianceProfile } from '../utils/ambianceProfiles';

interface SectorAmbianceHUDProps {
  onSelectUniverse?: (universeId: string) => void;
}

export const SectorAmbianceHUD: React.FC<SectorAmbianceHUDProps> = ({
  onSelectUniverse,
}) => {
  const [activeProfile, setActiveProfile] = useState<SectorAmbianceProfile>(
    ambianceManager.getActiveSector()
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(
    ambianceManager.getIsTransitioning()
  );
  const [isAmbianceEnabled, setIsAmbianceEnabled] = useState<boolean>(
    ambianceManager.isAmbianceEnabled()
  );
  const [ambianceVol, setAmbianceVol] = useState<number>(
    ambianceManager.getAmbianceVolume()
  );
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(
    sound.getIsMusicPlaying()
  );
  const [musicVol, setMusicVol] = useState<number>(sound.getMusicVolume());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [warpToast, setWarpToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubAmbiance = ambianceManager.subscribe(() => {
      setActiveProfile(ambianceManager.getActiveSector());
      setIsTransitioning(ambianceManager.getIsTransitioning());
      setIsAmbianceEnabled(ambianceManager.isAmbianceEnabled());
      setAmbianceVol(ambianceManager.getAmbianceVolume());
    });

    const handleMusicChange = () => {
      setIsMusicPlaying(sound.getIsMusicPlaying());
      setMusicVol(sound.getMusicVolume());
      setIsMuted(sound.getMuted());
    };

    sound.addMusicListener(handleMusicChange);

    return () => {
      unsubAmbiance();
      sound.removeMusicListener(handleMusicChange);
    };
  }, []);

  const handleToggleMusic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (isMusicPlaying) {
      sound.pauseMusic();
      setIsMusicPlaying(false);
    } else {
      if (isMuted) {
        sound.setMuted(false);
        setIsMuted(false);
      }
      await sound.toggleMusic();
      setIsMusicPlaying(sound.getIsMusicPlaying());
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    sound.setMuted(next);
    ambianceManager.setMuted(next);
    setIsMuted(next);
    if (next) {
      setIsMusicPlaying(false);
    }
  };

  const handleStopAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.stopAllAudio();
    ambianceManager.stopAll();
    sound.setMuted(true);
    ambianceManager.setMuted(true);
    setIsMuted(true);
    setIsMusicPlaying(false);
    setIsAmbianceEnabled(false);
  };

  const handleToggleDrone = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const next = !isAmbianceEnabled;
    setIsAmbianceEnabled(next);
    ambianceManager.setAmbianceEnabled(next);
  };

  const handleMasterVolumeChange = (newVol: number) => {
    setMusicVol(newVol);
    sound.setMusicVolume(newVol);
    if (isAmbianceEnabled) {
      setAmbianceVol(newVol);
      ambianceManager.setAmbianceVolume(newVol);
    }
    if (newVol <= 0.01) {
      sound.setMuted(true);
      ambianceManager.setMuted(true);
      setIsMuted(true);
      setIsMusicPlaying(false);
    } else if (isMuted) {
      sound.setMuted(false);
      ambianceManager.setMuted(false);
      setIsMuted(false);
    }
  };

  const handleSectorJump = async (sectorId: string) => {
    sound.playClick();
    const target = ambianceManager
      .getAllSectors()
      .find((s) => s.id === sectorId);
    if (target) {
      setWarpToast(`Hyperspace Jump: Entering ${target.sectorName}...`);
      setTimeout(() => setWarpToast(null), 3000);
    }
    await ambianceManager.shiftSector(sectorId, true);

    if (
      onSelectUniverse &&
      sectorId.startsWith('world_') &&
      sectorId !== activeProfile.id
    ) {
      onSelectUniverse(sectorId);
    }
  };

  const allSectors = ambianceManager.getAllSectors();

  return (
    <>
      {/* Mini Hyperspace Sector Audio Indicator (Docked Bottom Right above status bar) */}
      <aside
        aria-label="Sector Ambiance Audio Controls"
        className="fixed bottom-10 right-3 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto"
      >
        {/* Warp Jump Notice Toast */}
        {warpToast && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1120]/95 border border-[#00E5FF]/60 text-[#00E5FF] text-xs font-mono shadow-[0_0_20px_rgba(0,229,255,0.4)] animate-bounce"
            style={{
              borderColor: activeProfile.color,
              color: activeProfile.color,
            }}
          >
            <Zap className="w-3.5 h-3.5 animate-spin" />
            <span>{warpToast}</span>
          </div>
        )}

        {/* Compact Sector Pill */}
        <div
          id="sector-ambiance-hud-pill"
          onClick={() => {
            sound.playClick();
            setIsExpanded(!isExpanded);
          }}
          style={{
            borderColor: isTransitioning
              ? '#FF4D6D'
              : `${activeProfile.color}70`,
            boxShadow: isTransitioning
              ? '0 0 25px rgba(255, 77, 109, 0.5)'
              : `0 0 20px ${activeProfile.color}35`,
          }}
          className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#070B14]/90 backdrop-blur-xl border transition-all duration-300 cursor-pointer hover:scale-105 select-none ${
            isTransitioning ? 'animate-pulse' : ''
          }`}
          title="Click to open Space-Time Sector Ambiance Console"
        >
          {/* Pulsating Sector Radar Dot */}
          <div className="relative flex items-center justify-center">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeProfile.color }}
            />
            <span
              className="absolute w-4 h-4 rounded-full animate-ping opacity-60"
              style={{ backgroundColor: activeProfile.color }}
            />
          </div>

          {/* Sector Info */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] font-mono font-bold tracking-wider uppercase leading-none"
                style={{ color: activeProfile.color }}
              >
                {activeProfile.sectorCode}
              </span>
              {isTransitioning && (
                <span className="text-[9px] font-mono font-bold text-[#FF4D6D] uppercase animate-pulse">
                  WARPING...
                </span>
              )}
            </div>
            <span className="text-xs font-['Orbitron'] font-bold text-white tracking-wide leading-tight">
              {activeProfile.sectorName}
            </span>
          </div>

          {/* Dynamic Frequency Visualizer Bars */}
          <div className="flex items-end gap-0.5 h-4 px-1">
            {[0.4, 0.7, 1.0, 0.6, 0.8].map((mult, idx) => (
              <span
                key={idx}
                className="w-1 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: activeProfile.color,
                  height: isMusicPlaying || isAmbianceEnabled
                    ? `${Math.max(20, Math.min(100, Math.round(mult * 100)))}%`
                    : '20%',
                  opacity: isMuted ? 0.2 : 0.85,
                  animation:
                    (isMusicPlaying || isAmbianceEnabled) && !isMuted
                      ? `pulse ${0.4 + idx * 0.15}s ease-in-out infinite alternate`
                      : 'none',
                }}
              />
            ))}
          </div>

          {/* Quick Play/Pause Music */}
          <button
            type="button"
            onClick={handleToggleMusic}
            title={isMusicPlaying ? 'Pause Music' : 'Play Sector Music'}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMusicPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#00FFB2]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-gray-300" />
            )}
          </button>

          {/* Quick Sound Bar Slider */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-black/60 border border-white/10"
            onClick={(e) => e.stopPropagation()}
            title="Adjust Master Sound Volume"
          >
            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || musicVol === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : musicVol}
              onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
              className="w-14 sm:w-20 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
            <span className="text-[10px] font-mono text-gray-400 w-7 text-right">
              {isMuted || musicVol === 0 ? 'OFF' : `${Math.round(musicVol * 100)}%`}
            </span>
          </div>

          {/* Stop All Audio Button */}
          {(isMusicPlaying || isAmbianceEnabled || !isMuted) && (
            <button
              type="button"
              onClick={handleStopAll}
              title="Stop and Silence All Audio"
              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
            >
              STOP
            </button>
          )}

          {/* Expand Arrow */}
          <div className="text-gray-400 pl-0.5">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <Sliders className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </aside>

      {/* Expanded Flight Deck Audio Console Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-2xl bg-[#0B1120] border-2 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-6 max-h-[90vh] overflow-y-auto"
            style={{
              borderColor: `${activeProfile.color}80`,
              boxShadow: `0 0 50px ${activeProfile.color}30`,
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsExpanded(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Sector Telemetry */}
            <div className="flex items-start gap-4 pr-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                style={{
                  backgroundColor: `${activeProfile.color}20`,
                  border: `2px solid ${activeProfile.color}`,
                }}
              >
                {activeProfile.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${activeProfile.color}25`,
                      color: activeProfile.color,
                      border: `1px solid ${activeProfile.color}60`,
                    }}
                  >
                    {activeProfile.sectorCode}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {activeProfile.regionTitle}
                  </span>
                </div>
                <h2 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeProfile.sectorName}
                </h2>
                <p className="text-xs text-gray-300 font-mono mt-0.5">
                  {activeProfile.tagline}
                </p>
              </div>
            </div>

            {/* Active Soundscape Acoustic Card */}
            <div
              className="p-4 rounded-2xl border bg-black/40 text-xs font-mono space-y-1.5"
              style={{ borderColor: `${activeProfile.color}40` }}
            >
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" style={{ color: activeProfile.color }} />
                  ACTIVE SPACE-TIME ACOUSTIC FIELD
                </span>
                <span style={{ color: activeProfile.color }}>
                  BASE FREQ: {activeProfile.droneConfig.rootFreq} Hz
                </span>
              </div>
              <p className="text-gray-200 text-xs leading-relaxed">
                {activeProfile.soundscapeDesc}
              </p>
            </div>

            {/* Sector Traveler Matrix: Quick Hyperspace Jumps */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
                  SELECT PARALLEL SECTOR AMBIANCE:
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  Click to initiate space-time audio warp
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allSectors.map((sector) => {
                  const isActive = activeProfile.id === sector.id;
                  return (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => handleSectorJump(sector.id)}
                      style={{
                        borderColor: isActive
                          ? sector.color
                          : 'rgba(255,255,255,0.08)',
                        backgroundColor: isActive
                          ? `${sector.color}20`
                          : 'rgba(15,23,42,0.6)',
                        boxShadow: isActive
                          ? `0 0 15px ${sector.color}40`
                          : 'none',
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[72px] cursor-pointer ${
                        isActive ? 'ring-1' : 'hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{sector.icon}</span>
                        <span
                          className="text-[9px] font-mono font-bold"
                          style={{ color: sector.color }}
                        >
                          {sector.sectorCode}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white truncate font-['Orbitron']">
                        {sector.sectorName.replace('Sector 0', 'W0').replace('Sector ', 'W')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Mix Controls: Cosmic Drone & Synthwave Music */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              {/* Cosmic Drone Ambiance Controller */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-xs font-mono font-bold text-white">
                      Cosmic Space Drone
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleDrone}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      isAmbianceEnabled
                        ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {isAmbianceEnabled ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Drone Volume</span>
                    <span>{Math.round(ambianceVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambianceVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setAmbianceVol(v);
                      ambianceManager.setAmbianceVolume(v);
                    }}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Synthwave Music Controller */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#00FFB2]" />
                    <span className="text-xs font-mono font-bold text-white">
                      Synthwave Music
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleMusic}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      isMusicPlaying
                        ? 'bg-[#00FFB2] text-black shadow-[0_0_10px_rgba(0,255,178,0.4)]'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {isMusicPlaying ? 'PLAYING' : 'PAUSED'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Music Volume</span>
                    <span>{Math.round(musicVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setMusicVol(v);
                      sound.setMusicVolume(v);
                    }}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00FFB2]"
                  />
                </div>
              </div>
            </div>

            {/* Master Audio Override Strip */}
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-mono text-rose-200">
                  Quick Master Control: Stop or mute all active audio instantly.
                </span>
              </div>
              <button
                type="button"
                onClick={handleStopAll}
                className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-['Orbitron'] font-bold transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)] cursor-pointer"
              >
                SILENCE / STOP ALL
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  ambianceManager.triggerWarpSound();
                }}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test Hyperspace Warp SFX</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsExpanded(false);
                }}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-['Orbitron'] font-bold transition-all cursor-pointer"
              >
                Close Flight Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
