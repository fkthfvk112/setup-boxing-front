import { useState, useEffect } from 'react';
import { ComboBlock } from '../types/combo';

export interface WorkoutGlobalState {
  isActive: boolean;
  badgeId: string | null;
  badgeName: string | null;
  workoutTime: number;
  restTime: number;
  setsCount: number;
  
  // Combo parameters
  blocks?: ComboBlock[];
  playMode?: 'sequential' | 'random';
  stepDurationMs?: number;
}

let globalState: WorkoutGlobalState = {
  isActive: false,
  badgeId: null,
  badgeName: null,
  workoutTime: 180,
  restTime: 30,
  setsCount: 3,
  blocks: [],
  playMode: 'sequential',
  stepDurationMs: 700,
};

const listeners = new Set<(state: WorkoutGlobalState) => void>();

export const workoutGlobal = {
  getState: () => globalState,
  setState: (update: Partial<WorkoutGlobalState>) => {
    globalState = { ...globalState, ...update };
    listeners.forEach((listener) => listener(globalState));
  },
  subscribe: (listener: (state: WorkoutGlobalState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  start: (params: {
    badgeId?: string | null;
    badgeName?: string | null;
    workoutTime: number;
    restTime: number;
    setsCount: number;
    blocks?: ComboBlock[];
    playMode?: 'sequential' | 'random';
    stepDurationMs?: number;
  }) => {
    workoutGlobal.setState({
      isActive: true,
      badgeId: params.badgeId ?? null,
      badgeName: params.badgeName ?? null,
      workoutTime: params.workoutTime,
      restTime: params.restTime,
      setsCount: params.setsCount,
      blocks: params.blocks ?? [],
      playMode: params.playMode ?? 'sequential',
      stepDurationMs: params.stepDurationMs ?? 700,
    });
  },
  stop: () => {
    workoutGlobal.setState({
      isActive: false,
      badgeId: null,
      badgeName: null,
      blocks: [],
    });
  }
};

export function useGlobalWorkout() {
  const [state, setState] = useState<WorkoutGlobalState>(globalState);

  useEffect(() => {
    const unsubscribe = workoutGlobal.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return state;
}
