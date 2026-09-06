import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  Search,
  Sparkles,
  Zap,
  Coins,
  Shield,
  Filter,
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';

export const LeaderboardView: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'masters' | 'champions'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard().then((res) => {
      if (res.success) {
        setEntries(res.leaderboard);
      }
      setLoading(false);
    });
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchName = entry.username.toLowerCase().includes(search.toLowerCase());
    if (filter === 'masters') return matchName && entry.level >= 10;
    if (filter === 'champions') return matchName && entry.restorationPercentage >= 50;
    return matchName;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD166] to-[#F59E0B] text-black font-['Orbitron'] font-extrabold flex items-center justify-center shadow-[0_0_15px_rgba(255,209,102,0.6)]">
          <Crown className="w-5 h-5 fill-black" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E2E8F0] to-[#94A3B8] text-black font-['Orbitron'] font-extrabold flex items-center justify-center shadow-[0_0_15px_rgba(226,232,240,0.4)]">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D97706] to-[#B45309] text-white font-['Orbitron'] font-extrabold flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.4)]">
          3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-[#0B1120] border border-[#1F2937] text-gray-400 font-['Orbitron'] font-bold flex items-center justify-center text-xs">
        {rank}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD166]/15 border border-[#FFD166]/30 text-[#FFD166] text-xs font-mono font-bold tracking-wider">
          <Trophy className="w-3.5 h-3.5" /> GLOBAL GUARDIAN LEADERBOARD
        </div>
        <h1 className="font-['Orbitron'] text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
          HALL OF SUPREME COMPILERS
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-mono">
          Top Code Guardians ranked by Experience Points, Levels, and Universe Restoration rate.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-end pt-8">
          {/* #2 Silver */}
          <div className="order-2 md:order-1 rounded-3xl bg-gradient-to-b from-[#1E293B] to-[#111827] border border-[#94A3B8]/30 p-6 text-center shadow-[0_0_30px_rgba(148,163,184,0.15)] flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1120] border-2 border-[#94A3B8] p-1 flex items-center justify-center text-3xl mb-3 shadow-[0_0_16px_rgba(148,163,184,0.3)]">
              {entries[1].avatar === 'Binary Knight' ? '🛡️' : entries[1].avatar === 'Robot Engineer' ? '🤖' : entries[1].avatar === 'Space Explorer' ? '🚀' : entries[1].avatar === 'Cyber Programmer' ? '💻' : '🧙‍♂️'}
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#94A3B8]/20 text-[#E2E8F0] font-mono text-[10px] font-bold mb-1">
              RANK #2 GUARDIAN
            </span>
            <h3 className="font-['Orbitron'] text-lg font-bold text-white mb-1">
              {entries[1].username}
            </h3>
            <span className="text-xs text-[#00E5FF] font-mono font-bold mb-3">
              LVL {entries[1].level} • {entries[1].xp} XP
            </span>
            <div className="w-full pt-3 border-t border-[#1F2937] flex justify-around text-xs font-mono text-gray-400">
              <span>{entries[1].restorationPercentage}% Restored</span>
              <span>{entries[1].coins} Coins</span>
            </div>
          </div>

          {/* #1 Gold Supreme */}
          <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-[#78350F]/40 via-[#111827] to-[#111827] border-2 border-[#FFD166] p-8 text-center shadow-[0_0_45px_rgba(255,209,102,0.3)] flex flex-col items-center scale-105">
            <Crown className="w-8 h-8 text-[#FFD166] mb-2 animate-bounce" />
            <div className="w-20 h-20 rounded-2xl bg-[#0B1120] border-2 border-[#FFD166] p-1 flex items-center justify-center text-4xl mb-3 shadow-[0_0_24px_rgba(255,209,102,0.5)]">
              {entries[0].avatar === 'Binary Knight' ? '🛡️' : entries[0].avatar === 'Robot Engineer' ? '🤖' : entries[0].avatar === 'Space Explorer' ? '🚀' : entries[0].avatar === 'Cyber Programmer' ? '💻' : '🧙‍♂️'}
            </div>
            <span className="px-3 py-0.5 rounded-full bg-[#FFD166]/20 text-[#FFD166] font-mono text-xs font-bold mb-1 border border-[#FFD166]/40">
              👑 {entries[0].badge}
            </span>
            <h3 className="font-['Orbitron'] text-xl font-extrabold text-white mb-1">
              {entries[0].username}
            </h3>
            <span className="text-sm text-[#00FFB2] font-mono font-bold mb-4">
              LVL {entries[0].level} • {entries[0].xp.toLocaleString()} XP
            </span>
            <div className="w-full pt-3 border-t border-[#1F2937] flex justify-around text-xs font-mono text-gray-300">
              <span className="text-[#00E5FF]">{entries[0].restorationPercentage}% Restored</span>
              <span className="text-[#FFD166]">{entries[0].coins.toLocaleString()} Coins</span>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="order-3 md:order-3 rounded-3xl bg-gradient-to-b from-[#451A03]/30 to-[#111827] border border-[#D97706]/40 p-6 text-center shadow-[0_0_30px_rgba(217,119,6,0.15)] flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1120] border-2 border-[#D97706] p-1 flex items-center justify-center text-3xl mb-3 shadow-[0_0_16px_rgba(217,119,6,0.3)]">
              {entries[2].avatar === 'Binary Knight' ? '🛡️' : entries[2].avatar === 'Robot Engineer' ? '🤖' : entries[2].avatar === 'Space Explorer' ? '🚀' : entries[2].avatar === 'Cyber Programmer' ? '💻' : '🧙‍♂️'}
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/20 text-[#F59E0B] font-mono text-[10px] font-bold mb-1">
              RANK #3 GUARDIAN
            </span>
            <h3 className="font-['Orbitron'] text-lg font-bold text-white mb-1">
              {entries[2].username}
            </h3>
            <span className="text-xs text-[#00E5FF] font-mono font-bold mb-3">
              LVL {entries[2].level} • {entries[2].xp} XP
            </span>
            <div className="w-full pt-3 border-t border-[#1F2937] flex justify-around text-xs font-mono text-gray-400">
              <span>{entries[2].restorationPercentage}% Restored</span>
              <span>{entries[2].coins} Coins</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Guardian by name..."
            className="w-full pl-10 pr-4 py-2 bg-[#0B1120] border border-[#1F2937] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-gray-400 hover:text-white bg-[#0B1120]'
            }`}
          >
            All Guardians
          </button>
          <button
            onClick={() => setFilter('masters')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filter === 'masters'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-gray-400 hover:text-white bg-[#0B1120]'
            }`}
          >
            Master Tier (LVL 10+)
          </button>
          <button
            onClick={() => setFilter('champions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filter === 'champions'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'text-gray-400 hover:text-white bg-[#0B1120]'
            }`}
          >
            Cosmic Champions (50%+ Restored)
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-[#111827] border border-[#1F2937] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1120] border-b border-[#1F2937] text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Guardian</th>
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6">XP</th>
                <th className="py-4 px-6">Coins</th>
                <th className="py-4 px-6">Universe Restoration</th>
                <th className="py-4 px-6 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937] text-xs">
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.userId}
                  className="hover:bg-[#1A2333] transition-colors"
                >
                  <td className="py-4 px-6 text-center">{getRankBadge(entry.rank)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0B1120] border border-[#1F2937] flex items-center justify-center text-lg">
                        {entry.avatar === 'Binary Knight' ? '🛡️' : entry.avatar === 'Robot Engineer' ? '🤖' : entry.avatar === 'Space Explorer' ? '🚀' : entry.avatar === 'Cyber Programmer' ? '💻' : '🧙‍♂️'}
                      </div>
                      <div>
                        <div className="font-['Orbitron'] font-bold text-white">
                          {entry.username}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {entry.status}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-[#00E5FF]">
                    LVL {entry.level}
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-200">
                    {entry.xp.toLocaleString()} XP
                  </td>
                  <td className="py-4 px-6 font-mono text-[#FFD166]">
                    {entry.coins.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00FFB2] rounded-full"
                          style={{ width: `${entry.restorationPercentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-gray-300 text-[11px]">
                        {entry.restorationPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 text-[10px] font-bold">
                      {entry.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
