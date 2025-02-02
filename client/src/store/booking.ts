import { create } from 'zustand';
import { Booking, Court } from '@/types';
import { apiClient } from '@/api/client';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  fetchUserBookings: () => Promise<void>;
  createBooking: (bookingData: CreateBookingData) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  setSelectedBooking: (booking: Booking | null) => void;
  clearError: () => void;
}

interface CreateBookingData {
  courtId: string;
  startTime: string;
  endTime: string;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchUserBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      const bookings = await apiClient.get<Booking[]>('/bookings/user');
      set({ bookings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  createBooking: async (bookingData: CreateBookingData) => {
    try {
      set({ isLoading: true, error: null });
      const booking = await apiClient.post<Booking>('/bookings', bookingData);
      set((state) => ({
        bookings: [...state.bookings, booking],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create booking',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelBooking: async (bookingId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post(`/bookings/${bookingId}/cancel`);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'CANCELLED' }
            : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to cancel booking',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedBooking: (booking: Booking | null) => set({ selectedBooking: booking }),
  clearError: () => set({ error: null }),
})); 