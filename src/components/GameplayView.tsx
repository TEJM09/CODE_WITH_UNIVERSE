import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Play,
  RotateCcw,
  Lightbulb,
  Shield,
  Zap,
  Sword,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Award,
  Flame,
  FileCode,
  Check,
  Users,
  Radio,
  Compass,
  HelpCircle,
  Target,
  BookOpen,
} from 'lucide-react';
import { Level, Universe, PlayerProgress, EvaluateResponse } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';
import { getUniverseTheme } from '../data/universeThemes';
import { UniverseBackdrop } from './UniverseBackdrop';
import { WorldDisruptedOverlay } from './WorldDisruptedOverlay';
import { getLevelExplanation } from '../utils/gameExplanations';
import {
  DisruptedWorld,
  getDisruptedWorld,
  isWorldDisrupted,
  disruptWorld,
  restoreWorld,
  subscribeToDisruptions,
} from '../utils/disruptionManager';
import { ambianceManager } from '../utils/ambianceManager';

interface GameplayViewProps {
  level: Level;
  universe: Universe;
  progress: PlayerProgress;
  onBackToMap: () => void;
  onLevelComplete: (updatedProgress: PlayerProgress) => void;
  onNextLevel?: () => void;
}

export const GameplayView: React.FC<GameplayViewProps> = ({
  level,
  universe,
  progress,
  onBackToMap,
  onLevelComplete,
  onNextLevel,
}) => {
  const [code, setCode] = useState(level.starterCode);
  const [enemyHp, setEnemyHp] = useState(level.enemy.hp);
  const [maxEnemyHp] = useState(level.enemy.hp);
  const [isCompiling, setIsCompiling] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluateResponse | null>(null);
  const [revealedHints, setRevealedHints] = useState<number[]>([0]);
  const [solutionUsed, setSolutionUsed] = useState(false);
  const [boostsUsed, setBoostsUsed] = useState(0);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryData, setVictoryData] = useState<EvaluateResponse | null>(null);
  const [combatAnimation, setCombatAnimation] = useState<'idle' | 'attack' | 'hit' | 'shield'>('idle');
  const [combatMessage, setCombatMessage] = useState<string>('Enemy awaiting combat evaluation...');
  const [squadCheerMessage, setSquadCheerMessage] = useState<string | null>(null);
  const [penaltyAlert, setPenaltyAlert] = useState<string | null>(null);

  // Level Mission Countdown Timer (minimum 2 to 3 minutes)
  const [timerDuration, setTimerDuration] = useState<number>(180); // 180 seconds (3:00) default
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [isDisrupted, setIsDisrupted] = useState<boolean>(() => isWorldDisrupted(universe.id));
  const [disruptedInfo, setDisruptedInfo] = useState<DisruptedWorld | null>(() => getDisruptedWorld(universe.id));
  const [showStory, setShowStory] = useState<boolean>(false);

  const theme = getUniverseTheme(universe.id);
  const explanation = getLevelExplanation(level.id, level.prompt, level.expectedOutput);

  // Switch to universe-specific soundtrack and sector ambiance automatically
  useEffect(() => {
    ambianceManager.shiftSector(universe.id, false);
  }, [universe.id]);

  // Sync disruption status on mount or level/universe change
  useEffect(() => {
    const disrupted = getDisruptedWorld(universe.id);
    if (disrupted) {
      setIsDisrupted(true);
      setDisruptedInfo(disrupted);
    } else {
      setIsDisrupted(false);
      setDisruptedInfo(null);
      setTimeLeft(timerDuration);
    }
  }, [universe.id, level.id, timerDuration]);

  // Subscribe to global disruption changes
  useEffect(() => {
    const unsubscribe = subscribeToDisruptions(() => {
      const disrupted = getDisruptedWorld(universe.id);
      setIsDisrupted(!!disrupted);
      setDisruptedInfo(disrupted);
    });
    return () => unsubscribe();
  }, [universe.id]);

  // Challenge Countdown Timer (Counts down while level is active)
  useEffect(() => {
    if (showVictoryModal || isDisrupted || isCompiling) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Mission failed due to timeout -> World disrupted for 2.5 minutes (150 seconds)
          const newDisruption = disruptWorld(
            universe.id,
            universe.name,
            level.id,
            level.title,
            150, // 2.5 minutes (minimum 2 to 3 minutes)
            'Mission timer ran out before code challenge was solved'
          );
          setIsDisrupted(true);
          setDisruptedInfo(newDisruption);
          return 0;
        }

        // Subtle warning ticks when under 20 seconds
        if (prev - 1 <= 20) {
          sound.playTimerTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showVictoryModal, isDisrupted, isCompiling, universe.id, universe.name, level.id, level.title]);

  // Calculate live penalties and potential rewards
  const cluesCount = Math.max(0, revealedHints.length - 1);
  const clueXpPenalty = cluesCount * 15;
  const clueCoinPenalty = cluesCount * 10;
  const boostXpPenalty = boostsUsed * 5;
  const boostCoinPenalty = boostsUsed * 3;
  const solutionXpPenalty = solutionUsed ? Math.round((level.rewards.xp || 100) * 0.45) : 0;
  const solutionCoinPenalty = solutionUsed ? Math.round((level.rewards.coins || 50) * 0.45) : 0;

  const totalCurrentXpPenalty = clueXpPenalty + boostXpPenalty + solutionXpPenalty;
  const totalCurrentCoinPenalty = clueCoinPenalty + boostCoinPenalty + solutionCoinPenalty;
  const potentialXp = Math.max(20, (level.rewards.xp || 100) - totalCurrentXpPenalty);
  const potentialCoins = Math.max(10, (level.rewards.coins || 50) - totalCurrentCoinPenalty);

  // Reset state when level changes
  useEffect(() => {
    setCode(level.starterCode);
    setEnemyHp(level.enemy.hp);
    setEvalResult(null);
    setShowVictoryModal(false);
    setVictoryData(null);
    setCombatAnimation('idle');
    setCombatMessage('Enemy awaiting combat evaluation...');
    setRevealedHints([0]);
    setSolutionUsed(false);
    setBoostsUsed(0);
    setSquadCheerMessage(null);
    setPenaltyAlert(null);
    setTimeLeft(timerDuration);
  }, [level.id, timerDuration]);

  const handleRetryAfterDisruption = () => {
    restoreWorld(universe.id);
    setIsDisrupted(false);
    setDisruptedInfo(null);
    setTimeLeft(timerDuration);
    setCode(level.starterCode);
    setEnemyHp(level.enemy.hp);
    setEvalResult(null);
  };

  const handleSpendCoinsReboot = (cost: number) => {
    if (cost > 0 && progress) {
      const updated = {
        ...progress,
        coins: Math.max(0, progress.coins - cost),
      };
      onLevelComplete(updated);
    }
    restoreWorld(universe.id);
    setIsDisrupted(false);
    setDisruptedInfo(null);
    setTimeLeft(timerDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const triggerPenaltyNotice = (msg: string) => {
    setPenaltyAlert(msg);
    setTimeout(() => setPenaltyAlert(null), 4000);
  };

  const handleCompileAndRun = async () => {
    sound.playLaser();
    setIsCompiling(true);
    setEvalResult(null);
    setCombatAnimation('attack');

    try {
      const res = await api.evaluateCode({
        userId: progress.userId,
        levelId: level.id,
        universeId: universe.id,
        code,
        enemyHp,
        cluesUsed: cluesCount,
        solutionUsed,
        boostsUsed,
      });

      setEvalResult(res);

      if (res.success) {
        sound.playHit();
        setCombatAnimation('hit');
        const newHp = Math.max(0, enemyHp - (res.damageDealt || 100));
        setEnemyHp(newHp);
        setCombatMessage(`Critical hit! Dealt ${res.damageDealt} damage with pure C++ logic.`);

        // Trigger victory
        setTimeout(() => {
          sound.playVictory();
          if (res.leveledUp) sound.playLevelUp();
          
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: [theme.primaryColor, theme.accentColor, '#00FFB2', '#FFD166'],
          });

          setVictoryData(res);
          setShowVictoryModal(true);

          if (res.progress) {
            onLevelComplete(res.progress);
          }
        }, 600);
      } else {
        sound.playError();
        setCombatAnimation('idle');
        setCombatMessage(res.message || 'Syntax or logical defect detected. Combat failed.');
      }
    } catch (err: any) {
      sound.playError();
      setEvalResult({
        success: false,
        compilationSuccess: false,
        stdout: '',
        stderr: 'Failed to communicate with C++ backend engine.',
        compileError: 'Backend communication exception',
        message: 'Compilation failed',
        damageDealt: 0,
        testsPassed: 0,
        totalTests: 1,
        executionTimeMs: 0,
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleAction = async (actionType: 'strike' | 'laser' | 'shield') => {
    if (actionType === 'laser') sound.playLaser();
    else if (actionType === 'shield') sound.playShield();
    else sound.playHit();

    setBoostsUsed((prev) => prev + 1);
    triggerPenaltyNotice(`Combat boost applied (-5 XP, -3 Coins penalty)`);
    setCombatAnimation(actionType === 'shield' ? 'shield' : 'attack');

    try {
      const res = await api.bossAction({
        currentHp: enemyHp,
        maxHp: maxEnemyHp,
        action: actionType,
      });

      if (res.success) {
        const nextHp = Math.max(0, res.remainingHp);
        setEnemyHp(nextHp);
        setCombatMessage(`${res.actionMessage} ${res.bossMessage}`);

        if (res.defeated) {
          setTimeout(() => {
            sound.playVictory();
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#00E5FF', '#00FFB2', '#FFD166'],
            });
            setShowVictoryModal(true);
          }, 500);
        }
      }
    } catch (_) {}
  };

  const handleSummonSquadSupport = () => {
    sound.playShield();
    setBoostsUsed((prev) => prev + 1);
    triggerPenaltyNotice(`Vanguard Cheer Buff summoned (-5 XP, -3 Coins penalty)`);
    const leader = theme.team.members[0];
    setSquadCheerMessage(`${leader.name}: "${leader.quote}" [Buff Active: ${theme.team.squadPerk.name}]`);
    setTimeout(() => setSquadCheerMessage(null), 5000);
  };

  const handleResetCode = () => {
    sound.playClick();
    setCode(level.starterCode);
  };

  const handleCopySolution = () => {
    sound.playClick();
    setSolutionUsed(true);
    triggerPenaltyNotice('Solution reference loaded: -45% score penalty applied');
    setCode(level.solutionSample);
  };

  const revealNextHint = () => {
    sound.playClick();
    if (revealedHints.length < level.hints.length) {
      setRevealedHints([...revealedHints, revealedHints.length]);
      triggerPenaltyNotice('Hint unlocked: -15 XP, -10 Coins deduction');
    }
  };

  const hpPercent = Math.max(0, Math.min(100, Math.round((enemyHp / maxEnemyHp) * 100)));

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumbs & Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-4 sm:p-5 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Background Subtle Theme Glow */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${theme.primaryColor}35, transparent)`,
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMap();
            }}
            className="p-2 rounded-xl bg-[#0B1120] text-gray-400 hover:text-white border border-[#1F2937] hover:border-gray-600 transition-colors"
            title="Return to Universe Map"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor,
                  border: `1px solid ${theme.primaryColor}40`,
                }}
              >
                {universe.name.toUpperCase()} // SECTOR {level.order}
              </span>
              {level.type === 'boss' && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 animate-pulse">
                  👑 CORRUPTION BOSS
                </span>
              )}
            </div>
            <h1 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-white mt-1">
              {level.title}
            </h1>
          </div>
        </div>

        {/* Squad Support & Dynamic Rewards Potential HUD */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Mission Challenge Countdown Timer */}
          <div
            id="mission-countdown-hud"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
              timeLeft <= 20
                ? 'bg-[#FF4D6D]/20 border-[#FF4D6D] text-[#FF4D6D] animate-pulse shadow-[0_0_15px_rgba(255,77,109,0.5)]'
                : timeLeft <= 60
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-black/60 border-[#00E5FF]/30 text-[#00E5FF]'
            }`}
            title={`Mission Timer: ${formatTime(timeLeft)} remaining. If timer runs out, world enters a 2-3 minute disruption.`}
          >
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 20 ? 'animate-spin-slow text-[#FF4D6D]' : ''}`} />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-wider opacity-75 leading-none">
                {timeLeft <= 20 ? 'CRITICAL' : 'MISSION TIMER'}
              </span>
              <span className="font-['Orbitron'] text-xs font-bold tracking-wider leading-tight">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Quick Timer Selector (2m, 2.5m, 3m) */}
            <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-white/10 text-[10px]">
              {[120, 150, 180].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setTimerDuration(sec);
                    setTimeLeft(sec);
                  }}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    timerDuration === sec
                      ? 'bg-[#00E5FF] text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={`Set challenge countdown duration to ${sec / 60} minutes`}
                >
                  {sec / 60}m
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic XP Potential */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              totalCurrentXpPenalty > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-[#00E5FF]/10 border-[#00E5FF]/20 text-[#00E5FF]'
            }`}
            title={totalCurrentXpPenalty > 0 ? `Base: ${level.rewards.xp} XP (Deduction: -${totalCurrentXpPenalty} XP)` : 'Full Score Potential'}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="font-bold">+{potentialXp} XP</span>
            {totalCurrentXpPenalty > 0 && (
              <span className="text-[10px] text-amber-500 font-semibold">(-{totalCurrentXpPenalty})</span>
            )}
          </div>

          {/* Dynamic Coins Potential */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              totalCurrentCoinPenalty > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-[#FFD166]/10 border-[#FFD166]/20 text-[#FFD166]'
            }`}
            title={totalCurrentCoinPenalty > 0 ? `Base: ${level.rewards.coins} Coins (Deduction: -${totalCurrentCoinPenalty} Coins)` : 'Full Coin Potential'}
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="font-bold">+{potentialCoins} Coins</span>
            {totalCurrentCoinPenalty > 0 && (
              <span className="text-[10px] text-amber-500 font-semibold">(-{totalCurrentCoinPenalty})</span>
            )}
          </div>
        </div>
      </div>

      {/* Penalty / Aid Deduction Alert Toast */}
      {penaltyAlert && (
        <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-mono flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>⚠️ {penaltyAlert}</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-bold uppercase">Points Reduced</span>
        </div>
      )}

      {/* 1. ARCADE COMBAT ARENA HUD (Player vs Boss Duel) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B1120]/95 border border-[#1F2937] p-4 sm:p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
        {/* Subtle Universe Atmospheric Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <UniverseBackdrop universeId={universe.id} className="w-full h-full" />
        </div>

        {/* Dynamic Combat Flash Animation */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            combatAnimation === 'hit'
              ? 'bg-red-500/20 animate-pulse'
              : combatAnimation === 'shield'
              ? 'bg-cyan-400/20'
              : ''
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Player Hero Info & Tactical Combat Spells */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#00FFB2] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] flex-shrink-0">
              <div className="w-full h-full bg-[#070B14] rounded-[14px] flex items-center justify-center text-3xl">
                {progress.avatar === 'Binary Knight' ? '🛡️' : progress.avatar === 'Robot Engineer' ? '🤖' : progress.avatar === 'Space Explorer' ? '🚀' : '🧙‍♂️'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] text-xs font-bold text-white tracking-wider">HERO</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF]">
                  LVL {progress.level}
                </span>
                <span className="text-[10px] font-mono text-gray-400">STAGE {level.order}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAction('strike')}
                  className="px-2 py-1 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-[11px] font-mono text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Strike boss (-5 XP)"
                >
                  <Sword className="w-3 h-3 text-[#FFD166]" /> Strike
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('laser')}
                  className="px-2 py-1 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-[11px] font-mono text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Laser blast (-5 XP)"
                >
                  <Zap className="w-3 h-3 text-[#00E5FF]" /> Laser
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('shield')}
                  className="px-2 py-1 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-[11px] font-mono text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Deploy Shield (-5 XP)"
                >
                  <Shield className="w-3 h-3 text-[#00FFB2]" /> Shield
                </button>
                <button
                  type="button"
                  onClick={handleSummonSquadSupport}
                  className="px-2 py-1 rounded-lg bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 text-[11px] font-mono text-[#C084FC] border border-[#7C3AED]/40 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Call Squad Support"
                >
                  <span>{theme.team.insignia} Squad</span>
                </button>
              </div>
            </div>
          </div>

          {/* Combat Feed Center Banner */}
          <div className="flex-1 w-full md:w-auto px-4 py-2.5 rounded-2xl bg-[#070B14]/80 border border-[#1F2937] text-center">
            <div className="text-[10px] font-mono text-gray-400 mb-0.5 flex items-center justify-center gap-2">
              <span className="text-[#00E5FF] font-bold tracking-widest uppercase">BATTLE ARENA</span>
              <span>•</span>
              <span className={timeLeft <= 20 ? 'text-[#FF4D6D] font-bold animate-pulse' : 'text-gray-300'}>
                ⏱️ {formatTime(timeLeft)}
              </span>
            </div>
            <div className="font-mono text-xs text-gray-200 truncate font-medium">
              <span className="text-[#00FFB2] mr-1.5">›</span>{combatMessage}
            </div>
          </div>

          {/* Boss Monster Target */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="font-['Orbitron'] text-xs font-bold text-[#FF4D6D]">{level.enemy.name}</span>
                <span className="text-[10px] font-mono text-gray-400">ATK {level.enemy.attack}</span>
              </div>
              {/* HP Bar */}
              <div className="w-36 sm:w-48 space-y-0.5">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">CORRUPTION HP</span>
                  <span className="text-[#FF4D6D] font-bold">{enemyHp}/{maxEnemyHp}</span>
                </div>
                <div className="w-full h-2.5 bg-[#1E293B] rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#F43F5E] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,77,109,0.5)]"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#F59E0B] p-0.5 shadow-[0_0_15px_rgba(255,77,109,0.4)] flex-shrink-0">
              <div className="w-full h-full bg-[#070B14] rounded-[14px] flex items-center justify-center text-3xl">
                {level.enemy.avatar}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Gameplay Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Concise Quest Objectives & Simple Instructions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-[#0D1527] border border-[#1F2937] p-5 shadow-xl space-y-4">
            {/* Header with optional lore toggle */}
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-['Orbitron'] text-xs font-bold text-white tracking-wide">
                  QUEST OBJECTIVE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowStory(!showStory)}
                className="text-[10px] font-mono text-gray-400 hover:text-[#00E5FF] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3 h-3" />
                {showStory ? 'Hide Lore' : 'Lore'}
              </button>
            </div>

            {/* Optional Collapsed Story */}
            {showStory && (
              <p className="text-xs text-gray-400 bg-[#070B14] p-3 rounded-xl border border-white/5 font-mono">
                {level.story}
              </p>
            )}

            {/* 🎯 1-Sentence Goal */}
            <div className="p-3.5 rounded-2xl bg-[#070B14] border border-[#00E5FF]/20 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider block">
                🎯 GOAL
              </span>
              <p className="text-sm font-semibold text-white leading-snug">
                {explanation.shortGoal}
              </p>
            </div>

            {/* 📋 Simple Short Explanation / Steps */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                📋 WHAT TO WRITE
              </span>
              <div className="space-y-2 font-mono text-xs text-gray-200 bg-[#0B1120] p-3.5 rounded-2xl border border-[#1F2937]">
                {explanation.simpleSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#00FFB2] font-bold">›</span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 📥 Expected Target Output */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#070B14] border border-[#00FFB2]/30 font-mono text-xs">
              <span className="text-gray-400 font-bold">EXPECTED OUTPUT:</span>
              <span className="text-[#00FFB2] font-bold font-mono px-2.5 py-1 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/20">
                {explanation.targetOutput}
              </span>
            </div>

            {/* 💡 Quick Tip */}
            {explanation.quickTip && (
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                <Lightbulb className="w-3.5 h-3.5 text-[#FFD166] flex-shrink-0" />
                <span>Tip: {explanation.quickTip}</span>
              </div>
            )}

            {/* Hint & Solution Quick Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1F2937] text-xs font-mono">
              <button
                type="button"
                onClick={revealNextHint}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-3 h-3" />
                <span>Hint ({revealedHints.length}/{level.hints.length})</span>
              </button>

              <button
                type="button"
                onClick={handleCopySolution}
                className="px-2.5 py-1 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{solutionUsed ? 'Solution Loaded' : 'Show Solution'}</span>
              </button>
            </div>

            {/* Revealed Hints */}
            {revealedHints.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {revealedHints.map((idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs font-mono text-amber-300">
                    💡 {level.hints[idx]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Monaco C++ Code Editor & Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          {/* Editor Container */}
          <div className="rounded-3xl bg-[#111827] border border-[#1F2937] overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.7)] flex flex-col">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0B1120] border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
                <div className="w-3 h-3 rounded-full bg-[#FFD166]" />
                <div className="w-3 h-3 rounded-full bg-[#00FFB2]" />
                <span className="text-xs font-mono text-gray-300 ml-2 font-bold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#00E5FF]" /> solution.cpp (C++17)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="reset-code-btn"
                  onClick={handleResetCode}
                  className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  title="Reset to Starter Code"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>

                <button
                  type="button"
                  id="solve-code-btn"
                  onClick={handleCopySolution}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono text-amber-400 flex items-center gap-1.5 transition-colors"
                  title="Insert Verified Solution Code"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Solve
                </button>

                <button
                  type="button"
                  id="compile-and-run-btn"
                  onClick={handleCompileAndRun}
                  disabled={isCompiling}
                  className="px-5 py-2 rounded-xl font-['Orbitron'] text-xs font-bold text-black bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] hover:opacity-90 transition-all shadow-[0_0_18px_rgba(0,229,255,0.4)] flex items-center gap-2 disabled:opacity-50"
                >
                  {isCompiling ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      STRIKING...
                    </>
                  ) : (
                    <>
                      <Sword className="w-3.5 h-3.5 fill-black" /> COMPILE & STRIKE
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor Surface */}
            <div className="min-h-[380px] sm:min-h-[440px] w-full bg-[#070B14]">
              <Editor
                height="440px"
                defaultLanguage="cpp"
                language="cpp"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Terminal / Compiler Output Tab */}
          <div className="rounded-3xl bg-[#0B1120] border border-[#1F2937] p-5 shadow-[0_0_24px_rgba(0,0,0,0.6)] flex-1 min-h-[220px]">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-['Orbitron'] text-xs font-bold text-white tracking-wider">
                  EXECUTION CONSOLE & DIAGNOSTICS
                </span>
              </div>

              {evalResult && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" /> {evalResult.executionTimeMs}ms
                  </span>
                  {evalResult.success ? (
                    <span className="text-[#00FFB2] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASSED ({evalResult.testsPassed}/{evalResult.totalTests})
                    </span>
                  ) : (
                    <span className="text-[#FF4D6D] flex items-center gap-1 font-bold">
                      <XCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Output Screen */}
            <div className="font-mono text-xs space-y-2">
              {!evalResult && !isCompiling && (
                <p className="text-gray-400 italic py-4 text-center">
                  Press "COMPILE & RUN" to evaluate your C++ code against test suites and unleash logic attack.
                </p>
              )}

              {isCompiling && (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <span className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
                  <span>Invoking C++17 Compiler and running execution binary...</span>
                </div>
              )}

              {evalResult && (
                <div className="space-y-3">
                  {/* Status Banner */}
                  <div
                    className={`p-3 rounded-xl border flex items-center gap-2 ${
                      evalResult.success
                        ? 'bg-[#00FFB2]/10 border-[#00FFB2]/30 text-[#00FFB2]'
                        : 'bg-[#FF4D6D]/10 border-[#FF4D6D]/30 text-[#FF4D6D]'
                    }`}
                  >
                    {evalResult.success ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{evalResult.message}</span>
                  </div>

                  {/* Standard Output */}
                  {evalResult.stdout && (
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                        Program Standard Output (STDOUT):
                      </span>
                      <pre className="p-3 rounded-xl bg-[#070B14] border border-[#1F2937] text-gray-200 whitespace-pre-wrap">
                        {evalResult.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Compiler Warnings / Errors */}
                  {(evalResult.compileError || evalResult.stderr) && (
                    <div>
                      <span className="text-[10px] text-[#FF4D6D] uppercase tracking-wider block mb-1">
                        Compiler Diagnostics / STDERR:
                      </span>
                      <pre className="p-3 rounded-xl bg-[#070B14] border border-[#FF4D6D]/30 text-[#FF4D6D] whitespace-pre-wrap">
                        {evalResult.compileError || evalResult.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VICTORY CELEBRATION MODAL WITH ITEMISED PENALTY BREAKDOWN */}
      {showVictoryModal && victoryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#111827] border-2 border-[#00FFB2] rounded-3xl p-8 shadow-[0_0_60px_rgba(0,255,178,0.4)] text-center space-y-6">
            {/* Victory Badge */}
            <div className="flex justify-center -mt-16">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00FFB2] to-[#00E5FF] p-1 shadow-[0_0_30px_rgba(0,255,178,0.7)] animate-bounce">
                <div className="w-full h-full bg-[#070B14] rounded-2xl flex items-center justify-center text-4xl">
                  🏆
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-[#00FFB2] tracking-widest uppercase">
                MISSION ACCOMPLISHED // SECTOR PURGED
              </span>
              <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-extrabold text-white mt-1">
                VICTORY ACHIEVED!
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
                Your C++ program successfully restored the dimensional sector.
              </p>
            </div>

            {/* Score & Itemized Deduction Breakdown */}
            <div className="bg-[#0B1120] border border-[#1F2937] p-4 rounded-2xl space-y-3 text-left">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-2 text-xs font-mono text-gray-400">
                <span>SCORING AUDIT:</span>
                <span>STATUS: PURGED</span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-300">
                  <span>Base Mission Clear:</span>
                  <span className="text-gray-200 font-bold">+{victoryData.rewards?.baseXp ?? level.rewards.xp} XP / +{victoryData.rewards?.baseCoins ?? level.rewards.coins} Coins</span>
                </div>

                {victoryData.rewards?.penaltyReasons && victoryData.rewards.penaltyReasons.length > 0 && (
                  <div className="pt-1.5 border-t border-[#1F2937]/70 space-y-1">
                    <span className="text-[11px] text-amber-400 font-bold block">Applied Aids Deductions:</span>
                    {victoryData.rewards.penaltyReasons.map((reason, idx) => (
                      <div key={idx} className="flex justify-between text-amber-300/90 text-[11px]">
                        <span>• {reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Net Awarded Rewards */}
              <div className="pt-2 border-t border-[#1F2937] grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                  <span className="text-[10px] text-gray-400 font-mono block">FINAL NET XP</span>
                  <span className="text-xl font-bold text-[#00E5FF] font-['Orbitron']">
                    +{victoryData.rewards?.xp} XP
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/30">
                  <span className="text-[10px] text-gray-400 font-mono block">FINAL NET COINS</span>
                  <span className="text-xl font-bold text-[#FFD166] font-['Orbitron']">
                    +{victoryData.rewards?.coins}
                  </span>
                </div>
              </div>
            </div>

            {/* Leveled Up Notification */}
            {victoryData.leveledUp && (
              <div className="p-3 bg-gradient-to-r from-[#7C3AED]/20 to-[#00E5FF]/20 border border-[#00E5FF]/50 rounded-2xl text-xs font-mono text-white flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD166]" />
                <span className="font-bold font-['Orbitron'] text-[#FFD166]">GUARDIAN RANK LEVEL UP!</span>
              </div>
            )}

            {/* Universe Restored Notification */}
            {victoryData.universeRestored && (
              <div className="p-3 bg-[#00FFB2]/20 border border-[#00FFB2]/50 rounded-2xl text-xs font-mono text-[#00FFB2] flex items-center justify-center gap-2 font-bold">
                <span>🌌 UNIVERSE FULLY PURGED & RESTORED!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowVictoryModal(false);
                  onBackToMap();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] hover:border-gray-500 font-['Orbitron'] text-xs font-bold text-gray-300 hover:text-white transition-all"
              >
                Galaxy Map
              </button>

              {onNextLevel && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowVictoryModal(false);
                    onNextLevel();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] font-['Orbitron'] text-xs font-bold text-black hover:opacity-90 shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all flex items-center gap-2"
                >
                  <span>Next Sector</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORLD DISRUPTED LOCKDOWN OVERLAY (Triggers when timer runs out) */}
      {isDisrupted && disruptedInfo && (
        <WorldDisruptedOverlay
          disruptedWorld={disruptedInfo}
          userCoins={progress.coins}
          onBackToMap={onBackToMap}
          onRetryLevel={handleRetryAfterDisruption}
          onSpendCoinsReboot={handleSpendCoinsReboot}
        />
      )}
    </div>
  );
};
