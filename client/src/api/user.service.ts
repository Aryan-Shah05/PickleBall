import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    bookingReminders: boolean;
    promotionalOffers: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
    bookingReminders?: boolean;
    promotionalOffers?: boolean;
  };
}

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    localStorage.removeItem('token');
    return response.data;
  }
}; 