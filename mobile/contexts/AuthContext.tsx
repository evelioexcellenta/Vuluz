import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { api } from '@/utils/api';

// Types
export type User = {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: string;
};

export type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

// Default context value
export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load token from storage on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          // Verify token with the backend
          try {
            const userData = await api.getCurrentUser(token);
            setState({
              token,
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            // Token is invalid
            await AsyncStorage.removeItem('token');
            setState({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to load authentication state',
        });
      }
    };

    loadToken();
  }, []);

  // If authenticated, redirect to main app
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      router.replace('/(tabs)');
    }
  }, [state.isAuthenticated, state.isLoading]);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock login for now - in real app this would call your API
      const { token, user } = await api.login(email, password);
      
      await AsyncStorage.setItem('token', token);
      
      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      }));
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock registration - in real app this would call your API
      const { token, user } = await api.register(email, password, fullName);
      
      await AsyncStorage.setItem('token', token);
      
      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to register',
      }));
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.replace('/(auth)');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to logout',
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock password reset - in real app this would call your API
      await api.resetPassword(email);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
      
      // Navigate to login screen
      router.replace('/(auth)');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset password',
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};