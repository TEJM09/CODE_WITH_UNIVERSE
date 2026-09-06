export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface PlayerStats {
  challengesSolved: number;
  bossesDefeated: number;
  accuracyRate: number;
  streakDays: number;
  codeLinesWritten: number;
}

export interface PlayerProgress {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  lives: number;
  maxLives: number;
  currentUniverseId: string;
  completedUniverses: string[];
  unlockedUniverses: string[];
  completedLevels: string[];
  restorationPercentage: number;
  stats: PlayerStats;
  lastActive: string;
}

export interface Enemy {
  name: string;
  type: 'minion' | 'boss' | 'glitch';
  hp: number;
  maxHp: number;
  attack: number;
  element: string;
  avatar: string;
  special?: string;
}

export interface Reward {
  xp: number;
  coins: number;
  item?: string;
}

export interface Level {
  id: string;
  title: string;
  universeId: string;
  order: number;
  type: 'mission' | 'boss';
  story: string;
  prompt: string;
  starterCode: string;
  solutionSample: string;
  expectedOutput: string;
  hints: string[];
  enemy: Enemy;
  rewards: Reward;
}

export interface Universe {
  id: string;
  name: string;
  subtitle: string;
  topic: string;
  order: number;
  color: string;
  accentColor: string;
  icon: string;
  bgImage: string;
  description: string;
  levels: Level[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  restorationPercentage: number;
  badge: string;
  status: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  unlockedUsers: string[];
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
}

export interface DailyCodingTask {
  id: string;
  protocolCode: string;
  title: string;
  universeId: string;
  universeName: string;
  topic: string;
  difficulty: 'Scout' | 'Vanguard' | 'Elite' | 'Legend';
  story: string;
  prompt: string;
  starterCode: string;
  solutionSample: string;
  expectedOutput: string;
  sampleInput?: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  hints: string[];
}

export interface DailyTaskEvaluateResponse {
  success: boolean;
  compilationSuccess: boolean;
  stdout: string;
  stderr: string;
  compileError?: string;
  expectedOutput?: string;
  message: string;
  xpAwarded: number;
  coinsAwarded: number;
  leveledUp: boolean;
  progress?: PlayerProgress;
}

export interface EvaluateResponse {
  success: boolean;
  compilationSuccess: boolean;
  stdout: string;
  stderr: string;
  compileError?: string;
  expectedOutput?: string;
  message: string;
  damageDealt: number;
  bossDefeated?: boolean;
  testsPassed: number;
  totalTests: number;
  executionTimeMs: number;
  rewards?: {
    xp: number;
    coins: number;
    baseXp?: number;
    baseCoins?: number;
    xpPenalty?: number;
    coinPenalty?: number;
    penaltyReasons?: string[];
    item?: string;
  };
  leveledUp?: boolean;
  universeRestored?: boolean;
  unlockedUniverseId?: string | null;
  newAchievements?: string[];
  progress?: PlayerProgress;
  livesRemaining?: number;
}

export interface PracticeResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compileError?: string;
  executionTimeMs: number;
  metrics: {
    linesOfCode: number;
    hasOOP: boolean;
    hasPointers: boolean;
    hasSTL: boolean;
    cppStandard: string;
  };
}
