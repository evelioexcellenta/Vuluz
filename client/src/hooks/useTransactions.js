import { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import { transactionAPI } from '../utils/api';

/**
 * Custom hook to use transaction context
 * @returns {Object} Transaction context value
 */
const useTransactions = () => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }

  const createTopUp = async (topUpData) => {
    try {
      const response = await transactionAPI.topUp(topUpData);
      return { success: response.status === 'Success', data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createTransfer = context.createTransfer;

  return {
    ...context,
    createTopUp,
    createTransfer,
  };
};

export default useTransactions;