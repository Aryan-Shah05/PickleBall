import { create } from 'zustand';
import { Booking, BookingStatus, Court, PaymentStatus, User } from '../types';
import api from '../api/client';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
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

const useBookingStore = create<BookingState & BookingActions>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/api/v1/bookings');
      set({ bookings: response.data.data, isLoading: false });
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
      await api.patch(`/api/v1/bookings/${bookingId}/cancel`);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: BookingStatus.CANCELLED }
            : booking
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to cancel booking' });
    }
  },

  setSelectedBooking: (booking: Booking | null) => set({ selectedBooking: booking }),
  clearError: () => set({ error: null }),
}));

export default useBookingStore; 