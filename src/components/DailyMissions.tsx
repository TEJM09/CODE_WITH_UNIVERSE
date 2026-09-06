import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Zap,
  Coins,
  CheckCircle2,
  Clock,
  RotateCcw,
  Code2,
  Terminal,
  Play,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  X,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { User, PlayerProgress, DailyCodingTask } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';

interface DailyMissionsProps {
  user: User;
  progress: PlayerProgress;
  onRefreshProgress: () => void;
}

export const DailyMissions: React.FC<DailyMissionsProps> = ({
  user,
  progress,
  onRefreshProgress,
}) => {
  const [tasks, setTasks] = useState<DailyCodingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [rerolling, setRerolling] = useState(false);
  const [activeTask, setActiveTask] = useState<DailyCodingTask | null>(null);
  const [code, setCode] = useState('');
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState<{
    success?: boolean;
    stdout?: string;
    stderr?: string;
    compileError?: string;
    message?: string;
    xpAwarded?: number;
    coinsAwarded?: number;
    leveledUp?: boolean;
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Countdown to 00:00 UTC
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch daily tasks
  useEffect(() => {
    loadDailyTasks();
  }, [user.id]);

  const loadDailyTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getDailyTasks(user.id);
      if (res.success && res.tasks) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Failed to load daily tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReroll = async () => {
    sound.playClick();
    setRerolling(true);
    try {
      const res = await api.rerollDailyTasks(user.id);
      if (res.success && res.tasks) {
        setTasks(res.tasks);
        sound.playPortal();
      }
    } catch (err) {
      console.error('Failed to reroll tasks', err);
    } finally {
      setRerolling(false);
    }
  };

  const handleOpenTask = (task: DailyCodingTask) => {
    sound.playClick();
    setActiveTask(task);
    setCode(task.starterCode);
    setOutput(null);
    setShowHints(false);
  };

  const handleExecuteTask = async () => {
    if (!activeTask) return;
    sound.playLaser();
    setExecuting(true);
    setOutput(null);

    try {
      const res = await api.evaluateDailyTask({
        userId: user.id,
        taskId: activeTask.id,
        code,
      });

      setOutput(res);

      if (res.success) {
        sound.playVictory();
        if (res.leveledUp) {
          setTimeout(() => sound.playLevelUp(), 400);
        }
        // Mark current task as completed in local state
        setTasks((prev) =>
          prev.map((t) => (t.id === activeTask.id ? { ...t, completed: true } : t))
        );
        setActiveTask((prev) => (prev ? { ...prev, completed: true } : null));
        onRefreshProgress();
      } else {
        sound.playError();
      }
    } catch (err) {
      sound.playError();
      setOutput({
        success: false,
        message: 'Execution error communicating with C++ compiler backend.',
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleInsertSolution = () => {
    if (!activeTask) return;
    sound.playClick();
    setCode(activeTask.solutionSample);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Scout':
      case 'Easy':
        return 'text-[#00FFB2] border-[#00FFB2]/30 bg-[#00FFB2]/10';
      case 'Vanguard':
      case 'Medium':
        return 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10';
      case 'Elite':
      case 'Hard':
        return 'text-[#FFD166] border-[#FFD166]/30 bg-[#FFD166]/10';
      case 'Legend':
      case 'Expert':
        return 'text-[#FF4D6D] border-[#FF4D6D]/30 bg-[#FF4D6D]/10';
      default:
        return 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    if (diff === 'Scout') return 'Easy';
    if (diff === 'Vanguard') return 'Medium';
    if (diff === 'Elite') return 'Hard';
    if (diff === 'Legend') return 'Expert';
    return diff;
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="rounded-3xl glass-panel border border-[#00E5FF]/20 p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.7)] relative overflow-hidden space-y-6">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-white tracking-wide">
                  DAILY CODING CHALLENGES
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#00FFB2]/15 border border-[#00FFB2]/30 text-[#00FFB2] text-[10px] font-mono font-bold">
                  BONUS REWARDS
                </span>
              </div>
              <p className="text-xs text-gray-300 font-sans mt-0.5">
                Quick daily C++ practice puzzles • Solve each day to earn bonus XP and Coins!
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry, countdown & reroll button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs font-mono text-gray-300 flex items-center gap-2 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-gray-400">New tasks in:</span>
            <span className="text-[#00E5FF] font-bold">{timeLeft || '24h'}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-xs font-mono text-[#00FFB2] font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>{completedCount}/3 Completed</span>
          </div>

          <button
            type="button"
            onClick={handleReroll}
            disabled={rerolling || loading}
            title="Get 3 new random challenges"
            className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] hover:border-[#00E5FF]/40 text-xs font-sans text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#00E5FF] ${rerolling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Get New Tasks</span>
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-[#0B1120] border border-[#1F2937] animate-pulse p-5"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tasks.map((task) => {
            const isDone = task.completed;
            const diffClass = getDifficultyColor(task.difficulty);
            const diffLabel = getDifficultyLabel(task.difficulty);

            return (
              <div
                key={task.id}
                id={`daily-task-${task.id}`}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isDone
                    ? 'bg-[#0B141C]/80 border-[#00FFB2]/40 shadow-[0_0_20px_rgba(0,255,178,0.1)]'
                    : 'bg-[#0B1120]/90 border-[#1F2937] hover:border-[#00E5FF]/50 shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]'
                }`}
              >
                {/* Protocol Top Bar */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold text-[#00E5FF] bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {task.universeName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffClass}`}>
                      {diffLabel}
                    </span>
                  </div>

                  {/* Topic Pill */}
                  <div className="text-[11px] text-gray-300 font-medium mb-2">
                    Topic: <span className="text-[#00FFB2]">{task.topic}</span>
                  </div>

                  <h3 className="font-['Orbitron'] text-base font-bold text-white mb-2 leading-snug">
                    {task.title}
                  </h3>

                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed mb-4">
                    {task.prompt}
                  </p>
                </div>

                {/* Rewards & Action Button */}
                <div className="pt-4 border-t border-[#1F2937] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400 text-[11px]">Reward:</span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#00E5FF]" /> +{task.xpReward} XP
                      </span>
                      <span className="text-[#FFD166] font-bold flex items-center gap-1">
                        <Coins className="w-3 h-3 text-[#FFD166]" /> +{task.coinReward} Coins
                      </span>
                    </div>
                  </div>

                  {isDone ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2] text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>COMPLETED</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`solve-protocol-${task.id}`}
                      onClick={() => handleOpenTask(task)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black font-['Orbitron'] text-xs font-bold hover:brightness-110 shadow-[0_0_16px_rgba(0,229,255,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>SOLVE CHALLENGE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive In-Place C++ Terminal IDE Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0B1120] border border-[#00E5FF]/40 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#070B14] border-b border-[#1F2937] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center font-bold text-xs">
                  C++
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white">
                      {activeTask.title}
                    </h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-black/50 text-[#00E5FF] border border-[#00E5FF]/30">
                      {getDifficultyLabel(activeTask.difficulty)}
                    </span>
                    {activeTask.completed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SOLVED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {activeTask.universeName} • {activeTask.topic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#00E5FF] font-bold">+{activeTask.xpReward} XP</span>
                  <span className="text-[#FFD166] font-bold">+{activeTask.coinReward} Coins</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Directive briefing, optional STDIN & Expected Output */}
              <div className={`grid grid-cols-1 ${activeTask.sampleInput ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                <div className="p-4 rounded-2xl bg-[#070B14] border border-[#1F2937] space-y-2">
                  <span className="text-[11px] font-bold text-[#00E5FF] block uppercase tracking-wide">
                    Task Instructions
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed font-sans">
                    {activeTask.prompt}
                  </p>
                </div>

                {activeTask.sampleInput && (
                  <div className="p-4 rounded-2xl bg-[#070B14] border border-[#1F2937] space-y-2">
                    <span className="text-[11px] font-bold text-[#FFD166] block uppercase tracking-wide">
                      Standard Input (STDIN)
                    </span>
                    <pre className="text-xs font-mono text-[#FFD166] bg-black/60 p-2.5 rounded-xl border border-white/5 overflow-x-auto whitespace-pre-wrap max-h-24">
                      {activeTask.sampleInput}
                    </pre>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#070B14] border border-[#1F2937] space-y-2">
                  <span className="text-[11px] font-bold text-[#00FFB2] block uppercase tracking-wide">
                    Expected Output
                  </span>
                  <pre className="text-xs font-mono text-[#00FFB2] bg-black/60 p-2.5 rounded-xl border border-white/5 overflow-x-auto whitespace-pre-wrap max-h-24">
                    {activeTask.expectedOutput}
                  </pre>
                </div>
              </div>

              {/* Hints Drawer */}
              {activeTask.hints && activeTask.hints.length > 0 && (
                <div className="rounded-2xl bg-[#070B14]/80 border border-[#1F2937] p-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHints ? 'Hide Helpful Hints' : 'Need a hint? (Click to view)'}</span>
                  </button>
                  {showHints && (
                    <ul className="mt-2 pl-4 list-disc space-y-1 text-gray-300 text-xs">
                      {activeTask.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Monaco-Style C++ Code Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 font-medium text-gray-300">
                    <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" /> Your C++ Code Editor
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCode(activeTask.starterCode)}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Reset Code
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleInsertSolution}
                      className="text-xs text-[#FFD166] hover:underline"
                    >
                      Show Solution
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#070B14] border border-[#1F2937] overflow-hidden">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={12}
                    className="w-full bg-transparent p-4 font-mono text-xs text-[#00FFB2] focus:outline-none resize-none leading-relaxed selection:bg-[#00E5FF]/30"
                    placeholder="// Write your C++ code here..."
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Execution Console & Output Terminal */}
              {output && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-fade-in ${
                    output.success
                      ? 'bg-[#00FFB2]/10 border-[#00FFB2]/40 text-[#00FFB2]'
                      : 'bg-[#FF4D6D]/10 border-[#FF4D6D]/40 text-[#FF4D6D]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {output.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      {output.message}
                    </span>
                    {output.success && (
                      <span className="px-2 py-0.5 rounded bg-[#00FFB2]/20 text-[#00FFB2] font-mono text-[11px]">
                        +{output.xpAwarded} XP & +{output.coinsAwarded} Coins Earned!
                      </span>
                    )}
                  </div>

                  {output.compileError && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-300 font-bold uppercase">Compile Error:</span>
                      <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded-xl text-rose-300 overflow-x-auto whitespace-pre-wrap">
                        {output.compileError}
                      </pre>
                    </div>
                  )}

                  {output.stdout && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-300 font-bold uppercase">Your Program Output:</span>
                      <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded-xl text-gray-200 overflow-x-auto whitespace-pre-wrap">
                        {output.stdout}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-[#070B14] border-t border-[#1F2937] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTask(null)}
                className="px-4 py-2 rounded-xl bg-[#1F2937] hover:bg-slate-700 text-gray-300 hover:text-white text-xs transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                id="execute-daily-protocol-btn"
                onClick={handleExecuteTask}
                disabled={executing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#00FFB2] to-[#00E5FF] text-black font-['Orbitron'] text-xs font-bold hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {executing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Running Your Code...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>RUN & CHECK CODE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
