import { atom } from 'jotai';
import { SkillInterface, WorkoutLog } from '../types/combo';

const getInitialPlaylist = (): SkillInterface[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('boxing_playlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getInitialMyCombos = (): SkillInterface[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('boxing_my_combos');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getInitialLogs = (): WorkoutLog[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('boxing_workout_logs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getInitialWorkbench = (): SkillInterface[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('boxing_workbench_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const playlistAtom = atom<SkillInterface[]>(getInitialPlaylist());
export const playModeAtom = atom<'sequential' | 'random'>('sequential');
export const myCombosAtom = atom<SkillInterface[]>(getInitialMyCombos());
export const workoutLogsAtom = atom<WorkoutLog[]>(getInitialLogs());

// Routine Builder Workbench State (Persistent across navigation)
export const workbenchItemsAtom = atom<SkillInterface[]>(getInitialWorkbench());
export const workbenchUndoHistoryAtom = atom<SkillInterface[][]>([]);
export const workbenchSelectedIndexAtom = atom<number | null>(null);

// Workout settings
export const workoutTimeAtom = atom<number>(180); // seconds
export const restTimeAtom = atom<number>(30); // seconds
export const setsCountAtom = atom<number>(3); // rounds
