import api from './api';

export interface BookingData {
  courtId: string;
  date: string;
  time: string;
  duration: number;
}

export interface Booking extends BookingData {
  id: string;
  userId: string;
  courtName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const bookingService = {
  createBooking: async (data: BookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  },

  getUpcomingBookings: async () => {
    const response = await api.get('/bookings/upcoming');
    return response.data;
  },

  getCompletedBookings: async () => {
    const response = await api.get('/bookings/completed');
    return response.data;
  },

  getCancelledBookings: async () => {
    const response = await api.get('/bookings/cancelled');
    return response.data;
  },
}; 