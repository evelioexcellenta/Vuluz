import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';

// Types
export type Transaction = {
  id: string;
  amount: number;
  type: 'transfer' | 'topup' | 'withdraw';
  recipientId?: string;
  recipientName?: string;
  senderId?: string;
  senderName?: string;
  note?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
};

export type WalletState = {
  balance: number;
  isBalanceHidden: boolean;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  monthlyStats: {
    income: number;
    expenses: number;
    saved: number;
  };
};

interface WalletContextType extends WalletState {
  toggleBalanceVisibility: () => void;
  fetchTransactions: (limit?: number, offset?: number) => Promise<void>;
  transferMoney: (
    recipientId: string,
    amount: number,
    note?: string
  ) => Promise<void>;
  topUp: (amount: number, method: string) => Promise<void>;
  searchTransactions: (query: string) => Promise<Transaction[]>;
  filterTransactions: (type: Transaction['type'] | 'all') => Promise<Transaction[]>;
  clearError: () => void;
}

// Default context value
export const WalletContext = createContext<WalletContextType>({
  balance: 0,
  isBalanceHidden: false,
  transactions: [],
  isLoading: false,
  error: null,
  monthlyStats: {
    income: 0,
    expenses: 0,
    saved: 0,
  },
  toggleBalanceVisibility: () => {},
  fetchTransactions: async () => {},
  transferMoney: async () => {},
  topUp: async () => {},
  searchTransactions: async () => [],
  filterTransactions: async () => [],
  clearError: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { token, isAuthenticated } = useAuth();
  
  const [state, setState] = useState<WalletState>({
    balance: 0,
    isBalanceHidden: false,
    transactions: [],
    isLoading: false,
    error: null,
    monthlyStats: {
      income: 0,
      expenses: 0,
      saved: 0,
    },
  });

  // Load initial wallet data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWalletData();
    }
  }, [isAuthenticated, token]);

  // Load balance visibility preference
  useEffect(() => {
    const loadBalanceVisibility = async () => {
      try {
        const value = await AsyncStorage.getItem('isBalanceHidden');
        if (value !== null) {
          setState(prev => ({ ...prev, isBalanceHidden: value === 'true' }));
        }
      } catch (error) {
        console.error('Failed to load balance visibility setting', error);
      }
    };

    loadBalanceVisibility();
  }, []);

  const fetchWalletData = async () => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get wallet balance
      const balance = await api.getWalletBalance(token);
      
      // Get recent transactions
      const transactions = await api.getTransactions(token, 10, 0);
      
      // Get monthly stats
      const monthlyStats = await api.getMonthlyStats(token);
      
      setState({
        balance,
        isBalanceHidden: state.isBalanceHidden,
        transactions,
        isLoading: false,
        error: null,
        monthlyStats,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallet data',
      }));
    }
  };

  const toggleBalanceVisibility = async () => {
    const newValue = !state.isBalanceHidden;
    setState(prev => ({ ...prev, isBalanceHidden: newValue }));
    
    try {
      await AsyncStorage.setItem('isBalanceHidden', newValue.toString());
    } catch (error) {
      console.error('Failed to save balance visibility setting', error);
    }
  };

  const fetchTransactions = async (limit = 10, offset = 0) => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const transactions = await api.getTransactions(token, limit, offset);
      
      // If offset is 0, replace transactions, otherwise append
      setState(prev => ({
        ...prev,
        transactions: offset === 0 ? transactions : [...prev.transactions, ...transactions],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
      }));
    }
  };

  const transferMoney = async (recipientId: string, amount: number, note?: string) => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Call API to transfer money
      await api.transferMoney(token, recipientId, amount, note);
      
      // Refresh wallet data
      await fetchWalletData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to transfer money',
      }));
      throw error;
    }
  };

  const topUp = async (amount: number, method: string) => {
    if (!token) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Call API to top up wallet
      await api.topUpWallet(token, amount, method);
      
      // Refresh wallet data
      await fetchWalletData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to top up wallet',
      }));
      throw error;
    }
  };

  const searchTransactions = async (query: string): Promise<Transaction[]> => {
    if (!token) return [];
    
    try {
      return await api.searchTransactions(token, query);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to search transactions',
      }));
      return [];
    }
  };

  const filterTransactions = async (type: Transaction['type'] | 'all'): Promise<Transaction[]> => {
    if (!token) return [];
    
    try {
      return await api.filterTransactions(token, type);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to filter transactions',
      }));
      return [];
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <WalletContext.Provider
      value={{
        ...state,
        toggleBalanceVisibility,
        fetchTransactions,
        transferMoney,
        topUp,
        searchTransactions,
        filterTransactions,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};