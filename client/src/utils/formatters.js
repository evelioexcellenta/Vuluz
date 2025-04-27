import { APP_CONFIG } from '../constants/config';

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (defaults to APP_CONFIG.CURRENCY)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (typeof value !== "number") return "Rp 0"; // << cegah error di recharts
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};


/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format pattern (not used with Intl.DateTimeFormat)
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Format time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(dateObj);
};

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Get transaction type label
 * @param {string} type - Transaction type
 * @returns {string} Readable transaction type
 */
export const getTransactionTypeLabel = (type) => {
  const labels = {
    [APP_CONFIG.TRANSACTION_TYPES.TRANSFER_IN]: 'Transfer In',
    [APP_CONFIG.TRANSACTION_TYPES.TRANSFER_OUT]: 'Transfer Out',
    [APP_CONFIG.TRANSACTION_TYPES.TOP_UP]: 'Top Up',
    [APP_CONFIG.TRANSACTION_TYPES.PAYMENT]: 'Payment',
    [APP_CONFIG.TRANSACTION_TYPES.REFUND]: 'Refund'
  };
  return labels[type] || 'Transaction';
};

/**
 * Get transaction type symbol (+ or -)
 * @param {string} type - Transaction type
 * @returns {string} + for incoming, - for outgoing
 */
export const getTransactionSymbol = (type) => {
  const incoming = [
    APP_CONFIG.TRANSACTION_TYPES.TRANSFER_IN, 
    APP_CONFIG.TRANSACTION_TYPES.TOP_UP,
    APP_CONFIG.TRANSACTION_TYPES.REFUND
  ];
  return incoming.includes(type) ? '+' : '-';
};

/**
 * Get color class based on transaction type
 * @param {string} type - Transaction type
 * @returns {string} CSS class name
 */
export const getTransactionColorClass = (type) => {
  const colorMap = {
    [APP_CONFIG.TRANSACTION_TYPES.TRANSFER_IN]: 'text-accent-600',
    [APP_CONFIG.TRANSACTION_TYPES.TOP_UP]: 'text-accent-600',
    [APP_CONFIG.TRANSACTION_TYPES.REFUND]: 'text-accent-600',
    [APP_CONFIG.TRANSACTION_TYPES.TRANSFER_OUT]: 'text-error-600',
    [APP_CONFIG.TRANSACTION_TYPES.PAYMENT]: 'text-error-600'
  };
  return colorMap[type] || 'text-gray-700';
};

/**
 * Get badge class based on transaction type
 * @param {string} type - Transaction type
 * @returns {string} CSS class name
 */
export const getTransactionBadgeClass = (type) => {
  const colorMap = {
    [APP_CONFIG.TRANSACTION_TYPES.TRANSFER_IN]: 'badge-green',
    [APP_CONFIG.TRANSACTION_TYPES.TOP_UP]: 'badge-green',
    [APP_CONFIG.TRANSACTION_TYPES.REFUND]: 'badge-green',
    [APP_CONFIG.TRANSACTION_TYPES.TRANSFER_OUT]: 'badge-red',
    [APP_CONFIG.TRANSACTION_TYPES.PAYMENT]: 'badge-red'
  };
  return colorMap[type] || 'badge-blue';
};