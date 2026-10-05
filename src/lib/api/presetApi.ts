import { apiRequest } from './client';
import { ApiResponse } from './types';

export interface DailyPresetDto {
  id: string;
  dayOfWeek: string;
  dayNameKo: string;
  dayNameEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  focusArea: string;
  focusAreaEn: string;
  roundTimeSeconds: number;
  restTimeSeconds: number;
  recommendedSets: number;
  comboItemsJson: string;
  tagList: string;
  colorTheme: string;
  difficultyLevel: string;
  isToday: boolean;
}

export const presetApi = {
  getDailyPreset: (day?: string): Promise<ApiResponse<DailyPresetDto>> => {
    return apiRequest('/api/v1/presets/daily', 'GET', undefined, day ? { day } : undefined);
  },

  getWeeklyPresets: (): Promise<ApiResponse<DailyPresetDto[]>> => {
    return apiRequest('/api/v1/presets/week', 'GET');
  },
};
