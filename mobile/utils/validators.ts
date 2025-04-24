// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }
  
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }
  
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }
  
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }
  
  return {
    isValid: true,
    message: 'Password is strong',
  };
};

// Validate transfer amount
export const validateTransferAmount = (
  amount: number,
  balance: number
): {
  isValid: boolean;
  message: string;
} => {
  if (amount <= 0) {
    return {
      isValid: false,
      message: 'Amount must be greater than 0',
    };
  }
  
  if (amount > balance) {
    return {
      isValid: false,
      message: 'Amount exceeds available balance',
    };
  }
  
  return {
    isValid: true,
    message: 'Amount is valid',
  };
};

// Validate PIN (4-digit number)
export const validatePIN = (pin: string): boolean => {
  return /^\d{4}$/.test(pin);
};

// Validate that input is a number
export const validateNumeric = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value);
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  return /^\+?\d{10,15}$/.test(phone);
};