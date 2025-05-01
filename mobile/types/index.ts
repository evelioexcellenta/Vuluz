export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  accountNumber: string;
  balance: number;
  phoneNumber?: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  type: 'Top Up' | 'Transfer In' | 'Transfer Out';
  amount: number;
  description?: string;
  date: string;
  recipientName?: string;
  recipientAccount?: string;
  senderName?: string;
  senderAccount?: string;
  category?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  isFavorite: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'ewallet';
  last4?: string;
  icon?: string;
}

export interface TransactionSummary {
  topup: number;
  transfer: number;
  netSaving: number; // <--- ganti dari "expense"
}
