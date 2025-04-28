import { create } from 'zustand';
import {
  Transaction,
  Recipient,
  PaymentMethod,
  TransactionSummary,
} from '@/types';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

interface WalletState {
  balance: number;
  transactions: Transaction[];
  recipients: Recipient[];
  paymentMethods: PaymentMethod[];
  transactionSummary: TransactionSummary;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTransactions: (params?: {
    search?: string;
    sortOrder?: string;
    transactionType?: string;
  }) => Promise<void>;
  fetchRecipients: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  topUp: (
    amount: number,
    paymentMethodName: string,
    pin: string,
    description?: string
  ) => Promise<boolean>;
  transfer: (
    recipientAccount: string,
    amount: number,
    pin: string,
    description?: string
  ) => Promise<boolean>;
  addFavorite: (name: string, accountNumber: string) => Promise<boolean>;
  removeFavorite: (id: string) => Promise<boolean>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 15782259,
  transactions: [],
  recipients: [],
  paymentMethods: [],
  transactionSummary: {
    topup: 10500000,
    transfer: 5750000,
    expense: 1150000,
  },
  isLoading: false,
  error: null,

  fetchTransactions: async (params?: {
    search?: string;
    sortOrder?: string;
    transactionType?: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().getAccessToken();

      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.transactionType && params.transactionType !== 'all')
        queryParams.append('transactionType', params.transactionType);

      const response = await axios.get(
        `http://localhost:8080/api/history?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backendTransactions = response.data;

      const transactions: Transaction[] = backendTransactions.map(
        (tx: any) => ({
          id: tx.id.toString(),
          type: tx.transactionType,
          amount: Number(tx.amount),
          date: new Date(tx.transactionDate).toISOString().split('T')[0],
          senderName: tx.amount >= 0 ? tx.account : undefined,
          recipientName: tx.transactionType !== 'Top Up' ? tx.account : undefined,
          description: tx.description,
          status: 'completed',
        })
      );

      set({ transactions, isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({
        error: error.response?.data?.message || 'Failed to fetch transactions',
        isLoading: false,
      });
    }
  },

  fetchRecipients: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().getAccessToken();
      const response = await axios.get(
        'http://localhost:8080/api/getfavorites',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'Success') {
        const favorites = response.data.data;

        const recipients: Recipient[] = favorites.map((fav: any) => ({
          id: fav.id.toString(),
          name: fav.ownerName,
          accountNumber: fav.walletNumber.toString(),
          isFavorite: true,
        }));

        set({ recipients, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch favorites',
        isLoading: false,
      });
    }
  },

  fetchPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock payment methods data
      const paymentMethods: PaymentMethod[] = [
        {
          id: '1',
          name: 'Credit Card',
          type: 'card',
        },
        {
          id: '2',
          name: 'Bank Transfer',
          type: 'bank',
        },
        {
          id: '3',
          name: 'Digital Wallet',
          type: 'ewallet',
        },
      ];

      set({ paymentMethods, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch payment methods', isLoading: false });
    }
  },

  topUp: async (amount, paymentMethodName, pin, description) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().getAccessToken();

      const response = await axios.post(
        'http://localhost:8080/api/topup',
        {
          amount: amount,
          paymentMethod: paymentMethodName,
          pin: pin, // TODO: PIN harus dari user input! Bukan hardcode
          description: description || 'Top up',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'Success') {
        const newBalance = get().balance + amount;

        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'Top Up', // <--- harus dari pilihan yang valid
          amount,
          date: new Date().toISOString().split('T')[0],
          description: description || 'Top Up',
          status: 'completed',
        };

        set((state) => ({
          balance: newBalance,
          transactions: [newTransaction, ...state.transactions],
          isLoading: false,
        }));

        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Top up failed',
        isLoading: false,
      });
      return false;
    }
  },

  transfer: async (recipientAccount, amount, description, pin) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().getAccessToken();

      const response = await axios.post(
        'http://localhost:8080/api/transfer',
        {
          toWalletNumber: Number(recipientAccount),
          amount: amount,
          notes: description || 'Transfer',
          pin: pin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'Success') {
        const newBalance = get().balance - amount;

        set((state) => ({
          balance: newBalance,
          transactions: [
            {
              id: Date.now().toString(),
              type: 'Transfer Out',
              amount,
              date: new Date().toISOString().split('T')[0],
              recipientName: 'Unknown',
              recipientAccount,
              description: description || 'Transfer',
              status: 'completed',
            },
            ...state.transactions,
          ],
          isLoading: false,
        }));

        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Transfer failed',
        isLoading: false,
      });
      return false;
    }
  },

  addFavorite: async (name, accountNumber) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().getAccessToken();
      const response = await axios.post(
        'http://localhost:8080/api/favorite',
        {
          walletNumber: Number(accountNumber),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'Success') {
        const newRecipient: Recipient = {
          id: Date.now().toString(), // Temp id
          name,
          accountNumber,
          isFavorite: true,
        };

        set((state) => ({
          recipients: [...state.recipients, newRecipient],
          isLoading: false,
        }));

        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add favorite',
        isLoading: false,
      });
      return false;
    }
  },

  removeFavorite: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().getAccessToken();

      const favorite = get().recipients.find((fav) => fav.id === id);
      if (!favorite) throw new Error('Favorite not found');

      await axios.delete(`http://localhost:8080/api/favorite/delete`, {
        params: { walletNumber: favorite.accountNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        recipients: state.recipients.filter((recipient) => recipient.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove favorite',
        isLoading: false,
      });
      return false;
    }
  },
}));
