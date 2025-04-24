import { format, formatDistance } from 'date-fns';

// Format currency with local settings
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date to human-readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

// Format date and time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistance(date, new Date(), { addSuffix: true });
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// Mask account number (show only last 4 digits)
export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 4) {
    return '****';
  }
  return '•••• ' + accountNumber.slice(-4);
};

// Format name as initials
export const formatInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};