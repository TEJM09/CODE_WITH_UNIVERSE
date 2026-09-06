import React, { useState, useEffect } from 'react';
import { GalaxyBackground } from './components/GalaxyBackground';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { UniverseMap } from './components/UniverseMap';
import { GameplayView } from './components/GameplayView';
import { PracticeSandbox } from './components/PracticeSandbox';
import { LeaderboardView } from './components/LeaderboardView';
import { AchievementsView } from './components/AchievementsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { User, PlayerProgress, Universe, Level } from './types';
import { api } from './services/api';
import { sound } from './utils/audio';
import { UserGuideModal } from './components/UserGuideModal';
import { UniverseVisorOverlay } from './components/UniverseVisorOverlay';
import { HyperdriveWarp } from './components/HyperdriveWarp';
import { ambianceManager } from './utils/ambianceManager';
import { SectorAmbianceHUD } from './components/SectorAmbianceHUD';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentUniverse, setCurrentUniverse] = useState<Universe | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Immersion & Guide States
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [isVisorActive, setIsVisorActive] = useState(true);
  const [hyperdriveWarp, setHyperdriveWarp] = useState<{
    isOpen: boolean;
    universeName: string;
    universeOrder: number;
    topic: string;
    targetTab: string;
    targetUniverse: Universe | null;
    targetLevel: Level | null;
  } | null>(null);

  // Initialize session and game universes
  useEffect(() => {
    const initApp = async () => {
      try {
        // Fetch universes
        const uniRes = await api.getUniverses();
        if (uniRes.success) {
          setUniverses(uniRes.universes);
        }

        // Check saved session in localStorage
        const savedUserStr = localStorage.getItem('cw_user');
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            const profRes = await api.getProfile(savedUser.id);
            if (profRes.success && profRes.user && profRes.progress) {
              setUser(profRes.user);
              setProgress(profRes.progress);
            }
          } catch (_) {}
        }
      } catch (err) {
        console.error('Failed to initialize CodeWithUniverse:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    initApp();
  }, []);

  // Global Dynamic Background Ambiance Manager: shifts audio & space-time drone on navigation
  useEffect(() => {
    if (activeTab === 'gameplay' && currentUniverse) {
      ambianceManager.shiftSector(currentUniverse.id, false);
    } else if (activeTab === 'map') {
      ambianceManager.shiftSector('map', false);
    } else if (activeTab === 'practice') {
      ambianceManager.shiftSector('practice', false);
    } else if (activeTab === 'leaderboard') {
      ambianceManager.shiftSector('leaderboard', false);
    } else if (activeTab === 'dashboard') {
      ambianceManager.shiftSector('dashboard', false);
    }
  }, [activeTab, currentUniverse]);

  const handleLoginSuccess = (loggedInUser: User, initialProgress: PlayerProgress) => {
    setUser(loggedInUser);
    setProgress(initialProgress);
    localStorage.setItem('cw_user', JSON.stringify(loggedInUser));
    setActiveTab('dashboard');
  };

  const handleSignupSuccess = (newUser: User, initialProgress: PlayerProgress) => {
    setUser(newUser);
    setProgress(initialProgress);
    localStorage.setItem('cw_user', JSON.stringify(newUser));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    sound.playClick();
    localStorage.removeItem('cw_user');
    setUser(null);
    setProgress(null);
    setCurrentLevel(null);
    setCurrentUniverse(null);
    setAuthMode('login');
    setActiveTab('dashboard');
  };

  const handleSelectUniverse = (universeId: string) => {
    const u = universes.find((uni) => uni.id === universeId);
    if (u && u.levels.length > 0) {
      // Pick first uncompleted level or level 1
      let targetLvl = u.levels[0];
      if (progress) {
        const uncompleted = u.levels.find((l) => !progress.completedLevels.includes(l.id));
        if (uncompleted) targetLvl = uncompleted;
      }
      ambianceManager.triggerWarpSound();
      setHyperdriveWarp({
        isOpen: true,
        universeName: u.name,
        universeOrder: u.order,
        topic: u.topic,
        targetTab: 'gameplay',
        targetUniverse: u,
        targetLevel: targetLvl,
      });
    }
  };

  const handleSelectLevel = (levelId: string, universeId: string) => {
    const u = universes.find((uni) => uni.id === universeId);
    if (u) {
      const l = u.levels.find((lvl) => lvl.id === levelId);
      if (l) {
        ambianceManager.triggerWarpSound();
        setHyperdriveWarp({
          isOpen: true,
          universeName: u.name,
          universeOrder: u.order,
          topic: u.topic,
          targetTab: 'gameplay',
          targetUniverse: u,
          targetLevel: l,
        });
      }
    }
  };

  const handleWarpComplete = () => {
    if (hyperdriveWarp) {
      if (hyperdriveWarp.targetUniverse) {
        setCurrentUniverse(hyperdriveWarp.targetUniverse);
        ambianceManager.shiftSector(hyperdriveWarp.targetUniverse.id, false);
      }
      if (hyperdriveWarp.targetLevel) setCurrentLevel(hyperdriveWarp.targetLevel);
      setActiveTab(hyperdriveWarp.targetTab);
      setHyperdriveWarp(null);
    }
  };

  const handleRefreshProgress = async () => {
    if (!user) return;
    try {
      const res = await api.getProgress(user.id);
      if (res.success && res.progress) {
        setProgress(res.progress);
      }
    } catch (_) {}
  };

  const handleNextLevel = () => {
    if (!currentUniverse || !currentLevel) return;
    const currentIndex = currentUniverse.levels.findIndex((l) => l.id === currentLevel.id);
    if (currentIndex >= 0 && currentIndex < currentUniverse.levels.length - 1) {
      setCurrentLevel(currentUniverse.levels[currentIndex + 1]);
    } else {
      // Find next unlocked universe
      const nextUni = universes.find((u) => u.order === currentUniverse.order + 1);
      if (nextUni && nextUni.levels.length > 0) {
        setCurrentUniverse(nextUni);
        setCurrentLevel(nextUni.levels[0]);
      } else {
        setActiveTab('map');
      }
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-white font-mono space-y-4">
        <GalaxyBackground />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] p-0.5 animate-pulse">
            <div className="w-full h-full bg-[#070B14] rounded-xl flex items-center justify-center font-bold text-lg text-[#00E5FF]">
              C++
            </div>
          </div>
          <span className="text-sm tracking-wider font-['Orbitron'] text-gray-300">
            CONNECTING TO CODEWITHUNIVERSE ENGINE...
          </span>
        </div>
      </div>
    );
  }

  // Unauthenticated View
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] font-sans relative overflow-x-hidden">
        <GalaxyBackground />
        <main className="relative z-10">
          {authMode === 'login' ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateSignup={() => setAuthMode('signup')}
            />
          ) : (
            <SignupPage
              onSignupSuccess={handleSignupSuccess}
              onNavigateLogin={() => setAuthMode('login')}
            />
          )}
        </main>
      </div>
    );
  }

  // Authenticated Guardian HUD & View Flow
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] font-sans relative selection:bg-[#00E5FF] selection:text-black">
      <GalaxyBackground />

      {/* Top Guardian HUD */}
      <Navbar
        user={user}
        progress={progress}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'gameplay') {
            setCurrentLevel(null);
            setCurrentUniverse(null);
          }
        }}
        onLogout={handleLogout}
        onOpenGuide={() => setShowUserGuide(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {activeTab === 'dashboard' && progress && (
          <Dashboard
            user={user}
            progress={progress}
            universes={universes}
            onSelectUniverse={handleSelectUniverse}
            onSelectLevel={handleSelectLevel}
            onNavigate={(tab) => setActiveTab(tab)}
            onRefreshProgress={handleRefreshProgress}
            onOpenGuide={() => setShowUserGuide(true)}
          />
        )}

        {activeTab === 'map' && progress && (
          <UniverseMap
            universes={universes}
            progress={progress}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {activeTab === 'gameplay' && currentLevel && currentUniverse && progress && (
          <GameplayView
            level={currentLevel}
            universe={currentUniverse}
            progress={progress}
            onBackToMap={() => {
              setActiveTab('map');
              setCurrentLevel(null);
              setCurrentUniverse(null);
            }}
            onLevelComplete={(updatedProg) => {
              setProgress(updatedProg);
            }}
            onNextLevel={handleNextLevel}
          />
        )}

        {activeTab === 'practice' && <PracticeSandbox />}

        {activeTab === 'leaderboard' && <LeaderboardView />}

        {activeTab === 'achievements' && <AchievementsView user={user} />}

        {activeTab === 'profile' && progress && (
          <ProfileView
            user={user}
            progress={progress}
            universes={universes}
            onUpdateUser={(updated) => setUser(updated)}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            onResetProgress={(newProg) => setProgress(newProg)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Universe Visor Cockpit Immersion HUD */}
      <UniverseVisorOverlay
        isVisorActive={isVisorActive}
        onToggleVisor={() => setIsVisorActive(!isVisorActive)}
        universeId={currentUniverse?.id || 'world_1'}
        universeName={currentUniverse?.name || 'Earth Prime'}
      />

      {/* Hyperspace Hyperdrive Interdimensional Jump */}
      {hyperdriveWarp && (
        <HyperdriveWarp
          isOpen={hyperdriveWarp.isOpen}
          universeName={hyperdriveWarp.universeName}
          universeOrder={hyperdriveWarp.universeOrder}
          topic={hyperdriveWarp.topic}
          onComplete={handleWarpComplete}
        />
      )}

      {/* Interactive Operator Holo-Codex User Guide */}
      <UserGuideModal
        isOpen={showUserGuide}
        onClose={() => setShowUserGuide(false)}
      />

      {/* Global Background Sector Ambiance Flight Console HUD */}
      {user && (
        <SectorAmbianceHUD onSelectUniverse={handleSelectUniverse} />
      )}

      {/* Atmospheric Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#111827]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 text-[10px] text-slate-400 font-mono uppercase tracking-widest border-t border-cyan-900/40 z-30 shadow-[0_-2px_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse"></span>
            <span>Status: <span className="text-[#00FFB2]">Connected to C++ Backend</span></span>
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="hidden sm:inline">
            Sector Ambiance:{' '}
            <span className="text-[#00E5FF] font-bold">
              {currentUniverse ? currentUniverse.name : 'Galactic Starport Nexus'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowUserGuide(true);
            }}
            className="text-[#00E5FF] hover:text-[#00FFB2] transition-colors cursor-pointer flex items-center gap-1 font-bold"
          >
            <span>[?] OPERATOR MANUAL</span>
          </button>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="hidden sm:inline text-gray-500">Universe Matrix Active</span>
          <span className="text-[#00E5FF] font-bold">v2.4.0-Alpha</span>
        </div>
      </footer>
    </div>
  );
}
