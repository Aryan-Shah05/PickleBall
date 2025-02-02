import api from './api';

export interface Court {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface CourtAvailability {
  date: string;
  availableSlots: {
    time: string;
    isAvailable: boolean;
  }[];
}

export const courtService = {
  getCourts: async () => {
    const response = await api.get('/courts');
    return response.data;
  },

  getCourtById: async (id: string) => {
    const response = await api.get(`/courts/${id}`);
    return response.data;
  },

  getCourtAvailability: async (courtId: string, date: string) => {
    const response = await api.get(`/courts/${courtId}/availability`, {
      params: { date }
    });
    return response.data;
  },

  getAvailableCourts: async (date: string, time: string) => {
    const response = await api.get('/courts/available', {
      params: { date, time }
    });
    return response.data;
  }
}; 