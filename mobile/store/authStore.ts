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
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password,
      });
  
      if (response.data.status === 'OK') {
        const token = response.data.token;
  
        // Simpan token kalau perlu nanti
        // localStorage.setItem('token', token); // tidak jalan di React Native, kita pakai AsyncStorage nanti kalau mau
  
        set({
          isAuthenticated: true,
          user: {
            id: '',           // sementara kosong, nanti setelah get profile bisa diisi
            name: '',         // bisa juga fetch nama user
            email: email,
            accountNumber: '',
            balance: 0,
            phoneNumber: '',
          },
          isLoading: false,
        });
  
        console.log('Login Success, token:', token);
      } else {
        set({ error: response.data.message || 'Login failed', isLoading: false });
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
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

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));