// Dimensional Disruption Management Service
// Handles world disruption countdowns (minimum 2 to 3 minutes) when levels aren't solved in time

export interface DisruptedWorld {
  universeId: string;
  universeName: string;
  levelId: string;
  levelTitle: string;
  disruptedAt: number;
  disruptedUntil: number;
  durationSeconds: number;
  reason: string;
}

const STORAGE_KEY = 'cw_disrupted_worlds';
type DisruptionListener = () => void;
const listeners: Set<DisruptionListener> = new Set();

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying disruption listener:', e);
    }
  });
}

export function getDisruptedWorlds(): Record<string, DisruptedWorld> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data: Record<string, DisruptedWorld> = JSON.parse(raw);
    const now = Date.now();
    let hasExpired = false;

    // Prune naturally expired disruptions
    const valid: Record<string, DisruptedWorld> = {};
    for (const [id, item] of Object.entries(data)) {
      if (item && item.disruptedUntil > now) {
        valid[id] = item;
      } else {
        hasExpired = true;
      }
    }

    if (hasExpired) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch (err) {
    console.error('Failed to parse disrupted worlds:', err);
    return {};
  }
}

export function isWorldDisrupted(universeId: string): boolean {
  const worlds = getDisruptedWorlds();
  const world = worlds[universeId];
  if (!world) return false;
  return world.disruptedUntil > Date.now();
}

export function getDisruptedWorld(universeId: string): DisruptedWorld | null {
  const worlds = getDisruptedWorlds();
  const world = worlds[universeId];
  if (!world) return null;
  if (world.disruptedUntil <= Date.now()) {
    restoreWorld(universeId);
    return null;
  }
  return world;
}

export function getRemainingDisruptionSeconds(universeId: string): number {
  const world = getDisruptedWorld(universeId);
  if (!world) return 0;
  const diffMs = world.disruptedUntil - Date.now();
  return Math.max(0, Math.ceil(diffMs / 1000));
}

/**
 * Disables / corrupts a world for a minimum of 2 to 3 minutes (default 150 seconds = 2.5 minutes)
 */
export function disruptWorld(
  universeId: string,
  universeName: string,
  levelId: string,
  levelTitle: string,
  durationSeconds: number = 150, // 2.5 minutes (can be 120-180s)
  reason: string = 'Challenge time expired before glitch eradication.'
): DisruptedWorld {
  const worlds = getDisruptedWorlds();
  const now = Date.now();
  const safeSeconds = Math.max(120, Math.min(300, durationSeconds)); // Ensure minimum 2 minutes
  const disruptedUntil = now + safeSeconds * 1000;

  const disruption: DisruptedWorld = {
    universeId,
    universeName,
    levelId,
    levelTitle,
    disruptedAt: now,
    disruptedUntil,
    durationSeconds: safeSeconds,
    reason,
  };

  worlds[universeId] = disruption;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds));
  } catch (e) {
    console.error('Failed to save disruption to localStorage:', e);
  }

  notifyListeners();
  return disruption;
}

export function restoreWorld(universeId: string): void {
  const worlds = getDisruptedWorlds();
  if (worlds[universeId]) {
    delete worlds[universeId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds));
    } catch (e) {
      console.error('Failed to save restored worlds:', e);
    }
    notifyListeners();
  }
}

export function clearAllDisruptions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  notifyListeners();
}

export function subscribeToDisruptions(listener: DisruptionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
