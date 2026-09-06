import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Coins,
  Heart,
  Volume2,
  VolumeX,
  Music,
  Compass,
  Code2,
  Trophy,
  Award,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { User, PlayerProgress } from '../types';
import { sound } from '../utils/audio';
import { ambianceManager } from '../utils/ambianceManager';

interface NavbarProps {
  user: User;
  progress: PlayerProgress | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  progress,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenGuide,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(sound.getIsMusicPlaying());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleMusicUpdate = () => {
      setIsMusicPlaying(sound.getIsMusicPlaying());
      setIsMuted(sound.getMuted());
    };
    sound.addMusicListener(handleMusicUpdate);
    return () => {
      sound.removeMusicListener(handleMusicUpdate);
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    sound.setMuted(next);
    ambianceManager.setMuted(next);
    setIsMuted(next);
    if (!next) sound.playClick();
  };

  const toggleMusic = async () => {
    sound.playClick();
    await sound.toggleMusic();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'map', label: 'Worlds', icon: Sparkles },
    { id: 'practice', label: 'Practice', icon: Code2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'achievements', label: 'Badges', icon: Award },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (id: string) => {
    sound.playClick();
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const xpPercent = progress
    ? Math.min(100, Math.round((progress.xp / Math.max(1, progress.xpToNextLevel)) * 100))
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070B14]/80 backdrop-blur-xl border-b border-[#1F2937]/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] p-[1.5px] shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_28px_rgba(0,229,255,0.7)] transition-all">
              <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center font-mono font-bold text-sm text-[#00E5FF]">
                C++
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-['Orbitron'] font-bold text-base sm:text-lg tracking-wider text-white">
                <span className="text-[#00E5FF]">CodeWith</span>Universe
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider hidden sm:block">
                INTERACTIVE C++ LEARNING
              </p>
            </div>
          </div>

          {/* Player Quick Stats HUD */}
          {progress && (
            <div className="hidden lg:flex items-center gap-5 bg-[#111827]/90 border border-[#1F2937] px-4 py-2 rounded-2xl shadow-inner">
              {/* Level & XP */}
              <div className="flex flex-col gap-1 min-w-[140px]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-['Orbitron'] font-bold text-[#00E5FF] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#00E5FF]" /> LVL {progress.level}
                  </span>
                  <span className="text-gray-400 text-[11px] font-mono">
                    {progress.xp} / {progress.xpToNextLevel} XP
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>

              {/* Coins */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFD166] bg-[#FFD166]/10 px-2.5 py-1 rounded-lg border border-[#FFD166]/20 shadow-[0_0_12px_rgba(255,209,102,0.15)]">
                <Coins className="w-3.5 h-3.5" />
                <span>{progress.coins.toLocaleString()}</span>
              </div>

              {/* Lives */}
              <div className="flex items-center gap-1 text-xs font-semibold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-lg border border-[#FF4D6D]/20">
                {Array.from({ length: progress.maxLives || 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < progress.lives
                        ? 'fill-[#FF4D6D] text-[#FF4D6D] drop-shadow-[0_0_6px_rgba(255,77,109,0.8)]'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_16px_rgba(0,229,255,0.25)]'
                      : 'text-gray-300 hover:text-white hover:bg-[#1F2937]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* User Guide Codex Button */}
            <button
              id="navbar-guide-btn"
              onClick={() => {
                sound.playClick();
                onOpenGuide();
              }}
              title="Open Game & Coding Guide"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 hover:border-[#00E5FF]/60 shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-all cursor-pointer ml-1"
            >
              <BookOpen className="w-4 h-4 text-[#00E5FF]" />
              <span className="hidden lg:inline">GUIDE</span>
            </button>

            {/* Synthwave Music Quick Player */}
            <button
              id="navbar-music-toggle-btn"
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Pause Music' : 'Play Music'}
              className={`p-2 rounded-xl border transition-all ml-1 cursor-pointer flex items-center gap-1.5 ${
                isMusicPlaying
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-[#00E5FF] hover:bg-[#1F2937]/50'
              }`}
            >
              <Music className={`w-4 h-4 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
              {isMusicPlaying && (
                <span className="text-[10px] font-mono font-bold hidden lg:inline">MUSIC</span>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              id="audio-toggle-btn"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl text-gray-400 hover:text-[#00E5FF] hover:bg-[#1F2937]/50 transition-colors ml-0.5 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00FFB2]" />}
            </button>

            {/* User Pill / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#1F2937] ml-1">
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 bg-[#111827] border border-[#1F2937] rounded-xl cursor-pointer hover:border-[#00E5FF]/40 transition-colors"
                onClick={() => handleNavClick('profile')}
              >
                <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED] flex items-center justify-center text-xs">
                  {user.avatar === 'Binary Knight' ? '🛡️' : user.avatar === 'Robot Engineer' ? '🤖' : user.avatar === 'Space Explorer' ? '🚀' : user.avatar === 'Cyber Programmer' ? '💻' : '🧙‍♂️'}
                </div>
                <span className="text-xs font-medium text-gray-200 hidden xl:inline max-w-[90px] truncate">
                  {user.username}
                </span>
              </div>

              <button
                id="logout-btn"
                onClick={() => {
                  sound.playClick();
                  setShowLogoutModal(true);
                }}
                title="Logout of CodeWithUniverse"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-gray-300 hover:text-[#FF4D6D] bg-[#111827] hover:bg-[#FF4D6D]/15 border border-[#1F2937] hover:border-[#FF4D6D]/40 transition-all cursor-pointer shadow-sm group"
              >
                <LogOut className="w-3.5 h-3.5 text-[#FF4D6D] group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline text-[11px] font-bold tracking-wider">LOGOUT</span>
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-lg ${isMusicPlaying ? 'text-[#00E5FF] bg-[#00E5FF]/20' : 'text-gray-400 hover:text-[#00E5FF]'}`}
              title="Toggle Music"
            >
              <Music className={`w-5 h-5 ${isMusicPlaying ? 'animate-pulse' : ''}`} />
            </button>
            <button
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-[#00E5FF]"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#00FFB2]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1120] border-b border-[#1F2937] px-4 pt-2 pb-6 space-y-2">
          {progress && (
            <div className="flex items-center justify-between py-2 border-b border-[#1F2937] mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#00E5FF]">LVL {progress.level}</span>
                <span className="text-gray-400">{progress.xp} XP</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FFD166] flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {progress.coins}
                </span>
                <span className="text-[#FF4D6D] flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-[#FF4D6D]" /> {progress.lives}
                </span>
              </div>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                    : 'text-gray-300 hover:bg-[#1F2937]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            id="mobile-guide-btn"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
              onOpenGuide();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 transition-all border border-[#00E5FF]/30 mt-2 cursor-pointer font-mono"
          >
            <BookOpen className="w-4 h-4" />
            <span>Game User Guide & Codex</span>
          </button>

          <button
            id="mobile-logout-btn"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
              setShowLogoutModal(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#FF4D6D] bg-[#FF4D6D]/10 hover:bg-[#FF4D6D]/20 transition-all border border-[#FF4D6D]/30 mt-3 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session ({user.username})</span>
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#0E1626] border border-[#FF4D6D]/40 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_50px_rgba(255,77,109,0.25)] relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D]/20 text-[#FF4D6D] mx-auto flex items-center justify-center border border-[#FF4D6D]/40 shadow-inner">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-['Orbitron'] text-base font-bold text-white tracking-wide">
                DISCONNECT SESSION?
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Logged in as <span className="text-[#00E5FF] font-semibold">{user.username}</span>. Your level progress and unlocked universes have been saved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                id="cancel-logout-btn"
                onClick={() => {
                  sound.playClick();
                  setShowLogoutModal(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-[#1F2937] hover:bg-slate-700 text-gray-300 hover:text-white font-mono text-xs border border-gray-700 transition-colors cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                id="confirm-logout-btn"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-rose-600 text-white font-['Orbitron'] text-xs font-bold hover:brightness-110 shadow-[0_0_20px_rgba(255,77,109,0.5)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
