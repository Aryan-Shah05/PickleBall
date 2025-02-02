import { create } from 'zustand';
import { Payment, PaymentStatus } from '@/types';
import apiClient from '@/api/client';

interface PaymentState {
  payments: Payment[];
  selectedPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  processPayment: (paymentData: ProcessPaymentData) => Promise<Payment>;
  requestRefund: (paymentId: string) => Promise<void>;
  setSelectedPayment: (payment: Payment | null) => void;
  clearError: () => void;
}

interface ProcessPaymentData {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  paymentMethodId?: string;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  selectedPayment: null,
  isLoading: false,
  error: null,

  fetchPayments: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<{ data: { payments: Payment[] } }>('/api/v1/payments');
      set({ payments: response.data.data.payments, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        isLoading: false,
      });
    }
  },

  processPayment: async (paymentData: ProcessPaymentData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post<{ data: { payment: Payment } }>('/api/v1/payments/process', paymentData);
      const payment = response.data.data.payment;
      set((state) => ({
        payments: [...state.payments, payment],
        isLoading: false,
      }));
      return payment;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Payment processing failed',
        isLoading: false,
      });
      throw error;
    }
  },

  requestRefund: async (paymentId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post(`/api/v1/payments/${paymentId}/refund`);
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: PaymentStatus.REFUNDED }
            : payment
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Refund request failed',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedPayment: (payment: Payment | null) => set({ selectedPayment: payment }),
  clearError: () => set({ error: null }),
})); 