import { create } from 'zustand';
import { User } from '@/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
  
      if (response.data.status === 'OK') {
        const token = response.data.token;
  
        await AsyncStorage.setItem('token', token);
  
        set({ isAuthenticated: true, isLoading: false });
  
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
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

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },  

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));
