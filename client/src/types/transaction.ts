export enum TransactionType {
  TRANSFER = 'transfer',
  TOP_UP = 'top-up',
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  recipient?: string; // For TRANSFER type
  source?: string; // For TOP_UP type
}

export interface TransferData {
  recipient: string;
  amount: number;
  description?: string;
}

export interface TopUpData {
  source: string;
  amount: number;
  description?: string;
}

export interface TransactionFilters {
  dateRange?: { start: Date; end: Date };
  type?: TransactionType;
  amountRange?: { min: number; max: number };
}