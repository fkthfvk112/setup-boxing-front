import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse } from './types';

const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:') {
      return '';
    }
    if (
      window.location.hostname &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      return `http://${window.location.hostname}:8081`;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBackendUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      config.baseURL = getBackendUrl();
      const token = localStorage.getItem('boxing_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const savedLang = localStorage.getItem('boxing_user_language');
      const lang = savedLang === 'en' ? 'en' : 'ko';
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<any>) => {
    const apiError: ApiError = {
      status: error.response?.status || 0,
      code: error.response?.data?.code || 'NETWORK_ERROR',
      message:
        error.response?.data?.message ||
        error.message ||
        '서버와의 통신에 실패했습니다.',
      error: error.response?.data?.error,
    };

    if (apiError.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('boxing_access_token');
      localStorage.removeItem('boxing_user');
    }

    return Promise.reject(apiError);
  }
);

export async function apiRequest<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any,
  params?: any
): Promise<ApiResponse<T>> {
  return (await axiosInstance({
    url,
    method,
    data,
    params,
  })) as unknown as ApiResponse<T>;
}
