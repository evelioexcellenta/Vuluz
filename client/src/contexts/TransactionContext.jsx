import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { transactionAPI } from "../utils/api";
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
    sortKey: "",
    sortDirection: "",
  });

  // Fetch both history & summary
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [history, summaryData] = await Promise.all([
        transactionAPI.getHistory(),
        transactionAPI.getSummary(),
      ]);

      const mapped = history.map((tx) => ({
        id: tx.id,
        date: new Date(tx.transactionDate),
        type: tx.transactionType.toUpperCase().replace(" ", "_"),
        amount: tx.amount,
        description: tx.description,
        account: tx.account,
      }));
      setTransactions(mapped);
      setFilteredTransactions(mapped);

      setSummary({
        monthlyTopUps: summaryData.totalIncome || 0,
        monthlyTransfersOut: summaryData.totalExpense || 0,
        monthlyExpenses: summaryData.netIncome || 0,
        currentBalance: summaryData.currentBalance || 0,
        previousMonthBalance: summaryData.previousMonthBalance || 0,
        balanceChange: summaryData.balanceChange || 0,
      });
      setBalance(summaryData.currentBalance || 0);
    } catch (err) {
      setError(err.message || "Failed to load transaction data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history only (with filters & sort)
  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const history = await transactionAPI.getHistory(params);
      const mapped = history.map((tx) => ({
        id: tx.id,
        date: new Date(tx.transactionDate),
        type: tx.transactionType.toUpperCase().replace(" ", "_"),
        amount: tx.amount,
        description: tx.description,
        account: tx.account,
      }));
      setTransactions(mapped);
      setFilteredTransactions(mapped);
    } catch (err) {
      setError(err.message || "Failed to load transaction data");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to reload both in parallel
  const reloadAllData = () => Promise.all([loadData(), loadTransactions()]);

  // Initial loads (only after login)
  useEffect(() => {
    if (user) loadData();
  }, [user]);
  useEffect(() => {
    if (user) loadTransactions();
  }, [user]);

  // Client-side filtering
  useEffect(() => {
    if (!transactions.length) return;
    let result = [...transactions];
    if (filters.type) result = result.filter((tx) => tx.type === filters.type);
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter((tx) => tx.date >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((tx) => tx.date <= to);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(term) ||
          tx.account.toLowerCase().includes(term)
      );
    }
    setFilteredTransactions(result);
  }, [filters, transactions]);

  const getTransaction = (id) =>
    transactions.find((tx) => tx.id === id) || null;

  const createTransfer = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await transactionAPI.transfer({
        toWalletNumber: Number(data.accountNumber),
        amount: parseFloat(data.amount),
        notes: data.description || "",
        pin: data.pin || "",
      });
      if (resp.status === "Success" || resp.success === true) {
        await reloadAllData();
        return { success: true, data: resp };
      } else {
        return { success: false, error: resp.message || "Transfer failed" };
      }
      
      return resp;
    } catch (err) {
      setError(err.message || "Transfer failed");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const createTopUp = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await transactionAPI.topUp(data);
      if (resp.success) await reloadAllData();
      return resp;
    } catch (err) {
      setError(err.message || "Top-up failed");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    loadTransactions();
  };

  const applySort = (key, dir) => {
    setFilters((prev) => ({ ...prev, sortKey: key, sortDirection: dir }));
    loadTransactions();
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      dateFrom: "",
      dateTo: "",
      search: "",
      sortKey: "",
      sortDirection: "",
    });
    loadTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{
        balance,
        summary,
        transactions: filteredTransactions,
        allTransactions: transactions,
        isLoading,
        error,
        filters,
        getTransaction,
        createTransfer,
        createTopUp,
        applyFilters,
        applySort,
        clearFilters,
        reloadAllData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TransactionProvider;
