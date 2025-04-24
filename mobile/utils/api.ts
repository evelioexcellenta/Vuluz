import { User } from '@/contexts/AuthContext';
import { Transaction } from '@/contexts/WalletContext';
import { Favorite } from '@/contexts/FavoritesContext';
import { format } from 'date-fns';

// This is a mock API implementation
// In a real app, these would be actual fetch calls to your backend

// Simulated database
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    fullName: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T08:30:00.000Z',
  },
];

const wallets = [
  {
    userId: '1',
    balance: 5230.75,
  },
];

const transactions: Transaction[] = [
  {
    id: '1',
    amount: 250,
    type: 'transfer',
    recipientId: '2',
    recipientName: 'Jane Smith',
    senderId: '1',
    senderName: 'John Doe',
    note: 'Dinner last night',
    status: 'completed',
    createdAt: '2023-05-15T14:30:00.000Z',
  },
  {
    id: '2',
    amount: 1000,
    type: 'topup',
    senderId: '1',
    senderName: 'John Doe',
    note: 'Monthly top-up',
    status: 'completed',
    createdAt: '2023-05-10T09:15:00.000Z',
  },
  {
    id: '3',
    amount: 75.50,
    type: 'transfer',
    recipientId: '3',
    recipientName: 'Coffee Shop',
    senderId: '1',
    senderName: 'John Doe',
    note: 'Coffee with team',
    status: 'completed',
    createdAt: '2023-05-08T11:45:00.000Z',
  },
  {
    id: '4',
    amount: 500,
    type: 'withdraw',
    senderId: '1',
    senderName: 'John Doe',
    status: 'completed',
    createdAt: '2023-05-05T16:20:00.000Z',
  },
  {
    id: '5',
    amount: 2000,
    type: 'topup',
    senderId: '1',
    senderName: 'John Doe',
    note: 'Salary deposit',
    status: 'completed',
    createdAt: '2023-05-01T08:30:00.000Z',
  },
];

const favorites: Favorite[] = [
  {
    id: '1',
    userId: '1',
    recipientId: '2',
    recipientName: 'Jane Smith',
    label: 'Friend',
    createdAt: '2023-04-10T08:30:00.000Z',
    lastUsed: '2023-05-15T14:30:00.000Z',
  },
  {
    id: '2',
    userId: '1',
    recipientId: '3',
    recipientName: 'Coffee Shop',
    label: 'Coffee',
    createdAt: '2023-03-05T10:15:00.000Z',
    lastUsed: '2023-05-08T11:45:00.000Z',
  },
];

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const findUserByEmail = (email: string) => users.find(u => u.email === email);

const generateToken = (userId: string) => `token_${userId}_${Date.now()}`;

// API functions
export const api = {
  // Auth API
  login: async (email: string, password: string) => {
    await delay(800); // Simulate network delay
    
    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token: generateToken(user.id),
      user: userWithoutPassword as User,
    };
  },
  
  register: async (email: string, password: string, fullName: string) => {
    await delay(1000); // Simulate network delay
    
    if (findUserByEmail(email)) {
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: String(users.length + 1),
      email,
      password,
      fullName,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    // Create wallet for new user
    wallets.push({
      userId: newUser.id,
      balance: 0,
    });
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      token: generateToken(newUser.id),
      user: userWithoutPassword as User,
    };
  },
  
  getCurrentUser: async (token: string) => {
    await delay(500); // Simulate network delay
    
    // In a real app, you would validate the token
    // Here we just parse the user ID from our mock token
    const userId = token.split('_')[1];
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword as User;
  },
  
  resetPassword: async (email: string) => {
    await delay(1000); // Simulate network delay
    
    const user = findUserByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you would send an email with a reset link
    console.log(`Password reset email sent to ${email}`);
    
    return true;
  },
  
  // Wallet API
  getWalletBalance: async (token: string) => {
    await delay(500); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    const wallet = wallets.find(w => w.userId === userId);
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    return wallet.balance;
  },
  
  getTransactions: async (token: string, limit = 10, offset = 0) => {
    await delay(700); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Filter transactions where user is sender or recipient
    const userTransactions = transactions.filter(
      t => t.senderId === userId || t.recipientId === userId
    );
    
    // Sort by date, newest first
    userTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Apply pagination
    return userTransactions.slice(offset, offset + limit);
  },
  
  getMonthlyStats: async (token: string) => {
    await delay(800); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Get current month's transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate.getMonth() === currentMonth && 
             txDate.getFullYear() === currentYear &&
             (t.senderId === userId || t.recipientId === userId);
    });
    
    // Calculate stats
    let income = 0;
    let expenses = 0;
    
    monthTransactions.forEach(t => {
      if (t.type === 'topup' || (t.type === 'transfer' && t.recipientId === userId)) {
        income += t.amount;
      } else if (t.type === 'withdraw' || (t.type === 'transfer' && t.senderId === userId)) {
        expenses += t.amount;
      }
    });
    
    return {
      income,
      expenses,
      saved: income - expenses,
    };
  },
  
  transferMoney: async (token: string, recipientId: string, amount: number, note?: string) => {
    await delay(1500); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Check if user has enough balance
    const wallet = wallets.find(w => w.userId === userId);
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Create new transaction
    const newTransaction: Transaction = {
      id: String(transactions.length + 1),
      amount,
      type: 'transfer',
      recipientId,
      recipientName: 'Recipient Name', // In a real app, you would get this from the recipient user
      senderId: userId,
      senderName: 'Sender Name', // In a real app, you would get this from the sender user
      note,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    transactions.push(newTransaction);
    
    // Update wallet balance
    wallet.balance -= amount;
    
    return newTransaction;
  },
  
  topUpWallet: async (token: string, amount: number, method: string) => {
    await delay(1200); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Find user's wallet
    const wallet = wallets.find(w => w.userId === userId);
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Create new transaction
    const newTransaction: Transaction = {
      id: String(transactions.length + 1),
      amount,
      type: 'topup',
      senderId: userId,
      senderName: 'John Doe', // In a real app, you would get this from the user
      note: `Top-up via ${method}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    transactions.push(newTransaction);
    
    // Update wallet balance
    wallet.balance += amount;
    
    return newTransaction;
  },
  
  searchTransactions: async (token: string, query: string) => {
    await delay(600); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Filter transactions where user is sender or recipient
    const userTransactions = transactions.filter(
      t => (t.senderId === userId || t.recipientId === userId) &&
           (t.recipientName?.toLowerCase().includes(query.toLowerCase()) ||
            t.note?.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Sort by date, newest first
    return userTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  
  filterTransactions: async (token: string, type: Transaction['type'] | 'all') => {
    await delay(600); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Filter transactions where user is sender or recipient
    let userTransactions = transactions.filter(
      t => t.senderId === userId || t.recipientId === userId
    );
    
    // Apply type filter if not 'all'
    if (type !== 'all') {
      userTransactions = userTransactions.filter(t => t.type === type);
    }
    
    // Sort by date, newest first
    return userTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  
  // Favorites API
  getFavorites: async (token: string) => {
    await delay(600); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Filter favorites by user ID
    return favorites.filter(f => f.userId === userId);
  },
  
  addFavorite: async (token: string, recipientId: string, recipientName: string, label?: string) => {
    await delay(800); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Check if favorite already exists
    const existingFavorite = favorites.find(
      f => f.userId === userId && f.recipientId === recipientId
    );
    
    if (existingFavorite) {
      throw new Error('Recipient is already in favorites');
    }
    
    // Create new favorite
    const newFavorite: Favorite = {
      id: String(favorites.length + 1),
      userId,
      recipientId,
      recipientName,
      label,
      createdAt: new Date().toISOString(),
    };
    
    favorites.push(newFavorite);
    
    return newFavorite;
  },
  
  updateFavorite: async (token: string, id: string, label: string) => {
    await delay(600); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Find favorite
    const favorite = favorites.find(f => f.id === id && f.userId === userId);
    
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    
    // Update label
    favorite.label = label;
    
    return favorite;
  },
  
  removeFavorite: async (token: string, id: string) => {
    await delay(700); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Find favorite index
    const favoriteIndex = favorites.findIndex(f => f.id === id && f.userId === userId);
    
    if (favoriteIndex === -1) {
      throw new Error('Favorite not found');
    }
    
    // Remove favorite
    favorites.splice(favoriteIndex, 1);
    
    return true;
  },
  
  updateFavoriteLastUsed: async (token: string, id: string) => {
    await delay(400); // Simulate network delay
    
    const userId = token.split('_')[1];
    
    // Find favorite
    const favorite = favorites.find(f => f.id === id && f.userId === userId);
    
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    
    // Update last used date
    favorite.lastUsed = new Date().toISOString();
    
    return favorite;
  },
};