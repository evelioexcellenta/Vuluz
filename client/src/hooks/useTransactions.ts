import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../services/transactionService';
import { Transaction, TransactionFilters } from '../types/transaction';

interface UseTransactionsOptions {
  page?: number;
  limit?: number;
  filters?: TransactionFilters;
  enabled?: boolean;
}

export const useTransactions = ({
  page = 1,
  limit = 10,
  filters,
  enabled = true
}: UseTransactionsOptions = {}) => {
  const [totalPages, setTotalPages] = useState(1);

  const query = useQuery({
    queryKey: ['transactions', page, limit, filters],
    queryFn: async () => {
      const response = await getTransactions(page, limit, filters);
      setTotalPages(Math.ceil(response.total / limit));
      return response;
    },
    enabled
  });

  return {
    transactions: query.data?.transactions ?? [],
    totalPages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};