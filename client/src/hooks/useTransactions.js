import { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';

/**
 * Custom hook to use transaction context
 * @returns {Object} Transaction context value
 */
const useTransactions = () => {
  const context = useContext(TransactionContext);
  
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  
  return context;
};

export default useTransactions;