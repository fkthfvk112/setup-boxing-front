import { apiRequest } from './client';
import { ApiResponse } from './types';
import { UserProfile } from '../../types/combo';

export interface ProcessPaymentPayload {
  plan: 'PRO' | 'ULTIMATE';
  amount?: number;
  paymentMethod?: string;
}

export interface PaymentResponseData {
  paymentId: number;
  userId: string;
  planName: string;
  amount: number;
  status: string; // "EVENT", "SUCCESS", etc.
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedUser: UserProfile;
}

export const paymentApi = {
  processEventPayment: (payload: ProcessPaymentPayload): Promise<ApiResponse<PaymentResponseData>> => {
    return apiRequest('/api/v1/payments/event', 'POST', payload);
  },

  getMyPayments: (): Promise<ApiResponse<PaymentResponseData[]>> => {
    return apiRequest('/api/v1/payments', 'GET');
  },
};
