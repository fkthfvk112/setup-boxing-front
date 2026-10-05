export interface ApiResponse<T = any> {
  success: boolean;
  code?: string;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  error?: any;
}
