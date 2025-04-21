/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation (minimum 8 characters, contains number and letter)
 * @param {string} password - Password to validate
 * @returns {boolean} Whether password is valid
 */
export const isValidPassword = (password) => {
  return password.length >= 8 && 
         /[A-Za-z]/.test(password) && 
         /[0-9]/.test(password);
};

/**
 * Account number validation (alphanumeric, dash, underscore)
 * @param {string} accountNumber - Account number to validate
 * @returns {boolean} Whether account number is valid
 */
export const isValidAccountNumber = (accountNumber) => {
  const accountRegex = /^[A-Za-z0-9_-]{6,}$/;
  return accountRegex.test(accountNumber);
};

/**
 * Amount validation (positive number, not zero)
 * @param {number|string} amount - Amount to validate
 * @returns {boolean} Whether amount is valid
 */
export const isValidAmount = (amount) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

/**
 * Check if amount is within allowed range
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum allowed amount 
 * @param {number} max - Maximum allowed amount
 * @returns {boolean} Whether amount is within range
 */
export const isAmountInRange = (amount, min, max) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount >= min && numAmount <= max;
};

/**
 * Get validation error messages
 * @returns {Object} Object containing validation error messages
 */
export const getValidationErrors = () => ({
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters and contain numbers and letters',
  accountNumber: 'Please enter a valid account number (at least 6 alphanumeric characters)',
  amount: 'Please enter a valid amount greater than zero',
  passwordMatch: 'Passwords do not match',
  minAmount: (min) => `Amount must be at least ${min}`,
  maxAmount: (max) => `Amount cannot exceed ${max}`
});