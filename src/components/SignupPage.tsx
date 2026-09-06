import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Shield, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { User, PlayerProgress } from '../types';
import { sound } from '../utils/audio';

interface SignupPageProps {
  onSignupSuccess: (user: User, progress: PlayerProgress) => void;
  onNavigateLogin: () => void;
}

const AVATARS = [
  {
    id: 'Code Wizard',
    name: 'Code Wizard',
    emoji: '🧙‍♂️',
    desc: 'Master of arcane syntax & polymorphic spells',
    color: '#7C3AED',
    glow: 'rgba(124, 58, 237, 0.5)',
  },
  {
    id: 'Binary Knight',
    name: 'Binary Knight',
    emoji: '🛡️',
    desc: 'Defender of encapsulated memory boundaries',
    color: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.5)',
  },
  {
    id: 'Robot Engineer',
    name: 'Robot Engineer',
    emoji: '🤖',
    desc: 'Automates STL pipeline arrays & vector circuits',
    color: '#00FFB2',
    glow: 'rgba(0, 255, 178, 0.5)',
  },
  {
    id: 'Space Explorer',
    name: 'Space Explorer',
    emoji: '🚀',
    desc: 'Navigates quantum dimensions & pointer stars',
    color: '#FFD166',
    glow: 'rgba(255, 209, 102, 0.5)',
  },
  {
    id: 'Cyber Programmer',
    name: 'Cyber Programmer',
    emoji: '💻',
    desc: 'Compiles high-speed multi-threaded algorithms',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.5)',
  },
];

export const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSuccess,
  onNavigateLogin,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('Code Wizard');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    sound.playClick();

    if (!username.trim()) {
      setError('Username cannot be empty');
      sound.playError();
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email address');
      sound.playError();
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      sound.playError();
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      sound.playError();
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        avatar: selectedAvatar,
      });

      if (res.success && res.user && res.progress) {
        sound.playLevelUp();
        onSignupSuccess(res.user, res.progress);
      } else {
        setError(res.error || 'Registration failed');
        sound.playError();
      }
    } catch (err: any) {
      setError('Connection to C++ engine failed. Check backend status.');
      sound.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Portal Glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-[#7C3AED]/20 via-[#00E5FF]/20 to-[#FFD166]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Registration Panel */}
      <div className="relative w-full max-w-2xl bg-[#111827]/85 backdrop-blur-2xl border border-[#1F2937] p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.2)]">
        {/* Back to Login */}
        <button
          type="button"
          id="signup-back-btn"
          onClick={() => {
            sound.playClick();
            onNavigateLogin();
          }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00E5FF] transition-colors mb-4 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO LOGIN
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold tracking-wider text-white">
            FORGE GUARDIAN IDENTITY
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            Initialize your C++ Guardian profile and claim 150 starter coins
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-medium flex items-center gap-2 animate-shake">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Avatar Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 font-mono mb-2">
              SELECT GUARDIAN AVATAR ARCHETYPE
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <div
                    key={av.id}
                    id={`avatar-card-${av.id.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      sound.playClick();
                      setSelectedAvatar(av.id);
                    }}
                    className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                      isSelected
                        ? 'bg-[#1E293B] border-2 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-105'
                        : 'bg-[#0B1120] border border-[#1F2937] hover:border-gray-600 hover:bg-[#111827]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#00E5FF] text-black flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-3xl mb-1.5">{av.emoji}</span>
                    <span className="text-xs font-bold text-white font-['Orbitron']">
                      {av.name}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-tight">
                      {av.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 font-mono mb-1.5">
                CODENAME / USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="signup-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. NeonVanguard"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 font-mono mb-1.5">
                GUARDIAN EMAIL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 font-mono mb-1.5">
                SECURITY PASSWORD (MIN 6 CHARS)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="signup-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 font-mono mb-1.5">
                CONFIRM SECURITY PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="signup-confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="signup-submit-btn"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-['Orbitron'] font-bold text-sm tracking-wider text-[#070B14] bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FFB2] hover:opacity-95 transition-all duration-300 shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:shadow-[0_0_32px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                REGISTERING IN C++ DATA ENGINE...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>CREATE GUARDIAN & INITIALIZE UNIVERSE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Already registered in the CodeVerse?{' '}
            <button
              type="button"
              id="navigate-login-btn"
              onClick={() => {
                sound.playClick();
                onNavigateLogin();
              }}
              className="font-semibold text-[#00E5FF] hover:underline"
            >
              LOG IN NOW
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
