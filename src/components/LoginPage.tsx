import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { User, PlayerProgress } from '../types';
import { sound } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: (user: User, progress: PlayerProgress) => void;
  onNavigateSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateSignup,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    sound.playClick();

    if (!email || !email.includes('@')) {
      setError('Enter a valid email address');
      sound.playError();
      return;
    }
    if (!password) {
      setError('Invalid email or password');
      sound.playError();
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.user && res.progress) {
        sound.playVictory();
        onLoginSuccess(res.user, res.progress);
      } else {
        setError(res.error || 'Invalid email or password');
        sound.playError();
      }
    } catch (err: any) {
      setError('Connection to C++ engine failed. Check backend status.');
      sound.playError();
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetEmail: string) => {
    sound.playClick();
    setEmail(presetEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Portal Glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-[#00E5FF]/20 via-[#7C3AED]/20 to-[#00FFB2]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glassmorphism Login Panel */}
      <div className="relative w-full max-w-md bg-[#111827]/80 backdrop-blur-2xl border border-[#1F2937] p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.15)]">
        {/* Glowing Top Portal Pill */}
        <div className="flex justify-center -mt-14 mb-6">
          <div className="relative p-1 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] shadow-[0_0_24px_rgba(0,229,255,0.5)]">
            <div className="w-14 h-14 bg-[#070B14] rounded-xl flex items-center justify-center text-[#00E5FF]">
              <Terminal className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold tracking-wider text-white">
            CODE GUARDIAN
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            Access the Parallel C++ CodeVerse
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-medium flex items-center gap-2 animate-shake">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 font-mono mb-1.5">
              GUARDIAN EMAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guardian@codewithuniverse.dev"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 font-mono mb-1.5">
              SECURITY KEY (PASSWORD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-mono"
                required
              />
              <button
                type="button"
                id="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B1120] border-[#1F2937] text-[#00E5FF] focus:ring-0 focus:ring-offset-0"
              />
              <span>Remember Guardian Session</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-['Orbitron'] font-bold text-sm tracking-wider text-[#070B14] bg-gradient-to-r from-[#00E5FF] via-[#00FFB2] to-[#00E5FF] bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:shadow-[0_0_32px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING IN C++ CORE...
              </span>
            ) : (
              <>
                <span>ENTER THE CODEVERSE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Presets */}
        <div className="mt-6 pt-6 border-t border-[#1F2937]">
          <p className="text-[11px] font-mono text-gray-400 mb-2.5 text-center">
            QUICK ENTRANCE DEMO GUARDIANS:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="preset-guardian-btn"
              onClick={() => handlePreset('guardian@codewithuniverse.dev')}
              className="px-2 py-1.5 rounded-lg bg-[#0B1120] hover:bg-[#1E293B] border border-[#1F2937] text-[11px] text-[#00E5FF] font-mono truncate transition-colors"
              title="LVL 3 Code Wizard"
            >
              🧙‍♂️ Guardian
            </button>
            <button
              type="button"
              id="preset-binary-btn"
              onClick={() => handlePreset('binary@codewithuniverse.dev')}
              className="px-2 py-1.5 rounded-lg bg-[#0B1120] hover:bg-[#1E293B] border border-[#1F2937] text-[11px] text-[#7C3AED] font-mono truncate transition-colors"
              title="LVL 7 Binary Knight"
            >
              🛡️ Knight
            </button>
            <button
              type="button"
              id="preset-cyber-btn"
              onClick={() => handlePreset('cyber@codewithuniverse.dev')}
              className="px-2 py-1.5 rounded-lg bg-[#0B1120] hover:bg-[#1E293B] border border-[#1F2937] text-[11px] text-[#00FFB2] font-mono truncate transition-colors"
              title="LVL 12 Cyber Master"
            >
              💻 Master
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Need a new Guardian identity?{' '}
            <button
              type="button"
              id="navigate-signup-btn"
              onClick={() => {
                sound.playClick();
                onNavigateSignup();
              }}
              className="font-semibold text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> REGISTER IDENTITY
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
