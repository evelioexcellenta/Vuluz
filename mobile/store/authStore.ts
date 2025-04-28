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
  accessToken: string | null;
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
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password,
      });

      if (response.data.status === 'OK') {
        const token = response.data.token;

        set({
          isAuthenticated: true,
          accessToken: token, // <-- simpan token di state
          user: {
            id: '',
            name: '',
            username:'',
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

  register: async (name, email, password, gender, username, pin) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        fullName: name,
        email: email,
        username: username,
        password: password,
        userName: username,
        gender: gender,
        pin: pin,
      });

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
    set({ user: null, isAuthenticated: false, accessToken: null });
  },

  updateUser: async (userData) => {
    try {
      const token = get().accessToken;
      if (!token) throw new Error('No access token');
  
      const response = await axios.put(
        'http://localhost:8080/api/profile',
        {
          fullName: userData.name,
          userName: userData.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status === 'OK') {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to update profile');
    }
  },
  

  getAccessToken: () => {
    return get().accessToken;
  },
}));
