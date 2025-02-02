import { create } from 'zustand';
import { Booking, BookingStatus } from '../types';
import api from '../api/client';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
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

  fetchBookings: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/bookings');
      set({ bookings: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch bookings', isLoading: false });
    }
  },

  createBooking: async (bookingData: CreateBookingData) => {
    try {
      set({ isLoading: true, error: null });
      const booking = await api.post('/bookings', bookingData);
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
      set({ isLoading: true });
      await api.patch(`/bookings/${bookingId}/cancel`);
      
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: BookingStatus.CANCELLED }
            : booking
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to cancel booking', isLoading: false });
    }
  },

  setSelectedBooking: (booking: Booking | null) => set({ selectedBooking: booking }),
  clearError: () => set({ error: null }),
})); 