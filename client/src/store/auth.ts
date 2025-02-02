import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import { apiClient } from '@/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Default users for development
const DEFAULT_USERS = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN' as const,
  },
  member: {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'MEMBER' as const,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        // For development, check against default users
        const adminUser = DEFAULT_USERS.admin;
        const memberUser = DEFAULT_USERS.member;

        if (email === adminUser.email && password === adminUser.password) {
          const { password: _, ...user } = adminUser;
          set({ user, isAuthenticated: true });
          return;
        }

        if (email === memberUser.email && password === memberUser.password) {
          const { password: _, ...user } = memberUser;
          set({ user, isAuthenticated: true });
          return;
        }

        throw new Error('Invalid credentials');
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.post<AuthResponse>('/auth/register', userData);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('token', response.token);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);