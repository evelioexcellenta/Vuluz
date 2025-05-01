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
    sortKey: "", // Add sort key
    sortDirection: "", // Add sort direction
  });

  // Load balance and recent transactions on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [history, summaryData] = await Promise.all([
          transactionAPI.getHistory(),
          transactionAPI.getSummary(),
        ]);

        const mappedTransactions = history.map((tx) => ({
          id: tx.id,
          date: new Date(tx.transactionDate),
          type: tx.transactionType.toUpperCase().replace(" ", "_"),
          amount: tx.amount,
          description: tx.description,
          account: tx.account,
        }));

        setTransactions(mappedTransactions);
        setFilteredTransactions(mappedTransactions);

        // ✅ Update summary di sini
        setSummary({
          monthlyTopUps: summaryData.totalIncome || 0,
          monthlyTransfersOut: summaryData.totalExpense || 0,
          monthlyExpenses: summaryData.netIncome || 0,
          currentBalance: summaryData.currentBalance || 0,
          previousMonthBalance: summaryData.previousMonthBalance || 0,
          balanceChange: summaryData.balanceChange || 0,
        });
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
      const payload = {
        toWalletNumber: Number(transferData.accountNumber),
        amount: parseFloat(transferData.amount),
        notes: transferData.description || "",
        pin: transferData.pin || "",
      };

      const response = await transactionAPI.transfer(payload);

      // Optional: refresh transactions/balance after successful transfer
      // e.g., await loadData();

      return { success: response.status === "Success", data: response };
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
      // const response = await transactionAPI.topUp({
      //   amount: topUpData.amount,
      //   paymentMethod: topUpData.paymentMethod,
      //   description: topUpData.description,
      // });

      return { success: true };
    } catch (err) {
      setError(err.message || "Top-up failed. Please try again.");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Load balance and recent transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  // New function to load transactions with all params
  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create the sort parameter based on key and direction
      const sortParam =
        filters.sortKey && filters.sortDirection
          ? `${filters.sortKey}_${filters.sortDirection}`
          : "";

      const params = {
        transactionType: filters.type,
        fromDate: filters.dateFrom,
        toDate: filters.dateTo,
        search: filters.search,
        sortOrder: sortParam,
      };

      // Filter out empty values
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );

      const response = await transactionAPI.getHistory(params);

      const mappedTransactions = response.map((tx) => ({
        id: tx.id,
        date: new Date(tx.transactionDate),
        type: tx.transactionType.toUpperCase().replace(" ", "_"),
        amount: tx.amount,
        description: tx.description,
        account: tx.account,
      }));

      setTransactions(mappedTransactions);
      setFilteredTransactions(mappedTransactions);
    } catch (err) {
      setError(err.message || "Failed to load transaction data");
    } finally {
      setIsLoading(false);
    }
  };

  // Set transaction filters
  // Apply filters should now trigger a reload from the API
  const applyFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Reload data with new filters
    loadTransactions();
  };

  // Change sort function to call the backend
  const applySort = (key, direction) => {
    setFilters((prev) => ({
      ...prev,
      sortKey: key,
      sortDirection: direction,
    }));

    // Reload data with new sort
    loadTransactions();
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
    applySort,
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
