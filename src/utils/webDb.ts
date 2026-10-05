import { ComboBlock, SkillInterface } from '../types/combo';
import { calculateSkillTokens, EntitlementTier } from '../constants/Entitlements';
import { parsePatternToTokens } from './comboParser';
import { workoutApi, comboApi, authApi } from '../lib/api';

export interface WorkoutLog {
  id: number;
  date: string;
  sets_completed: number;
  duration_seconds: number;
  timestamp: number;
  user_recorded_at?: string;
  client_timezone?: string;
  routine_name?: string;
  total_punches?: number;
  total_evasions?: number;
  calories_burned?: number;
}

export interface AppSettings {
  workoutTime: number; // seconds
  restTime: number; // seconds
  setsCount: number;
  demoSpeed: number; // speed multiplier
}

export interface WorkoutCompletionResult {
  logId?: number;
  durationSeconds: number;
  setsCompleted: number;
  totalPunches: number;
  totalEvasions: number;
  caloriesBurned: number;
}

const SETTINGS_KEY = 'boxing_app_settings';
const LOGS_KEY = 'boxing_workout_logs';
const CUSTOM_COMBOS_KEY = 'boxing_custom_combos';
const LAST_PLAYLIST_KEY = 'boxing_last_playlist';
const USER_TIER_KEY = 'boxing_user_tier';
const USER_LANG_KEY = 'boxing_user_language';
const GUEST_ID_KEY = 'boxing_guest_id';

const DEFAULT_SETTINGS: AppSettings = {
  workoutTime: 180,
  restTime: 30,
  setsCount: 3,
  demoSpeed: 1.0,
};

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Returns existing access token or null if unauthenticated.
 */
export async function ensureAuthToken(): Promise<string | null> {
  if (!isClient()) return null;
  return localStorage.getItem('boxing_access_token');
}

// ---------------- App Settings ----------------
export async function getAppSettings(): Promise<AppSettings> {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  if (!isClient()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ---------------- Workout Logs ----------------
export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  if (!isClient()) return [];

  // Try fetching from backend API first
  try {
    await ensureAuthToken();
    const res = await workoutApi.getWorkoutLogs();
    if (res && res.data && Array.isArray(res.data)) {
      const mapped: WorkoutLog[] = res.data.map((item) => {
        const itemTimestamp =
          item.timestamp ||
          (item.userRecordedAt ? new Date(item.userRecordedAt.replace(' ', 'T')).getTime() : 0) ||
          new Date(item.createdAt || item.date).getTime() ||
          item.id;

        return {
          id: item.id,
          date: item.date,
          sets_completed: item.setsCompleted,
          duration_seconds: item.durationSeconds,
          timestamp: itemTimestamp,
          user_recorded_at: item.userRecordedAt || `${item.date} 00:00:00`,
          client_timezone: item.clientTimezone,
          routine_name: item.routineName,
          total_punches: item.totalPunches,
          total_evasions: item.totalEvasions,
          calories_burned: item.caloriesBurned,
        };
      });

      // Sort by user's local workout timestamp descending
      mapped.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      // Keep local storage in sync as local cache
      localStorage.setItem(LOGS_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('[webDb] workoutApi.getWorkoutLogs failed, using local cache:', err);
  }

  // Fallback to local storage cache
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    const parsed: WorkoutLog[] = JSON.parse(raw);
    parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return parsed;
  } catch {
    return [];
  }
}

export async function addWorkoutLog(
  badgeId: string | null | undefined,
  setsCompleted: number,
  durationSeconds: number,
  routineName?: string | null,
  totalPunches: number = 0,
  totalEvasions: number = 0,
  caloriesBurned: number = 0
): Promise<WorkoutCompletionResult> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // User's exact phone local date & time
  const userLocalDate = `${year}-${month}-${day}`;
  const userRecordedAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const clientTimezone =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Seoul'
      : 'Asia/Seoul';
  const timestamp = now.getTime();
  let logId = timestamp;

  const validSets = Math.max(0, Math.floor(setsCompleted));
  const validDuration = Math.max(0, Math.floor(durationSeconds));
  const validRoutineName = routineName?.trim() || '복싱 훈련';

  // 1. Request backend API to persist in Spring Boot DB
  if (isClient()) {
    try {
      await ensureAuthToken();
      const res = await workoutApi.createWorkoutLog({
        date: userLocalDate,
        setsCompleted: validSets,
        durationSeconds: validDuration,
        routineName: validRoutineName,
        totalPunches,
        totalEvasions,
        caloriesBurned,
        timestamp,
        userRecordedAt,
        clientTimezone,
      });
      if (res && res.data && res.data.id) {
        logId = res.data.id;
      }
    } catch (err) {
      console.warn('[webDb] workoutApi.createWorkoutLog failed:', err);
    }

    // 2. Also cache in localStorage for instant offline access
    const newLog: WorkoutLog = {
      id: logId,
      date: userLocalDate,
      sets_completed: validSets,
      duration_seconds: validDuration,
      timestamp,
      user_recorded_at: userRecordedAt,
      client_timezone: clientTimezone,
      routine_name: validRoutineName,
      total_punches: totalPunches,
      total_evasions: totalEvasions,
      calories_burned: caloriesBurned,
    };

    try {
      const raw = localStorage.getItem(LOGS_KEY);
      const current: WorkoutLog[] = raw ? JSON.parse(raw) : [];
      const updated = [newLog, ...current.filter((l) => l.id !== logId)];
      updated.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
    } catch {}
  }

  return {
    logId,
    durationSeconds: validDuration,
    setsCompleted: validSets,
    totalPunches,
    totalEvasions,
    caloriesBurned,
  };
}

export async function deleteWorkoutLog(id: number): Promise<void> {
  if (!isClient()) return;

  // 1. Request backend API to delete from Spring Boot DB
  try {
    await ensureAuthToken();
    await workoutApi.deleteWorkoutLog(id);
  } catch (err) {
    console.warn('[webDb] workoutApi.deleteWorkoutLog failed:', err);
  }

  // 2. Update local storage cache
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    const current: WorkoutLog[] = raw ? JSON.parse(raw) : [];
    const updated = current.filter((l) => l.id !== id);
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  } catch {}
}

export async function resetProgress(): Promise<void> {
  if (!isClient()) return;

  // 1. Request backend API to delete all logs
  try {
    await ensureAuthToken();
    await workoutApi.deleteAllWorkoutLogs();
  } catch (err) {
    console.warn('[webDb] workoutApi.deleteAllWorkoutLogs failed:', err);
  }

  // 2. Clear local storage cache
  localStorage.setItem(LOGS_KEY, JSON.stringify([]));
}

// ---------------- Today Stats ----------------
export async function getTodaySetsCount(): Promise<number> {
  const logs = await getWorkoutLogs();
  const today = new Date().toISOString().split('T')[0];
  return logs
    .filter((l) => l.date === today)
    .reduce((sum, l) => sum + (l.sets_completed || 0), 0);
}

export async function getTodayWorkoutCount(): Promise<number> {
  const logs = await getWorkoutLogs();
  const today = new Date().toISOString().split('T')[0];
  return logs.filter((l) => l.date === today).length;
}

export async function getTodayDurationSeconds(): Promise<number> {
  const logs = await getWorkoutLogs();
  const today = new Date().toISOString().split('T')[0];
  return logs
    .filter((l) => l.date === today)
    .reduce((sum, l) => sum + (l.duration_seconds || 0), 0);
}

// ---------------- Custom Combos ----------------
export async function getCustomCombos(): Promise<SkillInterface[]> {
  if (!isClient()) return [];

  // 1. Fetch from backend API
  try {
    await ensureAuthToken();
    const res = await comboApi.getCustomCombos();
    if (res && res.data && Array.isArray(res.data)) {
      const mapped: SkillInterface[] = res.data.map((item) => {
        let parsedSeq: string[] = [];
        try {
          parsedSeq = JSON.parse(item.sequenceJson);
        } catch {
          parsedSeq = item.sequenceJson.split('.');
        }
        return {
          id: item.id,
          name: item.name,
          sequence: parsedSeq,
          isPreset: item.isPreset ?? false,
          isCombo: item.isCombo ?? true,
          category: (item.category as any) || 'my-combo',
          color: item.color || '#FF2E54',
          description: item.description,
          durationMs: item.durationMs,
          tokenCount: item.tokenCount,
          createdAt: new Date(item.createdAt).getTime() || Date.now(),
        };
      });
      localStorage.setItem(CUSTOM_COMBOS_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('[webDb] comboApi.getCustomCombos failed, using local cache:', err);
  }

  // 2. Fallback to local storage
  try {
    const raw = localStorage.getItem(CUSTOM_COMBOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveCustomCombo(skill: SkillInterface): Promise<void> {
  if (!isClient()) return;

  // 1. Send to backend API
  try {
    await ensureAuthToken();
    await comboApi.saveCustomCombo({
      id: skill.id,
      name: skill.name,
      sequenceJson: JSON.stringify(skill.sequence),
      category: skill.category || 'my-combo',
      color: skill.color || '#FF2E54',
      description: skill.description,
      durationMs: skill.durationMs,
      tokenCount: skill.tokenCount,
    });
  } catch (err) {
    console.warn('[webDb] comboApi.saveCustomCombo failed:', err);
  }

  // 2. Save in local storage cache
  try {
    const raw = localStorage.getItem(CUSTOM_COMBOS_KEY);
    const current: SkillInterface[] = raw ? JSON.parse(raw) : [];
    const filtered = current.filter((s) => s.id !== skill.id);
    const updated = [skill, ...filtered];
    localStorage.setItem(CUSTOM_COMBOS_KEY, JSON.stringify(updated));
  } catch {}
}

export async function deleteCustomCombo(id: string): Promise<void> {
  if (!isClient()) return;

  // 1. Send delete request to backend API
  try {
    await ensureAuthToken();
    await comboApi.deleteCustomCombo(id);
  } catch (err) {
    console.warn('[webDb] comboApi.deleteCustomCombo failed:', err);
  }

  // 2. Remove from local storage cache
  try {
    const raw = localStorage.getItem(CUSTOM_COMBOS_KEY);
    const current: SkillInterface[] = raw ? JSON.parse(raw) : [];
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(CUSTOM_COMBOS_KEY, JSON.stringify(updated));
  } catch {}
}

// ---------------- Playlist ----------------
export async function getLastPlaylist(): Promise<{ mode: 'sequential' | 'random'; items: SkillInterface[] } | null> {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(LAST_PLAYLIST_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveLastPlaylist(playlist: { mode: 'sequential' | 'random'; items: SkillInterface[] }): Promise<void> {
  if (!isClient()) return;
  localStorage.setItem(LAST_PLAYLIST_KEY, JSON.stringify(playlist));
}

// ---------------- User Tier ----------------
export async function getUserTier(): Promise<EntitlementTier> {
  if (!isClient()) return 'FREE';

  // Sync tier from backend user info
  try {
    await ensureAuthToken();
    const res = await authApi.getMe();
    if (res && res.data && res.data.tier) {
      localStorage.setItem(USER_TIER_KEY, res.data.tier);
      return res.data.tier;
    }
  } catch {}

  try {
    const tier = localStorage.getItem(USER_TIER_KEY);
    if (tier === 'PRO' || tier === 'ULTIMATE' || tier === 'FREE') {
      return tier;
    }
    return 'FREE';
  } catch {
    return 'FREE';
  }
}

export async function saveUserTier(tier: EntitlementTier): Promise<void> {
  if (!isClient()) return;
  localStorage.setItem(USER_TIER_KEY, tier);

  try {
    await ensureAuthToken();
    await authApi.updateTier(tier);
  } catch (err) {
    console.warn('[webDb] authApi.updateTier failed:', err);
  }
}

export interface UserProfileData {
  userId: string;
  email: string;
  userName?: string;
  provider: string;
  tier: EntitlementTier;
}

export async function getUserProfile(): Promise<UserProfileData | null> {
  if (!isClient()) return null;
  const token = localStorage.getItem('boxing_access_token');
  if (!token) return null;

  try {
    const res = await authApi.getMe();
    if (res && res.data) {
      localStorage.setItem('boxing_user', JSON.stringify(res.data));
      localStorage.setItem(USER_TIER_KEY, res.data.tier);
      return {
        userId: String(res.data.userId || res.data.id),
        email: String(res.data.email || ''),
        userName: res.data.userName || res.data.nickname || '복서',
        provider: String(res.data.provider || 'LOCAL'),
        tier: (res.data.tier || 'FREE') as EntitlementTier,
      };
    }
  } catch {}

  try {
    const raw = localStorage.getItem('boxing_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.userId || parsed.id || parsed.email)) {
        return {
          userId: String(parsed.userId || parsed.id),
          email: String(parsed.email || ''),
          userName: parsed.userName || parsed.nickname || '복서',
          provider: String(parsed.provider || 'LOCAL'),
          tier: (parsed.tier || 'FREE') as EntitlementTier,
        };
      }
    }
  } catch {}

  return null;
}

// ---------------- Language ----------------
export async function getSavedLanguage(): Promise<'ko' | 'en' | null> {
  if (!isClient()) return null;
  try {
    const lang = localStorage.getItem(USER_LANG_KEY);
    if (lang === 'ko' || lang === 'en') return lang;
    return null;
  } catch {
    return null;
  }
}

export async function saveLanguageSetting(lang: 'ko' | 'en'): Promise<void> {
  if (!isClient()) return;
  localStorage.setItem(USER_LANG_KEY, lang);
}

// ---------------- Workout Stats Calculator ----------------
export function calculateWorkoutStats(
  playlistItems: (SkillInterface | ComboBlock | any)[],
  durationSeconds: number,
  setsCompleted: number
): { totalPunches: number; totalEvasions: number; caloriesBurned: number } {
  let punchesPerCycle = 0;
  let evasionsPerCycle = 0;

  const PUNCH_TOKENS = new Set([
    '1', '2', '3', '4', '5', '6', '7', '8',
    'l-jab', 'r-jab', 'l-straight', 'r-straight', 'l-hook', 'r-hook',
    'l-upper', 'r-upper', 'l-body-hook', 'r-body-hook', 'straight', 'jab', 'cross', 'hook', 'upper'
  ]);

  const EVASION_TOKENS = new Set([
    'duck', 'ducking', 'slip', 'l-slip', 'r-slip', 'weave', 'l-weave', 'r-weave', 'back', 'guard'
  ]);

  if (playlistItems && playlistItems.length > 0) {
    for (const item of playlistItems) {
      const tokens: string[] = item.sequence || (item.pattern ? parsePatternToTokens(item.pattern) : []);
      for (const t of tokens) {
        const clean = t.trim().toLowerCase();
        if (PUNCH_TOKENS.has(clean)) {
          punchesPerCycle++;
        } else if (EVASION_TOKENS.has(clean)) {
          evasionsPerCycle++;
        }
      }
    }
  }

  let totalPunches = 0;
  let totalEvasions = 0;

  if (punchesPerCycle > 0 || evasionsPerCycle > 0) {
    const estimatedCycles = Math.max(1, Math.round(durationSeconds / 10));
    totalPunches = punchesPerCycle * estimatedCycles;
    totalEvasions = evasionsPerCycle * estimatedCycles;
  } else {
    // Free Shadow Boxing estimates
    totalPunches = Math.round(durationSeconds * 0.45);
    totalEvasions = Math.round(durationSeconds * 0.12);
  }

  // Boxing workout METs formula: ~9.5 METs for heavy shadow boxing
  const durationMinutes = durationSeconds / 60;
  const baseCalories = durationMinutes * 8.5;
  const punchBonus = totalPunches * 0.12;
  const evasionBonus = totalEvasions * 0.18;
  const caloriesBurned = Math.max(1, Math.round(baseCalories + punchBonus + evasionBonus));

  return {
    totalPunches,
    totalEvasions,
    caloriesBurned,
  };
}
