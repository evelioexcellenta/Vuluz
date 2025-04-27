import { create } from 'zustand';
import { Transaction, Recipient, PaymentMethod, TransactionSummary } from '@/types';

interface WalletState {
  balance: number;
  transactions: Transaction[];
  recipients: Recipient[];
  paymentMethods: PaymentMethod[];
  transactionSummary: TransactionSummary;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: () => Promise<void>;
  fetchRecipients: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  topUp: (amount: number, paymentMethodId: string, description?: string) => Promise<boolean>;
  transfer: (recipientAccount: string, amount: number, description?: string) => Promise<boolean>;
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
  
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock transactions data
      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'topup',
          amount: 150000,
          date: '2024-04-13',
          senderName: 'Hendra',
          senderAccount: '114567823',
          description: 'Monthly Bill',
          status: 'completed',
        },
        {
          id: '2',
          type: 'transfer',
          amount: 47500,
          date: '2024-04-11',
          recipientName: 'Salma',
          recipientAccount: '114516277',
          description: 'Transfer Out',
          status: 'completed',
        },
        {
          id: '3',
          type: 'topup',
          amount: 500000,
          date: '2024-04-07',
          senderName: 'Faadiyah',
          senderAccount: '114523547',
          description: 'Transfer In',
          status: 'completed',
        },
      ];
      
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', isLoading: false });
    }
  },
  
  fetchRecipients: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock recipients data
      const recipients: Recipient[] = [
        {
          id: '1',
          name: 'Hendrawan Aulia',
          accountNumber: '114567823',
          isFavorite: true,
        },
        {
          id: '2',
          name: 'Salma Mazaya',
          accountNumber: '114516277',
          isFavorite: true,
        },
        {
          id: '3',
          name: 'Faadiyah R',
          accountNumber: '114523547',
          isFavorite: true,
        },
      ];
      
      set({ recipients, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch recipients', isLoading: false });
    }
  },
  
  fetchPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
  
  topUp: async (amount, paymentMethodId, description) => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update balance
      const newBalance = get().balance + amount;
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'topup',
        amount,
        date: new Date().toISOString().split('T')[0],
        description: description || 'Top Up',
        status: 'completed',
      };
      
      set(state => ({
        balance: newBalance,
        transactions: [newTransaction, ...state.transactions],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Top up failed. Please try again.', isLoading: false });
      return false;
    }
  },
  
  transfer: async (recipientAccount, amount, description) => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find recipient
      const recipient = get().recipients.find(r => r.accountNumber === recipientAccount);
      
      // Update balance
      const newBalance = get().balance - amount;
      
      if (newBalance < 0) {
        set({ error: 'Insufficient balance', isLoading: false });
        return false;
      }
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'transfer',
        amount,
        date: new Date().toISOString().split('T')[0],
        recipientName: recipient?.name || 'Unknown',
        recipientAccount,
        description: description || 'Transfer',
        status: 'completed',
      };
      
      set(state => ({
        balance: newBalance,
        transactions: [newTransaction, ...state.transactions],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Transfer failed. Please try again.', isLoading: false });
      return false;
    }
  },
  
  addFavorite: async (name, accountNumber) => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new favorite recipient
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        name,
        accountNumber,
        isFavorite: true,
      };
      
      set(state => ({
        recipients: [...state.recipients, newRecipient],
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to add favorite. Please try again.', isLoading: false });
      return false;
    }
  },
  
  removeFavorite: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        recipients: state.recipients.filter(recipient => recipient.id !== id),
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to remove favorite. Please try again.', isLoading: false });
      return false;
    }
  },
}));