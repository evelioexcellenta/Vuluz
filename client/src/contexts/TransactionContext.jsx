import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { transactionAPI, mockAPI } from "../utils/api";
import { APP_CONFIG } from "../constants/config";
import useAuth from "../hooks/useAuth";

// Create the transaction context
export const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Load balance and recent transactions on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, fetch from API
        // For demo, we'll use mock data
        console.log("User balance:", user?.balance);
        setBalance(user?.balance || 0);
        setTransactions(mockAPI.transactions);
        setFilteredTransactions(mockAPI.transactions);
        setSummary(mockAPI.summary);
      } catch (err) {
        setError(err.message || "Failed to load transaction data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters when filters state changes
  useEffect(() => {
    if (transactions.length === 0) return;

    let result = [...transactions];

    // Filter by transaction type
    if (filters.type) {
      result = result.filter((tx) => tx.type === filters.type);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((tx) => new Date(tx.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((tx) => new Date(tx.date) <= toDate);
    }

    // Filter by search term (description or account)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchTerm) ||
          tx.account.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredTransactions(result);
  }, [filters, transactions]);

  // Get specific transaction by ID
  const getTransaction = (id) => {
    return transactions.find((tx) => tx.id === id) || null;
  };

  // Create a transfer transaction
  const createTransfer = async (transferData) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, send to API
      // For demo, simulate a server response
      const newTransaction = await new Promise((resolve) => {
        setTimeout(() => {
          const tx = {
            id: `tx_${Date.now()}`,
            type: APP_CONFIG.TRANSACTION_TYPES.TRANSFER_OUT,
            amount: Number(transferData.amount),
            date: new Date(),
            description:
              transferData.description ||
              `Transfer to ${transferData.recipient}`,
            account: transferData.recipient,
            accountId: transferData.accountId || `acc_${Date.now()}`,
          };

          resolve(tx);
        }, 1000);
      });

      // Update state with new transaction
      setTransactions((prev) => [newTransaction, ...prev]);
      setBalance((prev) => prev - Number(transferData.amount));

      return { success: true, transaction: newTransaction };
    } catch (err) {
      setError(err.message || "Transfer failed. Please try again.");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Create a top-up transaction
  const createTopUp = async (topUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, send to API
      // For demo, simulate a server response
      const newTransaction = await new Promise((resolve) => {
        setTimeout(() => {
          const tx = {
            id: `tx_${Date.now()}`,
            type: APP_CONFIG.TRANSACTION_TYPES.TOP_UP,
            amount: Number(topUpData.amount),
            date: new Date(),
            description:
              topUpData.description || `Top-up via ${topUpData.method}`,
            account: topUpData.method,
            accountId: null,
          };

          resolve(tx);
        }, 1000);
      });

      // Update state with new transaction
      setTransactions((prev) => [newTransaction, ...prev]);
      setBalance((prev) => prev + Number(topUpData.amount));

      return { success: true, transaction: newTransaction };
    } catch (err) {
      setError(err.message || "Top-up failed. Please try again.");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Set transaction filters
  const applyFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };

  // Context value
  const value = {
    balance,
    transactions: filteredTransactions,
    allTransactions: transactions,
    summary,
    isLoading,
    error,
    filters,
    getTransaction,
    createTransfer,
    createTopUp,
    applyFilters,
    clearFilters,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TransactionProvider;
