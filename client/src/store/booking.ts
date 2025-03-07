import { create } from 'zustand';
import { Booking } from '@/types';
import apiClient from '@/api/client';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
  fetchBookings: () => Promise<void>;
  addBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
}

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get<{ data: { bookings: Booking[] } }>('/api/v1/bookings');
      set({ bookings: response.data.data.bookings, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch bookings', isLoading: false });
    }
  },

  addBooking: (booking: Booking) => 
    set((state) => ({ bookings: [...state.bookings, booking] })),

  removeBooking: (bookingId: string) =>
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== bookingId)
    }))
})); 