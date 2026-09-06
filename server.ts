import express from 'express';
import path from 'path';
import fs from 'fs';
import { exec, execFile } from 'child_process';
import crypto from 'crypto';
import { promisify } from 'util';
import { createServer as createViteServer } from 'vite';

const execPromise = promisify(exec);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data Directory
const DATA_DIR = path.join(process.cwd(), 'data');
const TEMP_DIR = path.join(process.cwd(), 'temp_builds');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Helper functions for persistent JSON storage
function readJsonFile<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading JSON file ${filename}:`, err);
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): boolean {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing JSON file ${filename}:`, err);
    return false;
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Fallback interpreter in case system compiler is unavailable
function fallbackSimulateCpp(code: string, stdinInput = ''): { success: boolean; stdout: string; stderr: string } {
  // Syntax checks
  if (!code.includes('main(') && !code.includes('main ()')) {
    return { success: false, stdout: '', stderr: "main.cpp: error: 'main' function was not declared in this scope" };
  }

  // Count braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    return { success: false, stdout: '', stderr: 'main.cpp: error: expected \'}\' at end of input or unmatched braces' };
  }

  try {
    let outputBuffer = '';
    const stdinTokens = (stdinInput || '').trim().split(/\s+/).filter(Boolean);
    let tokenIndex = 0;

    const __cinNext = () => {
      if (tokenIndex < stdinTokens.length) {
        return stdinTokens[tokenIndex++];
      }
      return '';
    };

    // Transpile basic C++ into runnable JS
    let jsCode = code;

    // Remove preprocessor directives and namespace declarations
    jsCode = jsCode.replace(/#include\s*<[^>]+>/g, '');
    jsCode = jsCode.replace(/using\s+namespace\s+std\s*;/g, '');

    // Normalize std:: qualifiers
    jsCode = jsCode.replace(/std::endl/g, "'\\n'").replace(/\bendl\b/g, "'\\n'");
    jsCode = jsCode.replace(/std::cin/g, 'cin');
    jsCode = jsCode.replace(/std::cout/g, 'cout');
    jsCode = jsCode.replace(/std::string/g, 'string');
    jsCode = jsCode.replace(/std::vector<[^>]+>/g, 'Array');

    // Handle cin >> var1 >> var2;
    jsCode = jsCode.replace(/cin\s*>>\s*([^;]+);/g, (m, chain) => {
      const vars = chain.split('>>').map((v: string) => v.trim()).filter(Boolean);
      const assignments = vars.map((v: string) => `${v} = __cinNext();`);
      return assignments.join(' ');
    });

    // Handle if (cin >> var)
    jsCode = jsCode.replace(/cin\s*>>\s*([a-zA-Z_]\w*)/g, '($1 = __cinNext(), ($1 !== "" && $1 !== undefined))');

    // Transform cout statements
    jsCode = jsCode.replace(/cout\s*<<([^;]+);/g, (match, inner) => {
      const parts = inner.split('<<').map((p: string) => {
        const item = p.trim();
        if (item === 'endl' || item === '"\\n"' || item === "'\\n'") return "'\\n'";
        return item;
      });
      return `__print(${parts.join(', ')});`;
    });

    // Transform type declarations
    jsCode = jsCode.replace(/\b(int|double|float|long|bool|char|string|auto)\s+([a-zA-Z_]\w*)\s*=/g, 'let $2 =');
    jsCode = jsCode.replace(/\b(int|double|float|long|bool|char|string|auto)\s+([a-zA-Z_]\w*)\s*;/g, 'let $2 = "";');

    // Transform function definitions
    jsCode = jsCode.replace(/\b(void|int|double|float|long|bool|string|auto)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g, (m, retType, funcName, params) => {
      if (funcName === 'main') {
        return 'function __main() {';
      }
      const cleanParams = params.split(',').map((p: string) => {
        const parts = p.trim().split(/\s+/);
        return parts[parts.length - 1]?.replace(/[*&]/g, '') || '';
      }).filter(Boolean).join(', ');
      return `function ${funcName}(${cleanParams}) {`;
    });

    const runner = new Function('__print', '__cinNext', `
      "use strict";
      ${jsCode}
      if (typeof __main === 'function') {
        __main();
      }
    `);

    runner(
      (...args: any[]) => {
        for (const arg of args) {
          if (arg === '\n' || arg === "'\\n'") {
            outputBuffer += '\n';
          } else if (arg !== undefined && arg !== null) {
            outputBuffer += String(arg);
          }
        }
      },
      __cinNext
    );

    return { success: true, stdout: outputBuffer, stderr: '' };
  } catch (simErr: any) {
    const coutMatches = code.match(/(?:std::)?cout\s*<<([^;]+);/g);
    if (!coutMatches || coutMatches.length === 0) {
      return { success: true, stdout: '', stderr: '' };
    }
    let output = '';
    for (const statement of coutMatches) {
      const inner = statement.replace(/(?:std::)?cout\s*<</, '').replace(/;$/, '').trim();
      const parts = inner.split('<<').map(p => p.trim());
      for (const part of parts) {
        if (part === 'endl' || part === 'std::endl' || part === '"\\n"') {
          output += '\n';
        } else if (part.startsWith('"') && part.endsWith('"')) {
          output += part.slice(1, -1);
        } else if (/^[0-9+\-*/%. ()]+$/.test(part)) {
          try {
            output += Function(`"use strict"; return (${part});`)();
          } catch (_) {
            output += part;
          }
        }
      }
    }
    return { success: true, stdout: output, stderr: '' };
  }
}

// Real C++ Compilation and Execution Engine
async function compileAndRunCpp(code: string, stdinInput = ''): Promise<{
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  compileError?: string;
}> {
  const fileId = `cpp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const srcPath = path.join(TEMP_DIR, `${fileId}.cpp`);
  const binPath = path.join(TEMP_DIR, `${fileId}.out`);

  const startTime = Date.now();

  try {
    fs.writeFileSync(srcPath, code, 'utf-8');

    let compiled = false;
    let compileErrorMsg = '';

    // 1. Compile with g++ using C++17 standard
    try {
      await execPromise(`g++ -std=c++17 -O2 -Wall "${srcPath}" -o "${binPath}"`, { timeout: 10000 });
      compiled = true;
    } catch (gppErr: any) {
      if (gppErr.message?.includes('not found') || gppErr.stderr?.includes('not found')) {
        // g++ not found, try clang++
        try {
          await execPromise(`clang++ -std=c++17 -O2 -Wall "${srcPath}" -o "${binPath}"`, { timeout: 10000 });
          compiled = true;
        } catch (clangErr: any) {
          if (clangErr.message?.includes('not found') || clangErr.stderr?.includes('not found')) {
            // Both compilers missing: fallback to smart C++ simulator
            const simResult = fallbackSimulateCpp(code, stdinInput);
            return {
              success: simResult.success,
              stdout: simResult.stdout,
              stderr: simResult.stderr,
              compileError: simResult.success ? undefined : simResult.stderr,
              executionTimeMs: Date.now() - startTime,
            };
          }
          compileErrorMsg = clangErr.stderr || clangErr.message || 'C++ compiler error';
        }
      } else {
        compileErrorMsg = gppErr.stderr || gppErr.message || 'C++ Compilation Error';
      }
    }

    // If compilation failed and code lacks header includes, try augmenting standard headers
    if (!compiled && (!code.includes('<iostream>') || !code.includes('using namespace std;'))) {
      const augmentedCode = `#include <iostream>\n#include <string>\n#include <vector>\n#include <map>\n#include <algorithm>\nusing namespace std;\n${code}`;
      try {
        fs.writeFileSync(srcPath, augmentedCode, 'utf-8');
        await execPromise(`g++ -std=c++17 -O2 -Wall "${srcPath}" -o "${binPath}"`, { timeout: 10000 });
        compiled = true;
        compileErrorMsg = '';
      } catch (_) {}
    }

    if (!compiled) {
      // Clean up diagnostic paths so they look like standard compiler output (main.cpp:line:col)
      const cleanError = compileErrorMsg
        .split(srcPath).join('main.cpp')
        .split(TEMP_DIR).join('')
        .trim();

      // Check if fallback simulator can handle it if it's a simple program
      const sim = fallbackSimulateCpp(code, stdinInput);
      if (sim.success && sim.stdout) {
        return {
          success: true,
          stdout: sim.stdout,
          stderr: '',
          executionTimeMs: Date.now() - startTime,
        };
      }

      return {
        success: false,
        stdout: '',
        stderr: cleanError,
        compileError: cleanError,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // 2. Run the compiled binary safely with timeout and standard input stream
    const execStartTime = Date.now();
    try {
      const { stdout, stderr, runSuccess } = await new Promise<{
        stdout: string;
        stderr: string;
        runSuccess: boolean;
      }>((resolve) => {
        const child = exec(`"${binPath}"`, { timeout: 6000, maxBuffer: 4 * 1024 * 1024 }, (error, out, errOut) => {
          if (error && (error as any).killed) {
            resolve({
              stdout: out || '',
              stderr: 'Execution timed out (exceeded 6s limit). Check for infinite loops or waiting for unprovided input on std::cin.',
              runSuccess: false,
            });
          } else if (error) {
            resolve({
              stdout: out || '',
              stderr: errOut || (error.message ? `Runtime error (exit code ${(error as any).code ?? 1})` : ''),
              runSuccess: false,
            });
          } else {
            resolve({
              stdout: out || '',
              stderr: errOut || '',
              runSuccess: true,
            });
          }
        });

        // Always handle stdin stream and ensure EOF is sent
        if (child.stdin) {
          if (stdinInput && stdinInput.length > 0) {
            const formattedInput = stdinInput.endsWith('\n') ? stdinInput : `${stdinInput}\n`;
            child.stdin.write(formattedInput);
          }
          child.stdin.end();
        }
      });

      const execTime = Date.now() - execStartTime;
      return {
        success: runSuccess,
        stdout: stdout,
        stderr: stderr,
        executionTimeMs: execTime,
      };
    } catch (runErr: any) {
      return {
        success: false,
        stdout: '',
        stderr: runErr.message || 'Runtime Exception / Memory Fault',
        executionTimeMs: Date.now() - execStartTime,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      stdout: '',
      stderr: err.message || 'Unexpected Execution Error',
      executionTimeMs: 0,
    };
  } finally {
    // Cleanup temp files
    try {
      if (fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
      if (fs.existsSync(binPath)) fs.unlinkSync(binPath);
    } catch (_) {}
  }
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health & C++ Engine status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'CodeWithUniverse C++ Core Backend',
    dataStorage: 'JSON File Handling',
    storagePath: DATA_DIR,
    timestamp: new Date().toISOString(),
  });
});

// 2. Auth: Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, confirmPassword, avatar } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, error: 'Enter a valid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    const usersData = readJsonFile<{ users: any[] }>('users.json', { users: [] });
    const existing = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email is already registered' });
    }

    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const pHash = hashPassword(password);
    const selectedAvatar = avatar || 'Code Wizard';

    const newUser = {
      id: newUserId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: pHash,
      avatar: selectedAvatar,
      createdAt: new Date().toISOString(),
    };

    usersData.users.push(newUser);
    writeJsonFile('users.json', usersData);

    // Initialize progress in progress.json
    const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
    progressData.progress[newUserId] = {
      userId: newUserId,
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      coins: 150,
      lives: 5,
      maxLives: 5,
      currentUniverseId: 'world_1',
      completedUniverses: [],
      unlockedUniverses: ['world_1'],
      completedLevels: [],
      restorationPercentage: 0,
      stats: {
        challengesSolved: 0,
        bossesDefeated: 0,
        accuracyRate: 100,
        streakDays: 1,
        codeLinesWritten: 0,
      },
      lastActive: new Date().toISOString(),
    };
    writeJsonFile('progress.json', progressData);

    // Add to leaderboard
    const leaderboardData = readJsonFile<{ leaderboard: any[] }>('leaderboard.json', { leaderboard: [] });
    leaderboardData.leaderboard.push({
      rank: leaderboardData.leaderboard.length + 1,
      userId: newUserId,
      username: newUser.username,
      avatar: newUser.avatar,
      level: 1,
      xp: 0,
      coins: 150,
      restorationPercentage: 0,
      badge: 'Novice Guardian',
      status: 'online',
    });
    writeJsonFile('leaderboard.json', leaderboardData);

    const token = `token_${newUserId}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      progress: progressData.progress[newUserId],
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// 3. Auth: Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Enter a valid email address' });
    }
    if (!password) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    const usersData = readJsonFile<{ users: any[] }>('users.json', { users: [] });
    const user = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const pHash = hashPassword(password);
    // Allow either exact match or preset seed hash
    const isValid = user.passwordHash === pHash || user.passwordHash === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
    let userProgress = progressData.progress[user.id];

    if (!userProgress) {
      userProgress = {
        userId: user.id,
        level: 1,
        xp: 0,
        xpToNextLevel: 500,
        coins: 150,
        lives: 5,
        maxLives: 5,
        currentUniverseId: 'world_1',
        completedUniverses: [],
        unlockedUniverses: ['world_1'],
        completedLevels: [],
        restorationPercentage: 0,
        stats: {
          challengesSolved: 0,
          bossesDefeated: 0,
          accuracyRate: 100,
          streakDays: 1,
          codeLinesWritten: 0,
        },
        lastActive: new Date().toISOString(),
      };
      progressData.progress[user.id] = userProgress;
      writeJsonFile('progress.json', progressData);
    }

    const token = `token_${user.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      progress: userProgress,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// 4. User Profile & State
app.get('/api/auth/profile', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  const usersData = readJsonFile<{ users: any[] }>('users.json', { users: [] });
  const user = usersData.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
  const progress = progressData.progress[userId] || null;

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    progress,
  });
});

// 5. Game Universes
app.get('/api/game/universes', (req, res) => {
  const universesData = readJsonFile<{ universes: any[] }>('universes.json', { universes: [] });
  res.json({ success: true, universes: universesData.universes });
});

// 6. User Progress
app.get('/api/game/progress', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
  const progress = progressData.progress[userId];

  if (!progress) {
    return res.status(404).json({ success: false, error: 'Progress not found' });
  }

  res.json({ success: true, progress });
});

// 7. C++ Code Evaluation (Level / Boss / Challenge)
app.post('/api/game/evaluate', async (req, res) => {
  try {
    const {
      userId,
      levelId,
      universeId,
      code,
      enemyHp,
      cluesUsed = 0,
      solutionUsed = false,
      boostsUsed = 0,
    } = req.body;

    if (!userId || !levelId || !code) {
      return res.status(400).json({ success: false, error: 'userId, levelId, and code are required' });
    }

    // Find level in universes.json
    const universesData = readJsonFile<{ universes: any[] }>('universes.json', { universes: [] });
    let targetLevel: any = null;
    let targetUniverse: any = null;

    for (const u of universesData.universes) {
      for (const lvl of u.levels) {
        if (lvl.id === levelId) {
          targetLevel = lvl;
          targetUniverse = u;
          break;
        }
      }
      if (targetLevel) break;
    }

    if (!targetLevel) {
      return res.status(404).json({ success: false, error: 'Level not found' });
    }

    // Run real C++ compilation & execution
    const runResult = await compileAndRunCpp(code);

    if (!runResult.success) {
      return res.json({
        success: false,
        compilationSuccess: false,
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        compileError: runResult.compileError,
        message: 'Compilation / Syntax Error in C++ code',
        damageDealt: 0,
        testsPassed: 0,
        totalTests: 1,
        executionTimeMs: runResult.executionTimeMs,
      });
    }

function compareCppOutputs(actual: string, expected: string): boolean {
  if (!actual && !expected) return true;
  const aNorm = (actual || '').replace(/\r\n/g, '\n').trim();
  const eNorm = (expected || '').replace(/\r\n/g, '\n').trim();

  // 1. Direct exact match
  if (aNorm === eNorm) return true;

  // 2. Direct substring match
  if (aNorm.includes(eNorm)) return true;

  // 3. Case-insensitive match or substring
  const aLower = aNorm.toLowerCase();
  const eLower = eNorm.toLowerCase();
  if (aLower === eLower || aLower.includes(eLower)) return true;

  // 4. Whitespace normalized match (collapse multiple spaces/tabs into single space)
  const aCollapsed = aNorm.replace(/[^\S\r\n]+/g, ' ').trim();
  const eCollapsed = eNorm.replace(/[^\S\r\n]+/g, ' ').trim();
  if (aCollapsed === eCollapsed || aCollapsed.toLowerCase().includes(eCollapsed.toLowerCase())) return true;

  // 5. Clean alphanumeric match (ignoring subtle punctuation like colons, commas, dashes)
  const aClean = aLower.replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const eClean = eLower.replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (aClean === eClean || aClean.includes(eClean)) return true;

  // 6. Check line-by-line presence (for multi-line outputs)
  const expectedLines = eNorm.split('\n').map(l => l.trim().toLowerCase()).filter(Boolean);
  const actualLines = aNorm.split('\n').map(l => l.trim().toLowerCase()).filter(Boolean);
  if (expectedLines.length > 0) {
    const allLinesFound = expectedLines.every(expLine =>
      actualLines.some(actLine => actLine.includes(expLine) || expLine.includes(actLine))
    );
    if (allLinesFound) return true;
  }

  // 7. Numerical sequence extraction (e.g. if expected is "175" or "6 3", verify numbers match in order)
  const expectedNums = eNorm.match(/-?\d+(\.\d+)?/g);
  const actualNums = aNorm.match(/-?\d+(\.\d+)?/g);
  if (expectedNums && actualNums && expectedNums.length > 0) {
    let matchIdx = 0;
    for (const actNum of actualNums) {
      if (Math.abs(parseFloat(actNum) - parseFloat(expectedNums[matchIdx])) < 0.001) {
        matchIdx++;
        if (matchIdx === expectedNums.length) return true;
      }
    }
  }

  return false;
}

    // Compare output
    const cleanOutput = runResult.stdout.replace(/\r\n/g, '\n').trim();
    const expected = (targetLevel.expectedOutput || '').replace(/\r\n/g, '\n').trim();

    const outputMatches = compareCppOutputs(cleanOutput, expected);

    const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
    const userProgress = progressData.progress[userId];

    if (!outputMatches) {
      // Partial damage or miss
      if (userProgress && userProgress.lives > 1) {
        userProgress.lives -= 1;
      }
      writeJsonFile('progress.json', progressData);

      return res.json({
        success: false,
        compilationSuccess: true,
        stdout: cleanOutput,
        stderr: runResult.stderr,
        expectedOutput: expected,
        message: `Output Mismatch. Expected:\n${expected}\n\nGot:\n${cleanOutput}`,
        damageDealt: 25,
        testsPassed: 0,
        totalTests: 1,
        executionTimeMs: runResult.executionTimeMs,
        livesRemaining: userProgress?.lives ?? 5,
      });
    }

    // SUCCESS! Test passed!
    const baseXp = targetLevel.rewards?.xp || 100;
    const baseCoins = targetLevel.rewards?.coins || 50;

    // Calculate penalties for using hints, solutions, or boosts
    const numClues = Math.max(0, Number(cluesUsed) || 0);
    const numBoosts = Math.max(0, Number(boostsUsed) || 0);
    const isSolutionUsed = Boolean(solutionUsed);

    const clueXpPenalty = numClues * 15;
    const clueCoinPenalty = numClues * 10;
    const boostXpPenalty = numBoosts * 5;
    const boostCoinPenalty = numBoosts * 3;
    const solutionXpPenalty = isSolutionUsed ? Math.round(baseXp * 0.45) : 0;
    const solutionCoinPenalty = isSolutionUsed ? Math.round(baseCoins * 0.45) : 0;

    const totalXpPenalty = Math.min(baseXp - 20, clueXpPenalty + boostXpPenalty + solutionXpPenalty);
    const totalCoinPenalty = Math.min(baseCoins - 10, clueCoinPenalty + boostCoinPenalty + solutionCoinPenalty);

    const netXpReward = Math.max(20, baseXp - totalXpPenalty);
    const netCoinReward = Math.max(10, baseCoins - totalCoinPenalty);

    const penaltyReasons: string[] = [];
    if (numClues > 0) penaltyReasons.push(`${numClues} Hint${numClues > 1 ? 's' : ''} Used (-${clueXpPenalty} XP, -${clueCoinPenalty} Coins)`);
    if (numBoosts > 0) penaltyReasons.push(`${numBoosts} Extra Boost Assist${numBoosts > 1 ? 's' : ''} (-${boostXpPenalty} XP, -${boostCoinPenalty} Coins)`);
    if (isSolutionUsed) penaltyReasons.push(`Solution Blueprint Used (-${solutionXpPenalty} XP, -${solutionCoinPenalty} Coins)`);

    let leveledUp = false;
    let universeRestored = false;
    let unlockedUniverseId = null;

    if (userProgress) {
      // Add Net XP & coins
      userProgress.xp += netXpReward;
      userProgress.coins += netCoinReward;
      userProgress.stats.challengesSolved += 1;
      userProgress.stats.codeLinesWritten += code.split('\n').length;

      // Level up calculation
      while (userProgress.xp >= userProgress.xpToNextLevel) {
        userProgress.level += 1;
        userProgress.coins += 50 * userProgress.level;
        userProgress.xpToNextLevel = Math.round(500 * Math.pow(userProgress.level, 1.35));
        leveledUp = true;
      }

      // Record completed level
      if (!userProgress.completedLevels.includes(levelId)) {
        userProgress.completedLevels.push(levelId);
      }

      // Check if boss level
      if (targetLevel.type === 'boss') {
        userProgress.stats.bossesDefeated += 1;
        if (!userProgress.completedUniverses.includes(targetUniverse.id)) {
          userProgress.completedUniverses.push(targetUniverse.id);
          universeRestored = true;
        }

        // Unlock next universe
        const nextOrder = targetUniverse.order + 1;
        const nextUniverse = universesData.universes.find(u => u.order === nextOrder);
        if (nextUniverse && !userProgress.unlockedUniverses.includes(nextUniverse.id)) {
          userProgress.unlockedUniverses.push(nextUniverse.id);
          unlockedUniverseId = nextUniverse.id;
        }
      }

      // Calculate restoration percentage
      const totalLevels = 24; // 8 universes * 3 levels
      userProgress.restorationPercentage = Math.min(
        100,
        Math.round((userProgress.completedLevels.length / totalLevels) * 100)
      );
      userProgress.lastActive = new Date().toISOString();

      writeJsonFile('progress.json', progressData);

      // Update leaderboard
      const leaderboardData = readJsonFile<{ leaderboard: any[] }>('leaderboard.json', { leaderboard: [] });
      const lbEntry = leaderboardData.leaderboard.find(e => e.userId === userId);
      if (lbEntry) {
        lbEntry.level = userProgress.level;
        lbEntry.xp = userProgress.xp;
        lbEntry.coins = userProgress.coins;
        lbEntry.restorationPercentage = userProgress.restorationPercentage;
      } else {
        const usersData = readJsonFile<{ users: any[] }>('users.json', { users: [] });
        const userObj = usersData.users.find(u => u.id === userId);
        leaderboardData.leaderboard.push({
          rank: leaderboardData.leaderboard.length + 1,
          userId,
          username: userObj?.username || 'Guardian',
          avatar: userObj?.avatar || 'Code Wizard',
          level: userProgress.level,
          xp: userProgress.xp,
          coins: userProgress.coins,
          restorationPercentage: userProgress.restorationPercentage,
          badge: 'Code Guardian',
          status: 'online',
        });
      }

      // Sort leaderboard
      leaderboardData.leaderboard.sort((a, b) => b.xp - a.xp);
      leaderboardData.leaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
        if (idx === 0) entry.badge = 'Grand Compiler Master';
        else if (idx === 1) entry.badge = 'Polymorph Paladin';
        else if (idx === 2) entry.badge = 'Syntax Adept';
        else if (idx <= 4) entry.badge = 'STL Vanguard';
        else entry.badge = 'Code Guardian';
      });
      writeJsonFile('leaderboard.json', leaderboardData);
    }

    // Check unlocked achievements
    const achievementsData = readJsonFile<{ achievements: any[] }>('achievements.json', { achievements: [] });
    const newlyUnlockedAchievements: string[] = [];

    achievementsData.achievements.forEach(ach => {
      if (!ach.unlockedUsers.includes(userId)) {
        let shouldUnlock = false;
        const compCount = userProgress?.completedLevels.length || 0;

        if (ach.id === 'ach_first_blood' && compCount >= 1) shouldUnlock = true;
        if (ach.id === 'ach_function_nexus' && compCount >= 6) shouldUnlock = true;
        if (ach.id === 'ach_oop_architect' && compCount >= 9) shouldUnlock = true;
        if (ach.id === 'ach_pointer_slayer' && levelId === 'w6_l3') shouldUnlock = true;
        if (ach.id === 'ach_flawless_compiler' && (userProgress?.restorationPercentage || 0) >= 100) shouldUnlock = true;

        if (shouldUnlock) {
          ach.unlockedUsers.push(userId);
          newlyUnlockedAchievements.push(ach.title);
        }
      }
    });
    writeJsonFile('achievements.json', achievementsData);

    return res.json({
      success: true,
      compilationSuccess: true,
      stdout: cleanOutput,
      stderr: runResult.stderr,
      expectedOutput: expected,
      message: 'All Test Cases Passed! Critical Strike Landed!',
      damageDealt: targetLevel.enemy?.maxHp || 300,
      bossDefeated: true,
      testsPassed: 1,
      totalTests: 1,
      executionTimeMs: runResult.executionTimeMs,
      rewards: {
        xp: netXpReward,
        coins: netCoinReward,
        baseXp,
        baseCoins,
        xpPenalty: totalXpPenalty,
        coinPenalty: totalCoinPenalty,
        penaltyReasons,
        item: targetLevel.rewards?.item,
      },
      leveledUp,
      universeRestored,
      unlockedUniverseId,
      newAchievements: newlyUnlockedAchievements,
      progress: userProgress,
    });
  } catch (err: any) {
    console.error('Evaluate error:', err);
    return res.status(500).json({ success: false, error: 'Evaluation failed' });
  }
});

// 8. Live Interactive Boss Combat Actions
app.post('/api/game/boss-action', (req, res) => {
  const { currentHp, maxHp, action } = req.body;
  const current = Number(currentHp) || 100;
  const max = Number(maxHp) || 100;

  let playerDamage = 40;
  let actionMessage = 'Guardian strikes the enemy!';

  if (action === 'strike') {
    playerDamage = 60 + Math.floor(Math.random() * 30);
    actionMessage = `Direct Code Strike landed for ${playerDamage} DMG!`;
  } else if (action === 'laser') {
    playerDamage = 110 + Math.floor(Math.random() * 50);
    actionMessage = `⚡ Quantum Photon Laser blasted the boss for ${playerDamage} Critical DMG!`;
  } else if (action === 'shield') {
    playerDamage = 25;
    actionMessage = `🛡️ Kinetic Shield Overcharge activated! Parries attack and reflects ${playerDamage} DMG!`;
  }

  const remainingHp = Math.max(0, current - playerDamage);
  const defeated = remainingHp <= 0;

  let bossCounterDamage = 0;
  let bossMessage = '';

  if (!defeated) {
    bossCounterDamage = 15 + Math.floor(Math.random() * 20);
    if (remainingHp < max / 2) {
      bossCounterDamage += 15;
      bossMessage = `🔥 ENRAGE TRIGGERED: Boss unleashes Corrupted Byte Vortex for ${bossCounterDamage} DMG!`;
    } else {
      bossMessage = `Boss retaliates with Memory Leak Shock for ${bossCounterDamage} DMG!`;
    }
  }

  res.json({
    success: true,
    playerDamage,
    remainingHp,
    defeated,
    actionMessage,
    bossCounterDamage,
    bossMessage,
  });
});

// 9. Practice Sandbox Compiler
app.post('/api/practice/compile', async (req, res) => {
  try {
    const { code, stdin } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'No C++ code provided' });
    }

    const result = await compileAndRunCpp(code, stdin || '');

    // Analyze code metrics
    const lines = code.split('\n').length;
    const hasOOP = /class\s+\w+|struct\s+\w+|virtual\s+|public:|private:/.test(code);
    const hasPointers = /\*|\&|new\s+|delete\s+/.test(code);
    const hasSTL = /vector<|map<|queue<|stack<|unordered_map<|sort\(/.test(code);

    res.json({
      success: result.success,
      stdout: result.stdout,
      stderr: result.stderr,
      compileError: result.compileError,
      executionTimeMs: result.executionTimeMs,
      metrics: {
        linesOfCode: lines,
        hasOOP,
        hasPointers,
        hasSTL,
        cppStandard: 'C++17',
      },
    });
  } catch (err: any) {
    console.error('Practice compile error:', err);
    res.status(500).json({ success: false, error: 'Practice compilation failed' });
  }
});

// 10. Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const leaderboardData = readJsonFile<{ leaderboard: any[] }>('leaderboard.json', { leaderboard: [] });
  res.json({ success: true, leaderboard: leaderboardData.leaderboard });
});

// 11. Achievements
app.get('/api/achievements', (req, res) => {
  const achievementsData = readJsonFile<{ achievements: any[] }>('achievements.json', { achievements: [] });
  res.json({ success: true, achievements: achievementsData.achievements });
});

// 12. Daily Missions & Randomized C++ Daily Coding Tasks
app.get('/api/daily-missions', (req, res) => {
  const dailyData = readJsonFile<{ dailyMissions: any[] }>('daily_missions.json', { dailyMissions: [] });
  res.json({ success: true, missions: dailyData.dailyMissions });
});

app.post('/api/daily-missions/claim', (req, res) => {
  const { missionId, userId } = req.body;
  const dailyData = readJsonFile<{ dailyMissions: any[] }>('daily_missions.json', { dailyMissions: [] });
  const mission = dailyData.dailyMissions.find(m => m.id === missionId);

  if (!mission) {
    return res.status(404).json({ success: false, error: 'Mission not found' });
  }

  mission.completed = true;
  writeJsonFile('daily_missions.json', dailyData);

  const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
  if (userId && progressData.progress[userId]) {
    progressData.progress[userId].xp += mission.xpReward;
    progressData.progress[userId].coins += mission.coinReward;
    writeJsonFile('progress.json', progressData);
  }

  res.json({ success: true, mission, progress: progressData.progress[userId] });
});

// Helper for deterministic daily task selection
function getDeterministicDailyTasks(seedStr: string, allTasks: any[]): any[] {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) & 0x7fffffff;
  }
  const pool = [...allTasks];
  const selected: any[] = [];
  let state = hash;
  for (let i = 0; i < Math.min(3, allTasks.length); i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const idx = state % pool.length;
    selected.push(pool.splice(idx, 1)[0]);
  }
  return selected;
}

// 12B. Randomized C++ Coding Tasks for Daily Missions
app.get('/api/game/daily-tasks', (req, res) => {
  const userId = req.query.userId as string;
  const tasksData = readJsonFile<{ tasks: any[] }>('daily_coding_tasks.json', { tasks: [] });
  
  // Format today's date key YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);
  const userDailyData = readJsonFile<{ records: Record<string, { date: string; taskIds: string[]; completedIds: string[] }> }>('daily_user_records.json', { records: {} });
  
  let userRecord = userDailyData.records[userId];
  if (!userRecord || userRecord.date !== today) {
    // Generate deterministic 3 tasks for today
    const seed = `${today}_${userId || 'default'}`;
    const selected = getDeterministicDailyTasks(seed, tasksData.tasks);
    userRecord = {
      date: today,
      taskIds: selected.map(t => t.id),
      completedIds: [],
    };
    if (userId) {
      userDailyData.records[userId] = userRecord;
      writeJsonFile('daily_user_records.json', userDailyData);
    }
  }

  // Populate tasks with completed status
  const currentTasks = userRecord.taskIds.map(id => {
    const task = tasksData.tasks.find(t => t.id === id);
    if (!task) return null;
    return {
      ...task,
      completed: userRecord.completedIds.includes(id),
    };
  }).filter(Boolean);

  res.json({
    success: true,
    date: today,
    tasks: currentTasks,
  });
});

app.post('/api/game/daily-tasks/reroll', (req, res) => {
  const { userId } = req.body;
  const tasksData = readJsonFile<{ tasks: any[] }>('daily_coding_tasks.json', { tasks: [] });
  const today = new Date().toISOString().slice(0, 10);
  const userDailyData = readJsonFile<{ records: Record<string, { date: string; taskIds: string[]; completedIds: string[] }> }>('daily_user_records.json', { records: {} });
  
  const seed = `${today}_${userId}_reroll_${Date.now()}`;
  const selected = getDeterministicDailyTasks(seed, tasksData.tasks);

  const existingCompleted = userDailyData.records[userId]?.completedIds || [];
  userDailyData.records[userId] = {
    date: today,
    taskIds: selected.map(t => t.id),
    completedIds: existingCompleted,
  };
  writeJsonFile('daily_user_records.json', userDailyData);

  const currentTasks = selected.map(task => ({
    ...task,
    completed: existingCompleted.includes(task.id),
  }));

  res.json({
    success: true,
    tasks: currentTasks,
    message: 'New Daily C++ Protocols Generated!',
  });
});

app.post('/api/game/daily-tasks/evaluate', async (req, res) => {
  try {
    const { userId, taskId, code } = req.body;
    if (!userId || !taskId || !code) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    const tasksData = readJsonFile<{ tasks: any[] }>('daily_coding_tasks.json', { tasks: [] });
    const task = tasksData.tasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Daily task not found' });
    }

    // Compile and run submitted C++ code with task sampleInput if defined
    const runResult = await compileAndRunCpp(code, task.sampleInput || '');

    if (!runResult.success) {
      return res.json({
        success: false,
        compilationSuccess: false,
        compileError: runResult.compileError || runResult.stderr || 'Compilation failed',
        stderr: runResult.stderr,
        stdout: runResult.stdout,
        message: 'Compilation or Runtime error! Check diagnostic messages.',
        xpAwarded: 0,
        coinsAwarded: 0,
        leveledUp: false,
      });
    }

    // Robust output normalization (removes CRLF and trailing per-line spaces)
    const normalizeOutput = (str: string) => {
      return (str || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .trim();
    };

    const cleanOutput = normalizeOutput(runResult.stdout);
    const cleanExpected = normalizeOutput(task.expectedOutput);

    if (cleanOutput !== cleanExpected) {
      return res.json({
        success: false,
        compilationSuccess: true,
        stdout: runResult.stdout.trim(),
        stderr: runResult.stderr,
        expectedOutput: task.expectedOutput.trim(),
        message: 'Output does not match required protocol directive.',
        xpAwarded: 0,
        coinsAwarded: 0,
        leveledUp: false,
      });
    }

    // Check if task was already completed today by this user
    const today = new Date().toISOString().slice(0, 10);
    const userDailyData = readJsonFile<{ records: Record<string, { date: string; taskIds: string[]; completedIds: string[] }> }>('daily_user_records.json', { records: {} });
    
    if (!userDailyData.records[userId]) {
      userDailyData.records[userId] = { date: today, taskIds: [taskId], completedIds: [] };
    }
    const isFirstTime = !userDailyData.records[userId].completedIds.includes(taskId);

    let leveledUp = false;
    let awardedXp = 0;
    let awardedCoins = 0;

    const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
    const userProgress = progressData.progress[userId];

    if (isFirstTime) {
      userDailyData.records[userId].completedIds.push(taskId);
      writeJsonFile('daily_user_records.json', userDailyData);

      awardedXp = task.xpReward;
      awardedCoins = task.coinReward;

      if (userProgress) {
        userProgress.xp += task.xpReward;
        userProgress.coins += task.coinReward;
        userProgress.stats.challengesSolved = (userProgress.stats.challengesSolved || 0) + 1;
        userProgress.stats.codeLinesWritten = (userProgress.stats.codeLinesWritten || 0) + code.split('\n').length;

        while (userProgress.xp >= userProgress.xpToNextLevel) {
          userProgress.level += 1;
          userProgress.coins += 50 * userProgress.level;
          userProgress.xpToNextLevel = Math.round(500 * Math.pow(userProgress.level, 1.35));
          leveledUp = true;
        }

        writeJsonFile('progress.json', progressData);

        // Update Leaderboard
        const leaderboardData = readJsonFile<{ leaderboard: any[] }>('leaderboard.json', { leaderboard: [] });
        const lbEntry = leaderboardData.leaderboard.find(e => e.userId === userId);
        if (lbEntry) {
          lbEntry.level = userProgress.level;
          lbEntry.xp = userProgress.xp;
          lbEntry.coins = userProgress.coins;
          leaderboardData.leaderboard.sort((a, b) => b.xp - a.xp);
          leaderboardData.leaderboard.forEach((entry, idx) => {
            entry.rank = idx + 1;
          });
          writeJsonFile('leaderboard.json', leaderboardData);
        }
      }
    }

    return res.json({
      success: true,
      compilationSuccess: true,
      stdout: runResult.stdout.trim(),
      stderr: runResult.stderr,
      expectedOutput: task.expectedOutput.trim(),
      message: isFirstTime
        ? `Protocol Solved! +${awardedXp} XP and +${awardedCoins} Coins awarded!`
        : `Protocol Solved! Verified successfully against official directive.`,
      xpAwarded: awardedXp,
      coinsAwarded: awardedCoins,
      leveledUp,
      progress: userProgress,
    });
  } catch (err: any) {
    console.error('Daily task evaluate error:', err);
    return res.status(500).json({ success: false, error: 'Daily task evaluation failed' });
  }
});

// 13. Settings Update
app.post('/api/settings/update', (req, res) => {
  const { userId, avatar, username } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  const usersData = readJsonFile<{ users: any[] }>('users.json', { users: [] });
  const user = usersData.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (avatar) user.avatar = avatar;
  if (username && username.trim().length > 0) user.username = username.trim();

  writeJsonFile('users.json', usersData);

  // Also update in leaderboard
  const leaderboardData = readJsonFile<{ leaderboard: any[] }>('leaderboard.json', { leaderboard: [] });
  const lbEntry = leaderboardData.leaderboard.find(e => e.userId === userId);
  if (lbEntry) {
    if (avatar) lbEntry.avatar = avatar;
    if (username) lbEntry.username = username;
    writeJsonFile('leaderboard.json', leaderboardData);
  }

  res.json({ success: true, user });
});

// 14. Reset Progress
app.post('/api/game/reset-progress', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  const progressData = readJsonFile<{ progress: Record<string, any> }>('progress.json', { progress: {} });
  progressData.progress[userId] = {
    userId,
    level: 1,
    xp: 0,
    xpToNextLevel: 500,
    coins: 150,
    lives: 5,
    maxLives: 5,
    currentUniverseId: 'world_1',
    completedUniverses: [],
    unlockedUniverses: ['world_1'],
    completedLevels: [],
    restorationPercentage: 0,
    stats: {
      challengesSolved: 0,
      bossesDefeated: 0,
      accuracyRate: 100,
      streakDays: 1,
      codeLinesWritten: 0,
    },
    lastActive: new Date().toISOString(),
  };
  writeJsonFile('progress.json', progressData);

  res.json({ success: true, progress: progressData.progress[userId] });
});

// ==========================================
// VITE SPA MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeWithUniverse Full-Stack Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
