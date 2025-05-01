import { create } from 'zustand';
import axios from 'axios';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    gender: string,
    username: string,
    pin: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      if (loginRes.data.status !== 'OK') {
        throw new Error(loginRes.data.message || 'Login failed');
      }

      const token = loginRes.data.token;
      set({ accessToken: token });

      // Fetch user profile
      const profileRes = await axios.get('http://localhost:8080/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = profileRes.data;

      set({
        user: {
          id: '', // Kalau backend tidak kirim id, kosongkan
          name: p.fullName || '',
          username: p.userName || '',
          email: p.email || '',
          accountNumber: p.walletNumber?.toString() || '',
          balance: Number(p.walletBalance) || 0,
          phoneNumber: '', // Jika tidak tersedia
        },
        isAuthenticated: true,
        isLoading: false,
      });

    } catch (error: any) {
      console.error(error);
      set({
        error: error.response?.data?.message || error.message || 'Login failed',
        isLoading: false,
      });
    }
  },

  register: async (name, email, password, gender, username, pin) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        fullName: name,
        email,
        username,
        userName: username,
        password,
        gender,
        pin,
      });

      if (res.data.status !== 'OK') {
        throw new Error(res.data.message || 'Registration failed');
      }

      set({ isAuthenticated: false, isLoading: false }); // tetap false, lanjut ke login
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Registration failed',
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
    });
  },

  updateUser: async (userData) => {
    try {
      const token = get().accessToken;
      if (!token) throw new Error('No access token');

      const res = await axios.put(
        'http://localhost:8080/api/profile',
        {
          fullName: userData.name,
          userName: userData.username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status !== 'OK') {
        throw new Error(res.data.message || 'Failed to update profile');
      }

      set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      }));
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  getAccessToken: () => {
    return get().accessToken;
  },
}));
