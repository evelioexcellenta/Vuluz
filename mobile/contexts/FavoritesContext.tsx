import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';

// Types
export type Favorite = {
  id: string;
  userId: string;
  recipientId: string;
  recipientName: string;
  accountNumber?: string;
  label?: string;
  createdAt: string;
  lastUsed?: string;
};

export type FavoritesState = {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
};

interface FavoritesContextType extends FavoritesState {
  addFavorite: (recipientId: string, recipientName: string, label?: string) => Promise<void>;
  updateFavorite: (id: string, label: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  updateLastUsed: (id: string) => Promise<void>;
  clearError: () => void;
}

// Default context value
export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isLoading: false,
  error: null,
  addFavorite: async () => {},
  updateFavorite: async () => {},
  removeFavorite: async () => {},
  updateLastUsed: async () => {},
  clearError: () => {},
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { token, isAuthenticated } = useAuth();
  
  const [state, setState] = useState<FavoritesState>({
    favorites: [],
    isLoading: false,
    error: null,
  });

  // Load favorites when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavorites();
    }
  }, [isAuthenticated, token]);

  const fetchFavorites = async () => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const favorites = await api.getFavorites(token);
      
      setState({
        favorites,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorites',
      }));
    }
  };

  const addFavorite = async (recipientId: string, recipientName: string, label?: string) => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const newFavorite = await api.addFavorite(token, recipientId, recipientName, label);
      
      setState(prev => ({
        ...prev,
        favorites: [...prev.favorites, newFavorite],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add favorite',
      }));
    }
  };

  const updateFavorite = async (id: string, label: string) => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const updatedFavorite = await api.updateFavorite(token, id, label);
      
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.map(f => (f.id === id ? updatedFavorite : f)),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update favorite',
      }));
    }
  };

  const removeFavorite = async (id: string) => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await api.removeFavorite(token, id);
      
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.filter(f => f.id !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove favorite',
      }));
    }
  };

  const updateLastUsed = async (id: string) => {
    if (!token) return;
    
    try {
      await api.updateFavoriteLastUsed(token, id);
      
      // Update local state
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.map(f => 
          f.id === id ? { ...f, lastUsed: new Date().toISOString() } : f
        ),
      }));
    } catch (error) {
      console.error('Failed to update favorite last used date', error);
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <FavoritesContext.Provider
      value={{
        ...state,
        addFavorite,
        updateFavorite,
        removeFavorite,
        updateLastUsed,
        clearError,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};