import { create } from 'zustand';
import { Court } from '@/types';
import apiClient from '@/api/client';

interface CourtState {
  courts: Court[];
  selectedCourt: Court | null;
  isLoading: boolean;
  error: string | null;
  fetchCourts: () => Promise<void>;
  fetchCourtAvailability: (courtId: string, date: string) => Promise<TimeSlot[]>;
  setSelectedCourt: (court: Court | null) => void;
  clearError: () => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export const useCourtStore = create<CourtState>((set) => ({
  courts: [],
  selectedCourt: null,
  isLoading: false,
  error: null,

  fetchCourts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<{ data: { courts: Court[] } }>('/api/v1/courts');
      set({ courts: response.data.data.courts, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch courts',
        isLoading: false,
      });
    }
  },

  fetchCourtAvailability: async (courtId: string, date: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<{ data: { timeSlots: TimeSlot[] } }>(
        `/api/v1/courts/${courtId}/availability?date=${date}`
      );
      set({ isLoading: false });
      return response.data.data.timeSlots;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch availability',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedCourt: (court: Court | null) => set({ selectedCourt: court }),
  clearError: () => set({ error: null }),
})); 