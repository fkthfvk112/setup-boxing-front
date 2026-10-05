import { apiRequest } from './client';
import { ApiResponse } from './types';

export interface CreateComboPayload {
  id: string;
  name: string;
  sequenceJson: string;
  category?: string;
  color?: string;
  description?: string;
  durationMs?: number;
  tokenCount?: number;
}

export interface CustomComboBackendEntity {
  id: string;
  userId: string;
  name: string;
  sequenceJson: string;
  isPreset: boolean;
  isCombo: boolean;
  category: string;
  color: string;
  description?: string;
  durationMs: number;
  tokenCount: number;
  createdAt: string;
}

export const comboApi = {
  getCustomCombos: async (): Promise<ApiResponse<CustomComboBackendEntity[]>> => {
    return apiRequest('/api/v1/combos', 'GET');
  },

  saveCustomCombo: async (
    payload: CreateComboPayload
  ): Promise<ApiResponse<CustomComboBackendEntity>> => {
    return apiRequest('/api/v1/combos', 'POST', payload);
  },

  deleteCustomCombo: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/api/v1/combos/${id}`, 'DELETE');
  },
};
