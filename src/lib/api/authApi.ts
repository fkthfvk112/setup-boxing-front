import { apiRequest } from './client';
import { ApiResponse } from './types';
import { UserProfile } from '../../types/combo';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

export interface ClientAnalyticsMeta {
  language?: string;
  country?: string;
  timezone?: string;
}

export function getClientAnalyticsMeta(): ClientAnalyticsMeta {
  if (typeof window === 'undefined') return {};
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const storedLang = localStorage.getItem('app_lang') || navigator.language;
    let country: string | undefined;
    if (navigator.language && navigator.language.includes('-')) {
      country = navigator.language.split('-')[1]?.toUpperCase();
    }
    return {
      language: storedLang,
      country,
      timezone,
    };
  } catch {
    return {};
  }
}

export const authApi = {
  loginWithKakao: (code: string, redirectUri?: string, meta?: ClientAnalyticsMeta): Promise<ApiResponse<LoginResponse>> => {
    const clientMeta = { ...getClientAnalyticsMeta(), ...meta };
    return apiRequest('/api/v1/auth/kakao', 'POST', { code, redirectUri, ...clientMeta });
  },

  loginWithGoogle: (data: string | ({ code?: string; idToken?: string; redirectUri?: string } & ClientAnalyticsMeta)): Promise<ApiResponse<LoginResponse>> => {
    const clientMeta = getClientAnalyticsMeta();
    const payload = typeof data === 'string' ? { idToken: data, ...clientMeta } : { ...clientMeta, ...data };
    return apiRequest('/api/v1/auth/google', 'POST', payload);
  },

  guestLogin: (guestId?: string, meta?: ClientAnalyticsMeta): Promise<ApiResponse<LoginResponse>> => {
    const clientMeta = { ...getClientAnalyticsMeta(), ...meta };
    return apiRequest('/api/v1/auth/guest', 'POST', { guestId, ...clientMeta });
  },

  getMe: (): Promise<ApiResponse<UserProfile>> => {
    return apiRequest('/api/v1/auth/me', 'GET');
  },

  login: (data: { email: string; password?: string } & ClientAnalyticsMeta): Promise<ApiResponse<LoginResponse>> => {
    const { email, password, ...restMeta } = data;
    const clientMeta = { ...getClientAnalyticsMeta(), ...restMeta };
    return apiRequest('/api/v1/auth/login', 'POST', { userId: email, password, ...clientMeta });
  },

  signUp: (data: { email: string; password?: string; nickname?: string } & ClientAnalyticsMeta): Promise<ApiResponse<LoginResponse>> => {
    const { email, password, nickname, ...restMeta } = data;
    const clientMeta = { ...getClientAnalyticsMeta(), ...restMeta };
    return apiRequest('/api/v1/auth/signup', 'POST', {
      userId: email,
      email,
      password,
      userName: nickname || email.split('@')[0],
      ...clientMeta,
    });
  },

  updateTier: (tier: 'FREE' | 'PRO' | 'ULTIMATE'): Promise<ApiResponse<UserProfile>> => {
    return apiRequest('/api/v1/users/tier', 'POST', { tier });
  },
};
