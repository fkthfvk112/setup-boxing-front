import { apiRequest } from './client';
import { ApiResponse } from './types';

export interface CreateInquiryRequest {
  title: string;
  content: string;
  userEmail?: string;
  userName?: string;
}

export interface InquiryResponse {
  id: number;
  userId: string;
  userEmail?: string;
  userName?: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export const inquiryApi = {
  submitInquiry: async (data: CreateInquiryRequest): Promise<ApiResponse<InquiryResponse>> => {
    return apiRequest<InquiryResponse>('/api/v1/inquiries', 'POST', data);
  },
  getMyInquiries: async (): Promise<ApiResponse<InquiryResponse[]>> => {
    return apiRequest<InquiryResponse[]>('/api/v1/inquiries/my', 'GET');
  },
};
