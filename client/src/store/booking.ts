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

const useBookingStore = create<BookingState & BookingActions>((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/bookings');
      set({ bookings: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch bookings', isLoading: false });
    }
  },

  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),

  removeBooking: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== bookingId)
    })),
}));

export default useBookingStore; 