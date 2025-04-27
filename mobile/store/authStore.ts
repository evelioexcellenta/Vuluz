import { create } from 'zustand';
import { User } from '@/types';
import axios from 'axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    gender: String,
    username: String,
    pin: String
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      if (email === 'aufa@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          name: 'Aufa',
          email: 'aufa@example.com',
          accountNumber: '1234 5678 9120 3456',
          balance: 15782259,
          phoneNumber: '+6281234567890',
        };
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Login failed. Please try again.', isLoading: false });
    }
  },

  register: async (name, email, password, gender,username, pin) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        {
          fullName: name,
          email: email,
          password: password,
          userName: username,
          gender: gender,
          pin: pin,
        }
      );

      if (response.data.status === 'OK') {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));
