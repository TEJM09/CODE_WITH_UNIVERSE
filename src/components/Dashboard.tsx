import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Coins,
  Heart,
  Flame,
  Globe,
  Code2,
  Trophy,
  Award,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  Target,
  Shield,
  Layers,
  Cpu,
  Terminal,
  Users,
  BookOpen,
} from 'lucide-react';
import { User, PlayerProgress, Universe } from '../types';
import { sound } from '../utils/audio';
import { getUniverseTheme } from '../data/universeThemes';
import { UniverseBackdrop } from './UniverseBackdrop';
import { DailyMissions } from './DailyMissions';
import { getRemainingDisruptionSeconds, subscribeToDisruptions } from '../utils/disruptionManager';
import { ambianceManager } from '../utils/ambianceManager';
import { getLevelExplanation } from '../utils/gameExplanations';

interface DashboardProps {
  user: User;
  progress: PlayerProgress;
  universes: Universe[];
  onSelectUniverse: (universeId: string) => void;
  onSelectLevel: (levelId: string, universeId: string) => void;
  onNavigate: (tab: string) => void;
  onRefreshProgress: () => void;
  onOpenGuide: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  progress,
  universes,
  onSelectUniverse,
  onSelectLevel,
  onNavigate,
  onRefreshProgress,
  onOpenGuide,
}) => {
  const [, setTick] = useState<number>(0);

  // Live timer tick for disruption countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    const unsub = subscribeToDisruptions(() => setTick((t) => t + 1));
    return () => {
      clearInterval(timer);
      unsub();
    };
  }, []);

  // Find next playable level
  let nextPlayableLevel: { level: any; universe: Universe } | null = null;
  for (const u of universes) {
    if (progress.unlockedUniverses.includes(u.id)) {
      for (const lvl of u.levels) {
        if (!progress.completedLevels.includes(lvl.id)) {
          nextPlayableLevel = { level: lvl, universe: u };
          break;
        }
      }
    }
    if (nextPlayableLevel) break;
  }

  // Fallback to first level
  if (!nextPlayableLevel && universes.length > 0 && universes[0].levels.length > 0) {
    nextPlayableLevel = { level: universes[0].levels[0], universe: universes[0] };
  }

  const xpPercent = Math.min(
    100,
    Math.round((progress.xp / Math.max(1, progress.xpToNextLevel)) * 100)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP GUARDIAN HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-[#00E5FF]/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Ambient Glow Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Profile & Rank Overview */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] p-1 shadow-[0_0_24px_rgba(0,229,255,0.4)]">
                <div className="w-full h-full bg-[#070B14] rounded-2xl flex items-center justify-center text-4xl sm:text-5xl">
                  {user.avatar === 'Binary Knight' ? '🛡️' : user.avatar === 'Robot Engineer' ? '🤖' : user.avatar === 'Space Explorer' ? '🚀' : user.avatar === 'Cyber Programmer' ? '💻' : '🧙‍♂️'}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#00E5FF] text-black font-['Orbitron'] text-[10px] font-extrabold shadow-md">
                LVL {progress.level}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-['Orbitron'] text-xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {user.username}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] text-[10px] font-mono font-bold">
                  PLAYER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                C++ Learning Adventure • {progress.completedUniverses.length} of 8 Worlds Completed
              </p>

              {/* XP Progress Bar */}
              <div className="pt-2 w-48 sm:w-64 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>EXP to Level {progress.level + 1}</span>
                  <span className="text-[#00E5FF] font-bold">{progress.xp} / {progress.xpToNextLevel} XP</span>
                </div>
                <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden border border-[#1F2937]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full md:w-auto">
            {/* Coins */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B1120]/80 border border-[#1F2937] flex flex-col items-center justify-center min-w-[90px] shadow-sm">
              <Coins className="w-5 h-5 text-[#FFD166] mb-1 filter drop-shadow-[0_0_6px_rgba(255,209,102,0.6)]" />
              <span className="text-base sm:text-lg font-bold font-['Orbitron'] text-white">
                {progress.coins}
              </span>
              <span className="text-xs text-gray-300">Coins</span>
            </div>

            {/* Streak */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B1120]/80 border border-[#1F2937] flex flex-col items-center justify-center min-w-[90px] shadow-sm">
              <Flame className="w-5 h-5 text-[#FF4D6D] mb-1 filter drop-shadow-[0_0_6px_rgba(255,77,109,0.6)]" />
              <span className="text-base sm:text-lg font-bold font-['Orbitron'] text-white">
                {progress.stats.streakDays}
              </span>
              <span className="text-xs text-gray-300">Day Streak</span>
            </div>

            {/* Code Lines */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B1120]/80 border border-[#1F2937] flex flex-col items-center justify-center min-w-[90px] shadow-sm">
              <Code2 className="w-5 h-5 text-[#00FFB2] mb-1 filter drop-shadow-[0_0_6px_rgba(0,255,178,0.6)]" />
              <span className="text-base sm:text-lg font-bold font-['Orbitron'] text-white">
                {progress.stats.codeLinesWritten}
              </span>
              <span className="text-xs text-gray-300">Code Lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GAME GUIDE QUICK BANNER */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#00E5FF]/10 via-[#7C3AED]/10 to-[#00FFB2]/10 border border-[#00E5FF]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,229,255,0.1)] backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-inner flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white tracking-wide">
                HOW TO PLAY & GAME GUIDE
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/30">
                TUTORIAL
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 font-sans">
              Simple guide on writing C++ code, solving levels, boss battles, and earning rewards.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="open-user-guide-btn"
          onClick={() => {
            sound.playClick();
            onOpenGuide();
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black font-['Orbitron'] text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <BookOpen className="w-4 h-4" />
          <span>VIEW USER GUIDE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. RESUME CAMPAIGN SECTOR */}
      {nextPlayableLevel && (
        <div
          id="resume-mission-card"
          onClick={() => {
            sound.playClick();
            onSelectLevel(nextPlayableLevel.level.id, nextPlayableLevel.universe.id);
          }}
          className="rounded-3xl glass-panel border border-[#00E5FF]/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(0,229,255,0.15)] flex flex-col justify-between group cursor-pointer hover:border-[#00E5FF] transition-all relative overflow-hidden"
        >
          {/* Universe Visual Atmospheric Backdrop */}
          <UniverseBackdrop
            universeId={nextPlayableLevel.universe.id}
            className="absolute inset-0 w-full h-full opacity-35 group-hover:opacity-50 transition-opacity"
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold tracking-wide">
                CURRENT LEVEL • WORLD {nextPlayableLevel.universe.order}
              </span>
              <span className="text-xs text-gray-300 font-medium">
                {nextPlayableLevel.universe.topic}
              </span>
            </div>

            <h2 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white group-hover:text-[#00E5FF] transition-colors mb-2">
              {nextPlayableLevel.level.title}
            </h2>
            {(() => {
              const nextExp = getLevelExplanation(
                nextPlayableLevel.level.id,
                nextPlayableLevel.level.prompt,
                nextPlayableLevel.level.expectedOutput
              );
              return (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mb-4 bg-[#0B1120]/80 p-2.5 rounded-xl border border-[#00E5FF]/20 font-mono">
                  <span className="text-[#00E5FF] font-bold">GOAL:</span>
                  <span>{nextExp.shortGoal}</span>
                </div>
              );
            })()}

            {/* Level Objectives & Enemy Snippet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0B1120]/90 border border-[#1F2937] p-3.5 rounded-2xl mb-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{nextPlayableLevel.level.enemy?.avatar || '👾'}</div>
                <div>
                  <div className="text-xs font-bold text-gray-200">
                    {nextPlayableLevel.level.enemy?.name}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {nextPlayableLevel.level.type === 'boss' ? '👑 Boss Level' : '👾 Challenge Level'} ({nextPlayableLevel.level.enemy?.hp} HP)
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-end gap-3 text-xs font-mono">
                <span className="text-[#00E5FF] font-bold">+{nextPlayableLevel.level.rewards.xp} XP</span>
                <span className="text-[#FFD166] font-bold">+{nextPlayableLevel.level.rewards.coins} Coins</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-2">
            <span className="text-xs text-gray-300 flex items-center gap-1.5 font-medium">
              <Play className="w-3.5 h-3.5 text-[#00FFB2]" /> Ready to Code
            </span>
            <button
              id="launch-mission-btn"
              className="px-5 py-2.5 rounded-xl font-['Orbitron'] text-xs font-bold text-black bg-[#00E5FF] hover:bg-[#00FFB2] transition-colors flex items-center gap-2 shadow-[0_0_16px_rgba(0,229,255,0.4)]"
            >
              <span>CONTINUE LEVEL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. ENHANCED DAILY MISSIONS COMPONENT */}
      <DailyMissions
        user={user}
        progress={progress}
        onRefreshProgress={onRefreshProgress}
      />

      {/* 5. PARALLEL UNIVERSES GRID PREVIEW */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#00E5FF]" /> THE 8 WORLDS
            </h2>
            <p className="text-xs text-gray-300 font-sans">
              Learn C++ step by step, from basic variables to advanced object-oriented programming
            </p>
          </div>

          <button
            id="view-full-universe-map-btn"
            onClick={() => {
              sound.playClick();
              onNavigate('map');
            }}
            className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Worlds</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {universes.map((uni) => {
            const isUnlocked = progress.unlockedUniverses.includes(uni.id);
            const isCompleted = progress.completedUniverses.includes(uni.id);
            const remSecs = getRemainingDisruptionSeconds(uni.id);
            const isDisrupted = remSecs > 0;
            const completedCount = uni.levels.filter((l) =>
              progress.completedLevels.includes(l.id)
            ).length;
            const theme = getUniverseTheme(uni.id);

            return (
              <div
                key={uni.id}
                id={`universe-card-${uni.id}`}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    ambianceManager.shiftSector(uni.id, false);
                    onSelectUniverse(uni.id);
                  } else {
                    sound.playError();
                  }
                }}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between min-h-[220px] shadow-lg ${
                  isDisrupted
                    ? 'border-[#FF4D6D] shadow-[0_0_24px_rgba(255,77,109,0.3)] cursor-pointer hover:scale-[1.02]'
                    : isCompleted
                    ? 'border-[#00FFB2]/50 shadow-[0_0_20px_rgba(0,255,178,0.15)] cursor-pointer hover:scale-[1.02]'
                    : isUnlocked
                    ? 'border-[#1F2937] hover:border-[#00E5FF]/60 cursor-pointer hover:scale-[1.02] shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                    : 'bg-[#0B1120]/60 border-[#1F2937]/50 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Universe Visual Atmospheric Backdrop */}
                <UniverseBackdrop
                  universeId={uni.id}
                  className="absolute inset-0 w-full h-full opacity-40 hover:opacity-60 transition-opacity"
                />

                {/* World badge & Info */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
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

                    {isDisrupted ? (
                      <span className="text-[10px] text-[#FF4D6D] font-bold flex items-center gap-1 animate-pulse">
                        ⚠️ DISRUPTED ({Math.floor(remSecs / 60)}:{String(remSecs % 60).padStart(2, '0')})
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] text-[#00FFB2] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> COMPLETED
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] text-gray-300 font-medium">
                        {completedCount}/{uni.levels.length} Cleared
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500">🔒 Locked</span>
                    )}
                  </div>

                  <h3 className="font-['Orbitron'] text-base font-bold text-white mb-1">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-1 mb-2">
                    {uni.topic}
                  </p>

                  {/* Team Insignia tag */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-gray-300 w-fit backdrop-blur-sm">
                    <span>{theme.team.insignia}</span>
                    <span className="truncate max-w-[140px]" style={{ color: theme.primaryColor }}>
                      {theme.team.name}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs mt-3">
                  <span className="text-[11px] text-gray-300">
                    {uni.levels.length} Levels
                  </span>
                  {isUnlocked && (
                    <span
                      className="text-xs font-semibold flex items-center gap-1"
                      style={{ color: theme.primaryColor }}
                    >
                      Play <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. PRACTICE MODE & LEADERBOARD PROMO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Sandbox CTA */}
        <div
          id="practice-sandbox-cta"
          onClick={() => {
            sound.playClick();
            onNavigate('practice');
          }}
          className="rounded-3xl glass-panel border border-[#1F2937] hover:border-[#7C3AED]/70 p-6 cursor-pointer transition-all shadow-[0_0_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#7C3AED] text-[10px] font-bold">
              FREE CODE PLAYGROUND
            </span>
            <h3 className="font-['Orbitron'] text-lg font-bold text-white">
              C++ Free Practice
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Write and run any C++ code freely. Test your own programs, experiment with variables and loops, and see instant output.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
        </div>

        {/* Global Leaderboard CTA */}
        <div
          id="global-leaderboard-cta"
          onClick={() => {
            sound.playClick();
            onNavigate('leaderboard');
          }}
          className="rounded-3xl glass-panel border border-[#1F2937] hover:border-[#00FFB2]/70 p-6 cursor-pointer transition-all shadow-[0_0_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,178,0.3)] flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00FFB2]/20 border border-[#00FFB2]/40 text-[#00FFB2] text-[10px] font-bold">
              PLAYER RANKINGS
            </span>
            <h3 className="font-['Orbitron'] text-lg font-bold text-white">
              Leaderboard & Scores
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              See top players, check your ranking, and earn higher positions on the leaderboard as you complete more coding levels.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#00FFB2]/20 border border-[#00FFB2]/40 flex items-center justify-center text-2xl flex-shrink-0">
            🏆
          </div>
        </div>
      </div>
    </div>
  );
};
