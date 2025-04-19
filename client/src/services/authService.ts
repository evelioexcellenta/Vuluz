import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    balance: 1250.75,
    createdAt: new Date('2023-01-15').toISOString(),
  },
];

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  await delay(1000); // Simulate API call

  // In a real app, this would be an API call to validate credentials
  const { email, password } = credentials;
  
  // Simple validation for demo purposes
  if (email === 'demo@example.com' && password === 'password') {
    return {
      id: '2',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      balance: 5000.00,
      createdAt: new Date().toISOString(),
    };
  }
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, we would validate the password hash
  return user;
};

export const registerUser = async (userData: RegisterCredentials): Promise<void> => {
  await delay(1500); // Simulate API call
  
  // Check if email already exists
  if (mockUsers.some(user => user.email === userData.email)) {
    throw new Error('Email already in use');
  }
  
  // In a real app, this would create a new user in the database
  // For demo purposes, we're just simulating the API call
  console.log('Registered new user:', userData);
};

export const logoutUser = (): void => {
  // In a real app, this might involve invalidating a token on the server
  console.log('User logged out');
};