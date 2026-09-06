import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Zap,
  Coins,
  Heart,
  Flame,
  Award,
  Code2,
  CheckCircle2,
  Globe,
  Edit2,
  Check,
  Users,
  Radio,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { User, PlayerProgress, Universe } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';
import { getUniverseTheme } from '../data/universeThemes';
import { UniverseBackdrop } from './UniverseBackdrop';

interface ProfileViewProps {
  user: User;
  progress: PlayerProgress;
  universes: Universe[];
  onUpdateUser: (updatedUser: User) => void;
  onLogout?: () => void;
}

const AVATAR_OPTIONS = [
  { id: 'Code Wizard', emoji: '🧙‍♂️', name: 'Code Wizard' },
  { id: 'Binary Knight', emoji: '🛡️', name: 'Binary Knight' },
  { id: 'Robot Engineer', emoji: '🤖', name: 'Robot Engineer' },
  { id: 'Space Explorer', emoji: '🚀', name: 'Space Explorer' },
  { id: 'Cyber Programmer', emoji: '💻', name: 'Cyber Programmer' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  progress,
  universes,
  onUpdateUser,
  onLogout,
}) => {
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSaveAvatar = async () => {
    sound.playVictory();
    setSaving(true);
    try {
      const res = await api.updateSettings({
        userId: user.id,
        avatar: selectedAvatar,
      });
      if (res.success && res.user) {
        onUpdateUser(res.user);
        setEditingAvatar(false);
      }
    } catch (_) {
    } finally {
      setSaving(false);
    }
  };

  const getAvatarEmoji = (avatarName: string) => {
    switch (avatarName) {
      case 'Binary Knight': return '🛡️';
      case 'Robot Engineer': return '🤖';
      case 'Space Explorer': return '🚀';
      case 'Cyber Programmer': return '💻';
      default: return '🧙‍♂️';
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Profile Header Hero */}
      <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.7)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Responsive Grid Layout for Avatar & User Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          {/* Avatar Column */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center justify-center">
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] p-1 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                <div className="w-full h-full bg-[#070B14] rounded-2xl flex items-center justify-center text-4xl sm:text-5xl">
                  {getAvatarEmoji(user.avatar)}
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setEditingAvatar(!editingAvatar);
                }}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#00E5FF] text-black hover:scale-110 transition-transform shadow-md"
                title="Change Avatar Archetype"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <span className="mt-2 text-xs font-mono font-semibold text-gray-300">
              {user.avatar || 'Code Wizard'}
            </span>
          </div>

          {/* User Info & Badges Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-['Orbitron'] text-2xl sm:text-3xl font-extrabold text-white truncate">
                  {user.username}
                </h1>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  ID: <span className="text-gray-300 font-semibold">{user.id}</span> • {user.email}
                </p>
              </div>

              {/* Status Badges Grid */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 justify-center">
                <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold whitespace-nowrap">
                  <Shield className="w-4 h-4 flex-shrink-0" /> RANK {progress.level}
                </span>
                <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD166]/10 text-[#FFD166] border border-[#FFD166]/30 text-xs font-mono font-bold whitespace-nowrap">
                  <Coins className="w-4 h-4 flex-shrink-0" /> {progress.coins} COINS
                </span>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">XP PROGRESSION</span>
                <span className="text-[#00E5FF] font-bold">
                  {progress.xp} / {progress.xpToNextLevel} XP ({Math.min(100, Math.round((progress.xp / (progress.xpToNextLevel || 500)) * 100))}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#0B1120] rounded-full overflow-hidden border border-[#1F2937]">
                <div
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                  style={{
                    width: `${Math.min(100, Math.round((progress.xp / (progress.xpToNextLevel || 500)) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Avatar Selector Drawer */}
            {editingAvatar && (
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#1F2937] space-y-3 animate-fade-in text-left">
                <span className="text-xs font-mono font-bold text-gray-300 block">
                  CHOOSE ARCHETYPE AVATAR:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedAvatar(av.id);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 border transition-all ${
                        selectedAvatar === av.id
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                          : 'bg-[#111827] border-[#1F2937] text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <span>{av.emoji}</span>
                      <span className="truncate">{av.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#1F2937]">
                  <button
                    onClick={() => setEditingAvatar(false)}
                    className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAvatar}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-xl bg-[#00FFB2] text-black font-mono text-xs font-bold hover:bg-[#00E5FF] transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Avatar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grouped Profile Statistics in Consistent glass-panel Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-[0_0_30px_rgba(0,0,0,0.6)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white">
              GUARDIAN TELEMETRY & PERFORMANCE
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Sector Clearance Efficiency: <strong className="text-[#00FFB2] font-semibold">{progress.restorationPercentage}%</strong>
          </span>
        </div>

        {/* Responsive CSS Grid for Stats Dossier */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel-subtle p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#00E5FF]/40 transition-all duration-300 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-['Orbitron'] text-white">
              {progress.stats.challengesSolved}
            </span>
            <span className="text-[11px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              Challenges Solved
            </span>
          </div>

          <div className="glass-panel-subtle p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#FF4D6D]/40 transition-all duration-300 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#FF4D6D]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-['Orbitron'] text-white">
              {progress.stats.bossesDefeated}
            </span>
            <span className="text-[11px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              Bosses Defeated
            </span>
          </div>

          <div className="glass-panel-subtle p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#FFD166]/40 transition-all duration-300 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/30 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-[#FFD166]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-['Orbitron'] text-white">
              {progress.stats.streakDays}
            </span>
            <span className="text-[11px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              Day Streak
            </span>
          </div>

          <div className="glass-panel-subtle p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#00FFB2]/40 transition-all duration-300 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-[#00FFB2]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-['Orbitron'] text-white">
              {progress.stats.codeLinesWritten}
            </span>
            <span className="text-[11px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              Lines of C++
            </span>
          </div>
        </div>
      </div>

      {/* Guardian Badges & Accolades Showcase Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-[0_0_30px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FFD166]" />
            <h3 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white">
              GUARDIAN INSIGNIAS & EARNED BADGES
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Active Rank Tier: <strong className="text-[#00E5FF] font-semibold">Tier {Math.min(5, Math.max(1, Math.ceil(progress.level / 2)))}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              id: 'initiate',
              name: 'Syntax Pioneer',
              desc: 'Solves first challenge',
              icon: '⚔️',
              unlocked: progress.stats.challengesSolved >= 1,
            },
            {
              id: 'streak',
              name: 'Daily Vanguard',
              desc: 'Maintains active streak',
              icon: '🔥',
              unlocked: progress.stats.streakDays >= 1,
            },
            {
              id: 'boss',
              name: 'Boss Slayer',
              desc: 'Defeats sector boss',
              icon: '👑',
              unlocked: progress.stats.bossesDefeated >= 1,
            },
            {
              id: 'oop',
              name: 'OOP Master',
              desc: 'Purges Class Citadel',
              icon: '🏛️',
              unlocked: progress.completedUniverses.includes('world_3'),
            },
            {
              id: 'memory',
              name: 'Pointer Knight',
              desc: 'Cleans Memory Dimension',
              icon: '🛡️',
              unlocked: progress.completedUniverses.includes('world_6'),
            },
            {
              id: 'compiler',
              name: 'Zero-Cost Legend',
              desc: 'Reaches Core Compiler',
              icon: '⚡',
              unlocked: progress.completedUniverses.includes('world_8'),
            },
          ].map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 ${
                badge.unlocked
                  ? 'glass-panel-subtle border-[#FFD166]/40 shadow-[0_0_15px_rgba(255,209,102,0.15)] hover:scale-105'
                  : 'bg-[#070B14]/60 border-white/5 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1.5">{badge.icon}</div>
              <div>
                <span className="font-['Orbitron'] text-xs font-bold text-white block truncate">
                  {badge.name}
                </span>
                <span className="text-[10px] font-mono text-gray-400 block mt-0.5 line-clamp-1">
                  {badge.desc}
                </span>
              </div>
              <span
                className={`mt-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  badge.unlocked
                    ? 'bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/40'
                    : 'bg-[#1F2937] text-gray-500'
                }`}
              >
                {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Allied Universe Squads & Expedition Progress */}
      <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-6 shadow-[0_0_30px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-4">
          <h3 className="font-['Orbitron'] text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00E5FF]" /> ALLIED VANGUARD SQUADRONS & EXPEDITION FORCES
          </h3>
          <span className="text-xs font-mono text-gray-400">
            Total Restoration: <strong className="text-[#00FFB2]">{progress.restorationPercentage}%</strong>
          </span>
        </div>

        <div className="space-y-4">
          {universes.map((uni) => {
            const isCompleted = progress.completedUniverses.includes(uni.id);
            const isUnlocked = progress.unlockedUniverses.includes(uni.id);
            const clearedCount = uni.levels.filter((l) =>
              progress.completedLevels.includes(l.id)
            ).length;
            const theme = getUniverseTheme(uni.id);

            return (
              <div
                key={uni.id}
                className="relative overflow-hidden rounded-2xl bg-[#0B1120] border border-[#1F2937] p-5 shadow-lg space-y-4"
              >
                {/* Background Atmospheric Theme */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <UniverseBackdrop
                    universeId={uni.id}
                    className="w-full h-full"
                  />
                </div>

                {/* Top Row: Insignia + Titles + Status Badge */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Insignia + Unit info */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${theme.primaryColor}20`,
                        color: theme.primaryColor,
                        border: `1px solid ${theme.primaryColor}50`,
                      }}
                    >
                      {theme.team.insignia}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white">
                          {uni.name}
                        </h4>
                        <span className="text-gray-400 text-xs font-mono">//</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-200">
                          {theme.team.name}
                        </span>
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${theme.primaryColor}20`,
                            color: theme.primaryColor,
                            border: `1px solid ${theme.primaryColor}40`,
                          }}
                        >
                          WORLD 0{uni.order}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-400">
                        <span>Division: <strong className="text-gray-200">{theme.team.division}</strong></span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span>Perk:</span> {theme.team.squadPerk.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mission Cleared Count & Status Badge */}
                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-[#1F2937] pt-3 md:pt-0 flex-shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs font-mono text-gray-300 block font-bold">
                        {clearedCount} / {uni.levels.length} Missions Purged
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 block">
                        Sector Clearance
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#00FFB2]/20 text-[#00FFB2] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#00FFB2]/50 shadow-[0_0_15px_rgba(0,255,178,0.2)]">
                        <CheckCircle2 className="w-4 h-4" /> 100% RESTORED
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-mono font-bold border border-[#00E5FF]/30">
                        ACTIVE SQUAD
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#1F2937]/80 text-gray-500 text-xs font-mono">
                        🔒 LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Squad Members Roster preview row */}
                <div className="relative z-10 pt-3 border-t border-[#1F2937]/70 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 mr-2 uppercase tracking-wider">Vanguard Roster:</span>
                  {theme.team.members.map((m) => (
                    <div
                      key={m.id}
                      className="px-2.5 py-1 rounded-lg bg-[#070B14] border border-[#1F2937] flex items-center gap-1.5 text-[11px] font-mono text-gray-300"
                      title={`${m.name} (${m.role}) - "${m.quote}"\nSpecial Ability: ${m.specialAbility}`}
                    >
                      <span>{m.avatar}</span>
                      <span className="text-white font-medium">{m.name}</span>
                      <span className="text-gray-500 text-[10px]">({m.callsign})</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Session & Logout Card */}
      <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D6D]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-['Orbitron'] text-base font-bold">
            <Shield className="w-5 h-5 text-[#00E5FF]" /> GUARDIAN SESSION STATUS
          </div>
          <p className="text-xs text-gray-400 font-mono">
            Signed in as <span className="text-[#00E5FF] font-semibold">{user.username}</span> • <span className="text-gray-300">{user.email}</span>
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-mono text-[#00FFB2]">
            <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse"></span>
            <span>Cloud State Synchronized & Active</span>
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            id="profile-logout-btn"
            onClick={() => {
              sound.playClick();
              setShowLogoutConfirm(true);
            }}
            className="relative z-10 px-6 py-3 rounded-2xl bg-[#FF4D6D]/15 text-[#FF4D6D] hover:bg-[#FF4D6D]/25 border border-[#FF4D6D]/40 text-xs font-['Orbitron'] font-bold flex items-center gap-2.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,77,109,0.15)] hover:shadow-[0_0_25px_rgba(255,77,109,0.3)] hover:scale-[1.02]"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT SESSION</span>
          </button>
        )}
      </div>

      {/* Profile Logout Confirmation Modal */}
      {showLogoutConfirm && onLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-[#FF4D6D]/40 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_40px_rgba(255,77,109,0.35)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D]/20 text-[#FF4D6D] mx-auto flex items-center justify-center border border-[#FF4D6D]/40">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-['Orbitron'] text-lg font-bold text-white">
              LOGOUT CONFIRMATION
            </h3>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              Are you sure you want to log out of <span className="text-[#00E5FF] font-semibold">{user.username}</span>? Your completed missions and unlocked worlds remain safe.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowLogoutConfirm(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-[#1F2937] text-gray-300 font-mono text-xs hover:text-white cursor-pointer border border-gray-700"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                id="profile-confirm-logout-btn"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-rose-600 text-white font-['Orbitron'] text-xs font-bold hover:brightness-110 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> YES, LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
