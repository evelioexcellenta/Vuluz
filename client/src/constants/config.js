export const APP_CONFIG = {
  APP_NAME: 'Vuluz',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  CURRENCY: 'IDR',
  PAGINATION_SIZE: 10,
  DATE_FORMAT: 'MMM DD, YYYY',
  TIME_FORMAT: 'hh:mm A',
  TRANSACTION_TYPES: {
    TRANSFER_IN: 'TRANSFER_IN',
    TRANSFER_OUT: 'TRANSFER_OUT',
    TOP_UP: 'TOP_UP',
    PAYMENT: 'PAYMENT',
    REFUND: 'REFUND'
  },
  PAYMENT_METHODS: [
    { id: 'credit-card', name: 'Credit Card' },
    { id: 'debit-card', name: 'Debit Card' },
    { id: 'bank-transfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' }
  ],
  GENDER:[
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
  ]
};