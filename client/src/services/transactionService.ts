import { Transaction, TransactionType, TransferData, TopUpData } from '../types/transaction';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 250.00,
    type: TransactionType.TRANSFER,
    recipient: 'Sarah Johnson',
    description: 'Rent payment',
    status: 'completed',
    date: new Date('2023-04-28T09:24:00').toISOString(),
  },
  {
    id: 't2',
    amount: 1000.00,
    type: TransactionType.TOP_UP,
    source: 'Bank Account',
    description: 'Monthly deposit',
    status: 'completed',
    date: new Date('2023-04-25T14:55:00').toISOString(),
  },
  {
    id: 't3',
    amount: 75.50,
    type: TransactionType.TRANSFER,
    recipient: 'Coffee Shop',
    description: 'Team lunch',
    status: 'completed',
    date: new Date('2023-04-22T12:30:00').toISOString(),
  },
  {
    id: 't4',
    amount: 500.00,
    type: TransactionType.TOP_UP,
    source: 'Credit Card',
    description: 'Emergency fund',
    status: 'completed',
    date: new Date('2023-04-20T17:12:00').toISOString(),
  },
  {
    id: 't5',
    amount: 120.75,
    type: TransactionType.TRANSFER,
    recipient: 'Grocery Store',
    description: 'Weekly groceries',
    status: 'completed',
    date: new Date('2023-04-18T10:45:00').toISOString(),
  },
];

export const getTransactions = async (
  page = 1,
  limit = 10,
  filters?: { 
    dateRange?: { start: Date; end: Date };
    type?: TransactionType;
    amountRange?: { min: number; max: number };
  }
): Promise<{ transactions: Transaction[]; total: number }> => {
  await delay(800); // Simulate API call

  let filteredTransactions = [...mockTransactions];
  
  // Apply filters if provided
  if (filters) {
    if (filters.dateRange) {
      filteredTransactions = filteredTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= filters.dateRange!.start && txDate <= filters.dateRange!.end;
      });
    }
    
    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(tx => tx.type === filters.type);
    }
    
    if (filters.amountRange) {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.amount >= filters.amountRange!.min && tx.amount <= filters.amountRange!.max
      );
    }
  }
  
  // Sort by date (newest first)
  filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit);
  
  return {
    transactions: paginatedTransactions,
    total: filteredTransactions.length,
  };
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  await delay(500); // Simulate API call
  
  const transaction = mockTransactions.find(tx => tx.id === id);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return transaction;
};

export const createTransfer = async (transferData: TransferData): Promise<Transaction> => {
  await delay(1200); // Simulate API call
  
  // In a real app, this would create a transaction in the database
  const newTransaction: Transaction = {
    id: `t${mockTransactions.length + 1}`,
    amount: transferData.amount,
    type: TransactionType.TRANSFER,
    recipient: transferData.recipient,
    description: transferData.description,
    status: 'completed',
    date: new Date().toISOString(),
  };
  
  mockTransactions.unshift(newTransaction);
  return newTransaction;
};

export const createTopUp = async (topUpData: TopUpData): Promise<Transaction> => {
  await delay(1500); // Simulate API call
  
  // In a real app, this would create a transaction in the database
  const newTransaction: Transaction = {
    id: `t${mockTransactions.length + 1}`,
    amount: topUpData.amount,
    type: TransactionType.TOP_UP,
    source: topUpData.source,
    description: topUpData.description || 'Account top-up',
    status: 'completed',
    date: new Date().toISOString(),
  };
  
  mockTransactions.unshift(newTransaction);
  return newTransaction;
};