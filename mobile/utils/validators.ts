export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateAccountNumber = (accountNumber: string): boolean => {
  const numberRegex = /^\d+$/;
  return numberRegex.test(accountNumber) && accountNumber.length >= 8;
};

export const validateAmount = (amount: string): boolean => {
  const amountValue = parseFloat(amount.replace(/[^0-9]/g, ''));
  return !isNaN(amountValue) && amountValue > 0;
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};