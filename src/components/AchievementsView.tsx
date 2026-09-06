import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Zap,
  Coins,
  Shield,
  Filter,
} from 'lucide-react';
import { Achievement, User } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';

interface AchievementsViewProps {
  user: User;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ user }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements().then((res) => {
      if (res.success) {
        setAchievements(res.achievements);
      }
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Milestone', 'OOP', 'Combat', 'Memory', 'STL', 'Legendary'];

  const filteredAchievements = achievements.filter((ach) => {
    if (activeCategory === 'All') return true;
    return ach.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const unlockedCount = achievements.filter((a) => a.unlockedUsers.includes(user.id)).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FFB2]/15 border border-[#00FFB2]/30 text-[#00FFB2] text-xs font-mono font-bold tracking-wider">
          <Award className="w-3.5 h-3.5" /> GUARDIAN TROPHY GALLERY
        </div>
        <h1 className="font-['Orbitron'] text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
          COSMIC ACHIEVEMENTS
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono">
          Unlocked: <span className="text-[#00FFB2] font-bold">{unlockedCount} / {achievements.length} Badges</span>
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setActiveCategory(cat);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeCategory === cat
                ? 'bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/50 shadow-[0_0_12px_rgba(0,255,178,0.3)]'
                : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1F2937]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.unlockedUsers.includes(user.id);

          return (
            <div
              key={ach.id}
              className={`relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-br from-[#111827] to-[#0B1526] border-[#00FFB2]/50 shadow-[0_0_24px_rgba(0,255,178,0.2)]'
                  : 'bg-[#0B1120]/70 border-[#1F2937]/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{ach.icon}</span>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#00FFB2] bg-[#00FFB2]/10 px-2.5 py-0.5 rounded-full border border-[#00FFB2]/30">
                      <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500 bg-[#070B14] px-2.5 py-0.5 rounded-full border border-[#1F2937]">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {ach.category}
                  </span>
                </div>
                <h3 className="font-['Orbitron'] text-base font-bold text-white mb-1.5">
                  {ach.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Rewards */}
              <div className="pt-4 mt-4 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#00E5FF]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{ach.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#FFD166]">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{ach.coinReward} Coins</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
