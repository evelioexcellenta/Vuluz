import { useMemo } from 'react';
import useTransactions from './useTransactions';
import { formatCurrency } from '../utils/formatters';
import useAuth from './useAuth';

/**
 * Custom hook for balance-related operations
 * @returns {Object} Balance data and operations
 */
const useBalance = () => {
  const {user} = useAuth();
  const { balance, isLoading, error, summary } = useTransactions();
  
  // Calculate formatted values
  const formattedBalance = useMemo(() => 
    formatCurrency(user?.walletBalance || 0), [user?.walletBalance]);
  
  
  const formattedMonthlyTopUps = useMemo(() => 
    summary?.monthlyTopUps ? formatCurrency(summary.monthlyTopUps) : 'Rp 0.00',
    [summary]);
  
  const formattedMonthlyTransfersOut = useMemo(() => 
    summary?.monthlyTransfersOut ? formatCurrency(summary.monthlyTransfersOut) : 'Rp 0.00',
    [summary]);
  
  const formattedMonthlyExpenses = useMemo(() => 
    summary?.monthlyExpenses ? formatCurrency(summary.monthlyExpenses) : 'Rp 0.00',
    [summary]);
  
  const balanceChangePercent = useMemo(() => {
    if (!summary?.previousMonthBalance || summary.previousMonthBalance === 0) return 0;
    return ((summary.balanceChange / summary.previousMonthBalance) * 100).toFixed(1);
  }, [summary]);
  
  return {
    balance,
    formattedBalance,
    formattedMonthlyTopUps,
    formattedMonthlyTransfersOut,
    formattedMonthlyExpenses,
    balanceChangePercent,
    summary,
    isLoading,
    error
  };
};

export default useBalance;