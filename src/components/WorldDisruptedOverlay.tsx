import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  RotateCcw,
  ArrowLeft,
  Zap,
  Coins,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { sound } from '../utils/audio';
import {
  DisruptedWorld,
  getRemainingDisruptionSeconds,
  restoreWorld,
  subscribeToDisruptions,
} from '../utils/disruptionManager';

interface WorldDisruptedOverlayProps {
  disruptedWorld: DisruptedWorld;
  userCoins: number;
  onBackToMap: () => void;
  onRetryLevel: () => void;
  onSpendCoinsReboot: (cost: number) => void;
}

export const WorldDisruptedOverlay: React.FC<WorldDisruptedOverlayProps> = ({
  disruptedWorld,
  userCoins,
  onBackToMap,
  onRetryLevel,
  onSpendCoinsReboot,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(
    getRemainingDisruptionSeconds(disruptedWorld.universeId)
  );
  const [isRestored, setIsRestored] = useState(false);
  const totalSeconds = disruptedWorld.durationSeconds || 150;

  useEffect(() => {
    // Play alert sound when disruption overlay mounts
    sound.playDisruptionAlarm();

    const interval = setInterval(() => {
      const remaining = getRemainingDisruptionSeconds(disruptedWorld.universeId);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        restoreWorld(disruptedWorld.universeId);
        setIsRestored(true);
        sound.playRestored();
      }
    }, 1000);

    const unsubscribe = subscribeToDisruptions(() => {
      const remaining = getRemainingDisruptionSeconds(disruptedWorld.universeId);
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        setIsRestored(true);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [disruptedWorld.universeId]);

  const handleInstantReboot = () => {
    sound.playShield();
    const cost = Math.min(userCoins, 25);
    onSpendCoinsReboot(cost);
    restoreWorld(disruptedWorld.universeId);
    setIsRestored(true);
    sound.playRestored();
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const elapsed = totalSeconds - remainingSeconds;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalSeconds) * 100)));

  return (
    <div
      id="world-disrupted-lockdown-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      {/* Hazard Warning Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF4D6D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-[#0F172A] border-2 border-[#FF4D6D]/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,77,109,0.35)] overflow-hidden">
        {/* Top Warning Ribbon */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#FF4D6D]/30 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/50 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#FF4D6D] uppercase">
                EMERGENCY CONTAINMENT LOCKDOWN
              </div>
              <h2 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-white tracking-wide">
                {isRestored ? 'WORLD RESTABILIZED' : 'WORLD DISRUPTED!'}
              </h2>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#FF4D6D]/20 border border-[#FF4D6D]/40 text-[#FF4D6D] text-xs font-mono font-bold">
            {disruptedWorld.universeName}
          </div>
        </div>

        {/* Status Content */}
        {!isRestored ? (
          <div className="space-y-6">
            {/* Explanatory Message */}
            <div className="bg-[#1E293B]/80 border border-[#334155] p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>CHALLENGE TIMER EXPIRED (2-3 MINUTE STABILIZATION COOLDOWN)</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                The code challenge in <span className="text-white font-semibold">{disruptedWorld.levelTitle}</span> was
                not solved before the mission timer expired. Dimensional instability has disrupted{' '}
                <span className="text-[#00E5FF] font-semibold">{disruptedWorld.universeName}</span>.
                Emergency containment fields are currently stabilizing the sector.
              </p>
            </div>

            {/* Stabilization Live Countdown HUD */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#1E1B4B]/60 to-[#0F172A] border border-[#7C3AED]/40 shadow-inner space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF4D6D] animate-spin-slow" />
                STABILIZATION IN PROGRESS
              </div>

              <div className="font-['Orbitron'] text-4xl sm:text-6xl font-extrabold text-[#FF4D6D] tracking-widest drop-shadow-[0_0_20px_rgba(255,77,109,0.6)]">
                {formattedTime}
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono text-gray-400">
                  <span>Recalibrating Matrix</span>
                  <span className="text-[#00FFB2] font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4D6D] via-[#FFD166] to-[#00FFB2] rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(0,255,178,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Diagnostic Log */}
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-[11px] text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-300 font-bold">
                <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" /> Containment Diagnostics:
              </div>
              <p className="text-gray-400">
                {progressPercent < 25 && '• [Phase 1/4] Quarantining corrupted compiler runtime memory...'}
                {progressPercent >= 25 && progressPercent < 50 && '• [Phase 2/4] Purging syntax feedback loop and cooling core gates...'}
                {progressPercent >= 50 && progressPercent < 75 && '• [Phase 3/4] Recalibrating logic gates and arithmetic buffer...'}
                {progressPercent >= 75 && '• [Phase 4/4] Restoring orbital resonance. Matrix nearly stable...'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                id="disrupted-back-to-map-btn"
                onClick={() => {
                  sound.playClick();
                  onBackToMap();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-gray-200 border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Galaxy Map (Explore other worlds)
              </button>

              <button
                id="disrupted-emergency-reboot-btn"
                onClick={handleInstantReboot}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD166]/20 to-[#00FFB2]/20 hover:from-[#FFD166]/30 hover:to-[#00FFB2]/30 text-white border border-[#00FFB2]/50 font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,178,0.25)] transition-all cursor-pointer"
              >
                <Coins className="w-4 h-4 text-[#FFD166]" />
                Emergency Reboot ({userCoins >= 25 ? '25 Coins' : 'Override Coolant'})
              </button>
            </div>
          </div>
        ) : (
          /* Restored State */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#00FFB2]/20 border border-[#00FFB2] flex items-center justify-center mx-auto text-[#00FFB2] shadow-[0_0_24px_rgba(0,255,178,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-['Orbitron'] text-xl font-bold text-white">
                Dimensional Integrity Restored!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                <span className="text-[#00FFB2] font-semibold">{disruptedWorld.universeName}</span> has completed
                cooling and logic recalibration. You can now retry the mission with a fresh timer!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="disrupted-restored-map-btn"
                onClick={() => {
                  sound.playClick();
                  onBackToMap();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-gray-200 border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Universe Map
              </button>

              <button
                id="disrupted-restored-retry-btn"
                onClick={() => {
                  sound.playVictory();
                  onRetryLevel();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#00FFB2] hover:bg-[#00FFB2]/90 text-black font-['Orbitron'] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,255,178,0.5)] transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Mission (Fresh Timer)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
