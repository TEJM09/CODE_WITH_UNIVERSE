import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Music,
  Radio,
  Sparkles,
  Loader2,
  Disc3,
  LogOut,
} from 'lucide-react';
import { User, PlayerProgress } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';

interface SettingsViewProps {
  user: User;
  onResetProgress: (newProgress: PlayerProgress) => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onResetProgress,
  onLogout,
}) => {
  const [sfxVolume, setSfxVolume] = useState(sound.getVolume() * 100);
  const [musicVolume, setMusicVolume] = useState(sound.getMusicVolume() * 100);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(sound.getIsMusicPlaying());
  const [isMusicLoading, setIsMusicLoading] = useState(sound.getIsMusicLoading());
  const [currentTrackId, setCurrentTrackId] = useState(sound.getCurrentTrackId());
  const [fontSize, setFontSize] = useState(13);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tracks = sound.getAllTracks();
  const activeTrack = sound.getCurrentTrackMeta();

  useEffect(() => {
    const handleMusicUpdate = () => {
      setIsMusicPlaying(sound.getIsMusicPlaying());
      setIsMusicLoading(sound.getIsMusicLoading());
      setCurrentTrackId(sound.getCurrentTrackId());
      setIsMuted(sound.getMuted());
      setMusicVolume(sound.getMusicVolume() * 100);
    };

    sound.addMusicListener(handleMusicUpdate);
    return () => {
      sound.removeMusicListener(handleMusicUpdate);
    };
  }, []);

  const handleSfxVolumeChange = (newVal: number) => {
    setSfxVolume(newVal);
    sound.setVolume(newVal / 100);
    sound.playClick();
  };

  const handleMusicVolumeChange = (newVal: number) => {
    setMusicVolume(newVal);
    sound.setMusicVolume(newVal / 100);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const handleTogglePlayMusic = async () => {
    sound.playClick();
    await sound.toggleMusic();
  };

  const handleSelectTrack = async (trackId: string) => {
    sound.playClick();
    await sound.switchTrack(trackId);
  };

  const handleExecuteReset = async () => {
    sound.playError();
    setResetting(true);
    try {
      const res = await api.resetProgress(user.id);
      if (res.success && res.progress) {
        onResetProgress(res.progress);
        setShowResetModal(false);
        setSuccessMessage('Progress and universe matrix have been reset to factory state.');
      }
    } catch (_) {
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] text-xs font-mono font-bold tracking-wider">
          <SettingsIcon className="w-3.5 h-3.5" /> SYSTEM CONFIGURATION
        </div>
        <h1 className="font-['Orbitron'] text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
          GUARDIAN SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono">
          Configure Howler.js synthwave soundtrack, sound synthesizer, and environment preferences.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. CINEMATIC SYNTHWAVE MUSIC PLAYER (HOWLER.JS) */}
      <div className="rounded-3xl glass-panel border border-[#00E5FF]/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-6 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 border-b border-[#1F2937]/70 pb-5">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              isMusicPlaying
                ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                : 'bg-[#111827] border-[#1F2937] text-gray-400'
            }`}>
              <Disc3 className={`w-6 h-6 ${isMusicPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Orbitron'] text-base sm:text-lg font-bold text-white tracking-wide">
                  CINEMATIC SYNTHWAVE PLAYER
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-mono font-bold">
                  HOWLER.JS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Dynamic retro synthwave soundtrack for cosmic coding sessions
              </p>
            </div>
          </div>

          {/* Master Play / Pause Button */}
          <button
            id="synthwave-master-play-btn"
            onClick={handleTogglePlayMusic}
            disabled={isMusicLoading}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-['Orbitron'] text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
              isMusicPlaying
                ? 'bg-[#00E5FF] text-[#070B14] shadow-[0_0_24px_rgba(0,229,255,0.6)] hover:bg-[#38bdf8]'
                : 'bg-[#1F2937] text-white hover:bg-[#374151] border border-[#374151] hover:border-[#00E5FF]/50'
            }`}
          >
            {isMusicLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>SYNTHESIZING...</span>
              </>
            ) : isMusicPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE SOUNDTRACK</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY SOUNDTRACK</span>
              </>
            )}
          </button>
        </div>

        {/* Current Active Soundtrack HUD */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1120]/90 border border-[#1F2937] relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeTrack.icon}</span>
              <span className="font-['Orbitron'] text-white font-bold text-sm sm:text-base">
                {activeTrack.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40 text-[10px] font-mono font-bold">
                {activeTrack.genre}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-mono max-w-xl leading-relaxed">
              {activeTrack.description}
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400 pt-1">
              <span>BPM: <strong className="text-[#00E5FF]">{activeTrack.bpm}</strong></span>
              <span>•</span>
              <span>Key: <strong className="text-[#00FFB2]">{activeTrack.key}</strong></span>
              <span>•</span>
              <span>Engine: <strong className="text-gray-200">Howler AudioBuffer PCM</strong></span>
            </div>
          </div>

          {/* Visualizer Equalizer Simulation */}
          <div className="flex items-end gap-1.5 h-10 px-3 py-1.5 rounded-xl bg-[#070B14] border border-[#1F2937] flex-shrink-0">
            {[45, 80, 60, 95, 70, 85, 50, 90, 65, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full transition-all duration-300"
                style={{
                  height: isMusicPlaying ? `${Math.max(15, (h * (musicVolume / 100)))}%` : '20%',
                  backgroundColor: isMusicPlaying
                    ? i % 2 === 0
                      ? '#00E5FF'
                      : '#00FFB2'
                    : '#374151',
                  boxShadow: isMusicPlaying ? '0 0 8px rgba(0,229,255,0.5)' : 'none',
                  animation: isMusicPlaying ? `pulse ${(0.4 + (i % 4) * 0.15)}s ease-in-out infinite alternate` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Track Selection Cards */}
        <div className="space-y-3 relative z-10">
          <label className="block text-xs font-mono font-bold text-gray-400 tracking-wider">
            SELECT SOUNDTRACK THEME
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tracks.map((trk) => {
              const isSelected = trk.id === currentTrackId;
              return (
                <button
                  key={trk.id}
                  id={`track-select-${trk.id}`}
                  onClick={() => handleSelectTrack(trk.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.2)]'
                      : 'bg-[#0B1120]/70 border-[#1F2937] hover:border-[#00E5FF]/40 hover:bg-[#0B1120]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{trk.icon}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-[#00E5FF]/30">
                        {isMusicPlaying ? 'PLAYING' : 'ACTIVE'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-['Orbitron'] text-xs font-bold text-white mb-0.5">
                      {trk.title}
                    </h4>
                    <p className="text-[11px] font-mono text-gray-400 line-clamp-1 mb-2">
                      {trk.genre}
                    </p>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 pt-2 border-t border-[#1F2937]">
                      <span>{trk.bpm} BPM</span>
                      <span>{trk.key}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Music Volume Control Slider */}
        <div className="relative z-10 pt-2">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Music className="w-3.5 h-3.5 text-[#00E5FF]" /> BACKGROUND MUSIC VOLUME
            </span>
            <span className="text-[#00E5FF] font-bold">{Math.round(musicVolume)}%</span>
          </div>
          <input
            id="music-volume-slider"
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
            className="w-full accent-[#00E5FF] cursor-pointer"
          />
        </div>
      </div>

      {/* 2. AUDIO SYNTHESIZER & SFX */}
      <div className="rounded-3xl glass-panel border border-[#1F2937] p-6 shadow-[0_0_24px_rgba(0,0,0,0.5)] space-y-5">
        <h3 className="font-['Orbitron'] text-base font-bold text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#00FFB2]" /> SOUND EFFECTS & SYNTHESIS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">
              MASTER SOUND FX VOLUME ({Math.round(sfxVolume)}%)
            </label>
            <input
              id="sfx-volume-slider"
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
              className="w-full accent-[#00FFB2] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0B1120] border border-[#1F2937] rounded-2xl">
            <div>
              <div className="text-xs font-bold text-white">MASTER AUDIO MUTE</div>
              <div className="text-[11px] text-gray-400 font-mono">
                Silence music soundtrack and combat sound FX
              </div>
            </div>
            <button
              id="settings-mute-toggle-btn"
              onClick={handleToggleMute}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-[#FF4D6D]/20 border-[#FF4D6D]/40 text-[#FF4D6D]'
                  : 'bg-[#00FFB2]/20 border-[#00FFB2]/40 text-[#00FFB2]'
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MONACO C++ EDITOR PREFERENCES */}
      <div className="rounded-3xl glass-panel border border-[#1F2937] p-6 shadow-[0_0_24px_rgba(0,0,0,0.5)] space-y-5">
        <h3 className="font-['Orbitron'] text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#7C3AED]" /> MONACO C++ EDITOR PREFERENCES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">
              EDITOR FONT SIZE
            </label>
            <div className="flex items-center gap-2">
              {[12, 13, 14, 16].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    sound.playClick();
                    setFontSize(size);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    fontSize === size
                      ? 'bg-[#7C3AED] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                      : 'bg-[#0B1120] text-gray-400 hover:text-white border border-[#1F2937]'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#0B1120] border border-[#1F2937] rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">ACTIVE C++ COMPILER</div>
              <div className="text-[11px] text-gray-400 font-mono">
                GNU GCC / G++ 12+ (ISO C++17 Standard)
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#00FFB2]/20 text-[#00FFB2] text-xs font-mono font-bold">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* 4. ACCOUNT SESSION & LOGOUT */}
      <div className="rounded-3xl glass-panel border border-[#00E5FF]/20 p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-['Orbitron'] text-base font-bold text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-[#00E5FF]" /> ACCOUNT & SESSION
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Currently authenticated as <span className="text-[#00E5FF] font-semibold">{user.username}</span> ({user.email}).
            </p>
          </div>

          <button
            type="button"
            id="settings-logout-btn"
            onClick={() => {
              sound.playClick();
              if (onLogout) {
                setShowLogoutModal(true);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/40 text-xs font-mono font-bold hover:bg-[#FF4D6D]/25 transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT SESSION</span>
          </button>
        </div>
      </div>

      {/* 5. DANGER ZONE: RESET GAME PROGRESS */}
      <div className="rounded-3xl glass-panel border border-[#FF4D6D]/30 p-6 shadow-[0_0_24px_rgba(255,77,109,0.1)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-['Orbitron'] text-base font-bold text-[#FF4D6D] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" /> PROGRESS PROTOCOL RESET
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Reset all solved levels, universe restoration rates, and XP to level 1 baseline.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowResetModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/40 text-xs font-mono font-bold hover:bg-[#FF4D6D]/25 transition-colors cursor-pointer"
          >
            RESET PROGRESS
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-[#FF4D6D]/40 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_40px_rgba(255,77,109,0.3)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D]/20 text-[#FF4D6D] mx-auto flex items-center justify-center border border-[#FF4D6D]/40">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-['Orbitron'] text-lg font-bold text-white">
              LOGOUT OF CODEWITHUNIVERSE?
            </h3>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              You are signed in as <span className="text-[#00E5FF] font-semibold">{user.username}</span>. All your level scores, items, and universe clears are securely saved to the database.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowLogoutModal(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-[#1F2937] text-gray-300 font-mono text-xs hover:text-white cursor-pointer border border-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                id="settings-confirm-logout-btn"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout?.();
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-rose-600 text-white font-['Orbitron'] text-xs font-bold hover:brightness-110 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> YES, LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-[#FF4D6D] rounded-3xl p-6 text-center space-y-4 shadow-[0_0_40px_rgba(255,77,109,0.4)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D]/20 text-[#FF4D6D] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-['Orbitron'] text-lg font-bold text-white">
              CONFIRM UNIVERSE RESET?
            </h3>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              This will erase all completed missions, unlocked universes, and XP progression in the backend data layer. This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="py-2.5 px-4 rounded-xl bg-[#1F2937] text-gray-300 font-mono text-xs hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                disabled={resetting}
                className="py-2.5 px-4 rounded-xl bg-[#FF4D6D] text-white font-['Orbitron'] text-xs font-bold hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
              >
                {resetting ? 'RESETTING...' : 'YES, RESET ALL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
