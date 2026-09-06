import {
  User,
  PlayerProgress,
  Universe,
  LeaderboardEntry,
  Achievement,
  DailyMission,
  DailyCodingTask,
  DailyTaskEvaluateResponse,
  EvaluateResponse,
  PracticeResult,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, password: string):Promise<{ success: boolean; token?: string; user?: User; progress?: PlayerProgress; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(data: { username: string; email: string; password: string; confirmPassword: string; avatar: string }): Promise<{ success: boolean; token?: string; user?: User; progress?: PlayerProgress; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getProfile(userId: string): Promise<{ success: boolean; user?: User; progress?: PlayerProgress; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/profile?userId=${encodeURIComponent(userId)}`);
    return res.json();
  },

  // Game Data
  async getUniverses(): Promise<{ success: boolean; universes: Universe[] }> {
    const res = await fetch(`${API_BASE}/game/universes`);
    return res.json();
  },

  async getProgress(userId: string): Promise<{ success: boolean; progress: PlayerProgress }> {
    const res = await fetch(`${API_BASE}/game/progress?userId=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async evaluateCode(payload: {
    userId: string;
    levelId: string;
    universeId: string;
    code: string;
    enemyHp?: number;
    cluesUsed?: number;
    solutionUsed?: boolean;
    boostsUsed?: number;
  }): Promise<EvaluateResponse> {
    const res = await fetch(`${API_BASE}/game/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async bossAction(payload: {
    currentHp: number;
    maxHp: number;
    action: 'strike' | 'laser' | 'shield';
  }): Promise<{
    success: boolean;
    playerDamage: number;
    remainingHp: number;
    defeated: boolean;
    actionMessage: string;
    bossCounterDamage: number;
    bossMessage: string;
  }> {
    const res = await fetch(`${API_BASE}/game/boss-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Practice Mode Sandbox
  async compilePracticeCode(code: string, stdin = ''): Promise<PracticeResult> {
    const res = await fetch(`${API_BASE}/practice/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin }),
    });
    return res.json();
  },

  // Leaderboard & Achievements
  async getLeaderboard(): Promise<{ success: boolean; leaderboard: LeaderboardEntry[] }> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
  },

  async getAchievements(): Promise<{ success: boolean; achievements: Achievement[] }> {
    const res = await fetch(`${API_BASE}/achievements`);
    return res.json();
  },

  // Daily Missions
  async getDailyMissions(): Promise<{ success: boolean; missions: DailyMission[] }> {
    const res = await fetch(`${API_BASE}/daily-missions`);
    return res.json();
  },

  async claimDailyMission(missionId: string, userId: string): Promise<{ success: boolean; mission: DailyMission; progress?: PlayerProgress }> {
    const res = await fetch(`${API_BASE}/daily-missions/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, userId }),
    });
    return res.json();
  },

  // Daily Randomized C++ Coding Tasks
  async getDailyTasks(userId: string): Promise<{ success: boolean; date: string; tasks: DailyCodingTask[] }> {
    const res = await fetch(`${API_BASE}/game/daily-tasks?userId=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async evaluateDailyTask(payload: { userId: string; taskId: string; code: string }): Promise<DailyTaskEvaluateResponse> {
    const res = await fetch(`${API_BASE}/game/daily-tasks/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async rerollDailyTasks(userId: string): Promise<{ success: boolean; tasks: DailyCodingTask[]; message: string }> {
    const res = await fetch(`${API_BASE}/game/daily-tasks/reroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  // Settings
  async updateSettings(payload: { userId: string; avatar?: string; username?: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/settings/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async resetProgress(userId: string): Promise<{ success: boolean; progress: PlayerProgress }> {
    const res = await fetch(`${API_BASE}/game/reset-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },
};
