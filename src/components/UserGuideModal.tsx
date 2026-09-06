import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Compass,
  Code2,
  Swords,
  Calendar,
  Users,
  Terminal,
  Trophy,
  Volume2,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  HelpCircle,
  Play,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: string;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');

  if (!isOpen) return null;

  const sections: GuideSection[] = [
    {
      id: 'overview',
      title: 'How to Play',
      subtitle: 'Game story, main goals, and how you win',
      icon: Compass,
      accentColor: '#00E5FF',
      badge: 'START',
    },
    {
      id: 'universes',
      title: 'The 8 Worlds & Topics',
      subtitle: 'Step-by-step learning path from Earth to the Core',
      icon: Compass,
      accentColor: '#00FFB2',
    },
    {
      id: 'compiler',
      title: 'Writing & Running C++',
      subtitle: 'How to write code, test it, and fix errors',
      icon: Code2,
      accentColor: '#FFD166',
    },
    {
      id: 'combat',
      title: 'Battles & Challenges',
      subtitle: 'Health points, attacking bosses, and lives',
      icon: Swords,
      accentColor: '#FF4D6D',
      badge: 'BATTLE',
    },
    {
      id: 'daily',
      title: 'Daily Challenges',
      subtitle: 'Earn bonus XP and coins with fresh daily tasks',
      icon: Calendar,
      accentColor: '#00E5FF',
      badge: 'NEW',
    },
    {
      id: 'squads',
      title: 'Teams & Squads',
      subtitle: 'Meet the 8 friendly teams guarding each world',
      icon: Users,
      accentColor: '#7C3AED',
    },
    {
      id: 'practice',
      title: 'Free Practice Mode',
      subtitle: 'Playground to write and test any C++ code freely',
      icon: Terminal,
      accentColor: '#00FFB2',
    },
    {
      id: 'progression',
      title: 'Ranks & Leaderboard',
      subtitle: 'Leveling up, earning coins, and unlocking badges',
      icon: Trophy,
      accentColor: '#FFD166',
    },
    {
      id: 'immersion',
      title: 'Sound & Space Effects',
      subtitle: 'Music, audio effects, and visual space overlay',
      icon: Volume2,
      accentColor: '#00E5FF',
    },
  ];

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const handleTabChange = (id: string) => {
    sound.playClick();
    setActiveSectionId(id);
  };

  const handleNavigate = (tab: string) => {
    sound.playClick();
    onClose();
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#070B14] border border-[#00E5FF]/40 rounded-3xl shadow-[0_0_60px_rgba(0,229,255,0.2)] flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#0B1120] border-b border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#7C3AED]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                  GAME GUIDE
                </span>
                <h2 className="font-['Orbitron'] text-base sm:text-lg font-bold text-white tracking-wide">
                  HOW TO PLAY CODEWITHUNIVERSE
                </h2>
              </div>
              <p className="text-xs text-gray-400">
                Simple step-by-step guide to all features, writing C++ code, and winning levels
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Content: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-72 bg-[#0B1120]/70 border-b md:border-b-0 md:border-r border-[#1F2937] p-3 overflow-y-auto space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase px-3 py-1.5 block tracking-wider">
              Guide Topics
            </span>
            {sections.map((section) => {
              const Icon = section.icon;
              const isCurrent = section.id === activeSectionId;
              return (
                <button
                  key={section.id}
                  onClick={() => handleTabChange(section.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-xs flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)] font-semibold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-[#00E5FF]' : 'text-gray-500'}`} />
                    <span className="truncate">{section.title}</span>
                  </div>
                  {section.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        section.badge === 'NEW'
                          ? 'bg-[#00FFB2]/20 text-[#00FFB2]'
                          : section.badge === 'BATTLE'
                          ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]'
                          : 'bg-[#00E5FF]/20 text-[#00E5FF]'
                      }`}
                    >
                      {section.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Active Section Header */}
            <div className="border-b border-[#1F2937] pb-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#00E5FF] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> TOPIC: {activeSection.title}
                </span>
                <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeSection.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeSection.subtitle}
                </p>
              </div>
            </div>

            {/* SECTION 1: HOW TO PLAY */}
            {activeSectionId === 'overview' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#7C3AED]/10 border border-[#00E5FF]/20 space-y-3">
                  <h4 className="font-['Orbitron'] text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF4D6D]" /> Welcome to the Adventure
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    Welcome to <strong>CodeWithUniverse</strong>! In this game, software bugs and glitches have taken over 8 exciting worlds.
                    Your mission is to explore each world, write real C++ code to fix the issues, and defeat the glitch bosses!
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    You don't need any prior gaming experience—just follow each level's instructions. Each time your code passes the test cases,
                    you deal damage to the boss, level up your character, and unlock the next challenge!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0B1120] border border-[#1F2937] space-y-1">
                    <span className="text-[10px] text-[#00E5FF] uppercase font-bold">Step 1</span>
                    <h5 className="font-['Orbitron'] text-sm font-bold text-white">Choose a Level</h5>
                    <p className="text-[11px] text-gray-400">Read the challenge description, see what output is expected, and inspect the starter code.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B1120] border border-[#1F2937] space-y-1">
                    <span className="text-[10px] text-[#FF4D6D] uppercase font-bold">Step 2</span>
                    <h5 className="font-['Orbitron'] text-sm font-bold text-white">Write & Test Code</h5>
                    <p className="text-[11px] text-gray-400">Type your solution in the editor and click 'Execute Code' to run real tests.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B1120] border border-[#00FFB2] space-y-1">
                    <span className="text-[10px] text-[#00FFB2] uppercase font-bold">Step 3</span>
                    <h5 className="font-['Orbitron'] text-sm font-bold text-white">Win & Level Up</h5>
                    <p className="text-[11px] text-gray-400">Passing tests defeats the enemy! You receive bonus XP points, coins, and badges.</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleNavigate('map')}
                    className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-['Orbitron'] text-xs font-bold hover:bg-[#00FFB2] transition-all flex items-center gap-1.5"
                  >
                    <span>EXPLORE WORLDS</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: 8 WORLDS */}
            {activeSectionId === 'universes' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  The game has 8 unique worlds designed as a complete, step-by-step C++ learning course:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#00E5FF]/30">
                    <div className="flex items-center justify-between text-[#00E5FF] font-bold">
                      <span>World 1: Earth Prime</span>
                      <span>Basics & Loops</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Variables, numbers, input & output (cin/cout), if/else decisions, and loops.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#FF4D6D]/30">
                    <div className="flex items-center justify-between text-[#FF4D6D] font-bold">
                      <span>World 2: Function Nexus</span>
                      <span>Functions</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Writing your own functions, passing parameters, returning values, and simple recursion.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#FFD166]/30">
                    <div className="flex items-center justify-between text-[#FFD166] font-bold">
                      <span>World 3: Object Realm</span>
                      <span>Classes & Objects</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Creating objects, understanding public vs private data, and writing constructors.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#00FFB2]/30">
                    <div className="flex items-center justify-between text-[#00FFB2] font-bold">
                      <span>World 4: Inheritance Kingdom</span>
                      <span>Inheritance</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Reusing code with parent and child classes, and inheriting helpful methods.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#7C3AED]/30">
                    <div className="flex items-center justify-between text-[#7C3AED] font-bold">
                      <span>World 5: Polymorphism City</span>
                      <span>Polymorphism</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Virtual functions and writing flexible code where different objects respond differently.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#00E5FF]/30">
                    <div className="flex items-center justify-between text-[#00E5FF] font-bold">
                      <span>World 6: Memory Dimension</span>
                      <span>Pointers & Memory</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">How computers store data in memory, using memory addresses (&) and pointers (*).</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#00FFB2]/30">
                    <div className="flex items-center justify-between text-[#00FFB2] font-bold">
                      <span>World 7: STL Galaxy</span>
                      <span>Standard Library</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Using built-in C++ lists (std::vector), key-value dictionaries (std::map), and sorting.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#FF4D6D]/30">
                    <div className="flex items-center justify-between text-[#FF4D6D] font-bold">
                      <span>World 8: Core Compiler</span>
                      <span>Master Challenges</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Templates, fast execution, and the final grand boss challenge!</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs text-gray-300 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#00E5FF] flex-shrink-0" />
                  <span>
                    <strong>How to Unlock:</strong> Complete all levels and defeat the boss in each world to unlock the next world!
                  </span>
                </div>
              </div>
            )}

            {/* SECTION 3: WRITING & RUNNING C++ */}
            {activeSectionId === 'compiler' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed">
                  The in-game code editor compiles and runs real C++ code in seconds. When you click <strong>EXECUTE CODE</strong>,
                  your solution is tested against multiple test inputs.
                </p>

                <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#1F2937] space-y-3 text-xs">
                  <span className="text-[#00E5FF] font-bold block">// Example C++ Program</span>
                  <pre className="text-gray-300 bg-black/60 p-3 rounded-xl overflow-x-auto text-[11px] font-mono">
{`#include <iostream>

int main() {
    // Read input number
    int number;
    if (std::cin >> number) {
        std::cout << (number * 2) << std::endl;
    } else {
        std::cout << "Hello Universe!" << std::endl;
    }
    return 0;
}`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#00FFB2]/20 space-y-1">
                    <span className="text-[#00FFB2] font-bold">Green = Test Passed</span>
                    <p className="text-gray-400 text-[11px]">
                      When your code prints the expected answer, the test case turns green and inflicts damage to the enemy.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#FF4D6D]/20 space-y-1">
                    <span className="text-[#FF4D6D] font-bold">Red = Error Message</span>
                    <p className="text-gray-400 text-[11px]">
                      If there is a typo (like a missing semicolon), the compiler shows the exact line number so you can quickly fix it.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs text-gray-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FFD166]" />
                  <span><strong>Helpful Tip:</strong> Click the <strong>"REVEAL CLUES"</strong> button on any level if you need a hint!</span>
                </div>
              </div>
            )}

            {/* SECTION 4: BOSS BATTLES */}
            {activeSectionId === 'combat' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  Every level features an enemy with a Health Bar (HP). Solving the coding challenge attacks the boss!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#FF4D6D]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#FF4D6D] font-['Orbitron'] text-xs font-bold">
                      <Swords className="w-4 h-4" /> CODE STRIKE
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Standard attack. Each passed test case deals direct damage to the boss's health bar.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#00E5FF]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#00E5FF] font-['Orbitron'] text-xs font-bold">
                      <Zap className="w-4 h-4" /> LASER BLAST
                    </div>
                    <p className="text-[11px] text-gray-400">
                      High power attack used in boss battles to deliver critical damage.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#00FFB2]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#00FFB2] font-['Orbitron'] text-xs font-bold">
                      <Shield className="w-4 h-4" /> SHIELD DEFENSE
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Protects your player lives and reduces damage if code fails test cases.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-xs text-gray-200 space-y-2">
                  <span className="font-bold text-[#FF4D6D] uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4" /> Boss Enrage
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    When a boss's HP falls below 50%, they glow with a red aura! Solve the remaining test cases with clean code to deliver the winning blow!
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 5: DAILY CHALLENGES */}
            {activeSectionId === 'daily' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  Every day, you receive 3 fresh C++ challenges directly on your Dashboard:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#00E5FF]/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[#00E5FF] font-bold">1. Varied Challenges</span>
                      <p className="text-gray-400 text-[11px]">Includes easy, medium, and fun tasks across all C++ topics.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#00E5FF]/15 text-[#00E5FF] font-bold">+350-500 XP</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#00FFB2]/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[#00FFB2] font-bold">2. Instant Code Editor</span>
                      <p className="text-gray-400 text-[11px]">Click 'Solve Challenge' to open the built-in editor and test your code immediately.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#00FFB2]/15 text-[#00FFB2] font-bold">INSTANT TEST</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#FFD166]/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[#FFD166] font-bold">3. Get New Challenges</span>
                      <p className="text-gray-400 text-[11px]">Finished your challenges? Click 'New Challenges' anytime to get 3 brand-new tasks!</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#FFD166]/15 text-[#FFD166] font-bold">UNLIMITED</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-['Orbitron'] text-xs font-bold hover:bg-[#00FFB2] transition-all flex items-center gap-1.5"
                  >
                    <span>GO TO DAILY CHALLENGES</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 6: SQUADS */}
            {activeSectionId === 'squads' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  Each world has its own friendly team with unique colors and emblems to cheer you on:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[#00E5FF] font-bold">🛡️ Cyber Guardians (World 1)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Defenders of clean syntax and variables on Earth Prime.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[#FF4D6D] font-bold">⚡ Stack Overlords (World 2)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Specialists in function calls and recursion.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[#FFD166] font-bold">🏛️ Matrix Architects (World 3)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Builders of classes and objects.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[#00FFB2] font-bold">🌿 Spore Sentinels (World 4)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Guardians of parent and child class inheritance.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[#7C3AED] font-bold">💎 Prismatic Legion (World 5)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Masters of polymorphism and virtual methods.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#00E5FF]/40">
                    <span className="text-[#00E5FF] font-bold">👻 Hex Phantoms (World 6)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Navigators of pointers and memory addresses.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#00FFB2]/40">
                    <span className="text-[#00FFB2] font-bold">🌌 Vector Collective (World 7)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Experts in standard lists and algorithms.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#FF4D6D]/40">
                    <span className="text-[#FF4D6D] font-bold">🔥 Magma Engineers (World 8)</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Grand masters of high-speed C++ code.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 7: PRACTICE */}
            {activeSectionId === 'practice' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Want to experiment freely without enemies or time limits? The <strong>Free Practice Playground</strong> lets you
                  write, compile, and run any C++ code you like:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[10px] text-gray-400 block">Line Counter</span>
                    <span className="text-sm font-bold text-[#00E5FF]">Automatic</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[10px] text-gray-400 block">Classes</span>
                    <span className="text-sm font-bold text-[#00FFB2]">Supported</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[10px] text-gray-400 block">Pointers</span>
                    <span className="text-sm font-bold text-[#FFD166]">Supported</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1F2937]">
                    <span className="text-[10px] text-gray-400 block">Standard Library</span>
                    <span className="text-sm font-bold text-[#7C3AED]">Full C++17</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleNavigate('practice')}
                    className="px-4 py-2 rounded-xl bg-[#00FFB2] text-black font-['Orbitron'] text-xs font-bold hover:bg-[#00E5FF] transition-all flex items-center gap-1.5"
                  >
                    <span>OPEN PRACTICE PLAYGROUND</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 8: PROGRESSION & LEADERBOARDS */}
            {activeSectionId === 'progression' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  Every challenge you solve earns you Experience Points (XP) and Coins:
                </p>

                <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#1F2937] space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                    <span className="text-gray-400">Player Level</span>
                    <span className="text-[#00E5FF] font-bold">Increases as your XP bar fills up</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                    <span className="text-gray-400">Coins</span>
                    <span className="text-[#FFD166] font-bold">Earned from winning levels; unlocks avatars & profile badges</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">World Progress</span>
                    <span className="text-[#00FFB2] font-bold">Reaches 100% when you complete all 8 worlds</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate('achievements')}
                    className="px-4 py-2 rounded-xl bg-[#1F2937] text-gray-200 text-xs hover:text-white transition-colors"
                  >
                    View Badges
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('leaderboard')}
                    className="px-4 py-2 rounded-xl bg-[#FFD166] text-black font-['Orbitron'] text-xs font-bold hover:bg-yellow-300 transition-all flex items-center gap-1.5"
                  >
                    <span>VIEW LEADERBOARD</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 9: AUDIO & SPACE EFFECTS */}
            {activeSectionId === 'immersion' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-300">
                  CodeWithUniverse includes sci-fi music and atmospheric visual effects:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#00E5FF]/30 space-y-2">
                    <span className="text-[#00E5FF] font-bold block flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4" /> Background Music
                    </span>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Custom background music to help you focus while coding. Toggle playback or mute easily from the top bar.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#00FFB2]/30 space-y-2">
                    <span className="text-[#00FFB2] font-bold block flex items-center gap-1.5">
                      <Compass className="w-4 h-4" /> Space Effects
                    </span>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Floating stars, space dust, and futuristic corners make coding feel like you're in a spaceship cockpit.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-gray-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                  <span>Headphones are recommended for the best sound effects experience!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0B1120] border-t border-[#1F2937] flex items-center justify-between text-xs text-gray-400">
          <span>Need help anytime? Click the Guide button in the top navigation bar.</span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[#1F2937] hover:bg-slate-700 text-gray-200 hover:text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
