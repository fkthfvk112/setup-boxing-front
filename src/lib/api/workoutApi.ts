import { apiRequest } from './client';
import { ApiResponse } from './types';
import { WorkoutLog } from '../../utils/webDb';

export interface CreateWorkoutLogPayload {
  date: string;
  setsCompleted: number;
  durationSeconds: number;
  routineName?: string;
  totalPunches?: number;
  totalEvasions?: number;
  caloriesBurned?: number;
  timestamp?: number;
  userRecordedAt?: string;
  clientTimezone?: string;
}

export interface WorkoutLogBackendEntity {
  id: number;
  userId: string;
  date: string;
  setsCompleted: number;
  durationSeconds: number;
  routineName: string;
  totalPunches: number;
  totalEvasions: number;
  caloriesBurned: number;
  timestamp?: number;
  userRecordedAt?: string;
  clientTimezone?: string;
  createdAt: string;
}

export const workoutApi = {
  getWorkoutLogs: async (): Promise<ApiResponse<WorkoutLogBackendEntity[]>> => {
    return apiRequest('/api/v1/workouts', 'GET');
  },

  createWorkoutLog: async (
    payload: CreateWorkoutLogPayload
  ): Promise<ApiResponse<WorkoutLogBackendEntity>> => {
    return apiRequest('/api/v1/workouts', 'POST', payload);
  },

  deleteWorkoutLog: async (id: number): Promise<ApiResponse<void>> => {
    return apiRequest(`/api/v1/workouts/${id}`, 'DELETE');
  },

  deleteAllWorkoutLogs: async (): Promise<ApiResponse<void>> => {
    return apiRequest('/api/v1/workouts', 'DELETE');
  },
};
