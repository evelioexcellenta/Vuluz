import { useContext, useMemo } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

export default function useBalance() {
  const { summary, isLoading } = useContext(TransactionContext);

  const balance = summary.currentBalance || 0;
  const previous = summary.previousMonthBalance || 0;
  const monthlyTopUps = summary.monthlyTopUps || 0;
  const monthlyTransfersOut = summary.monthlyTransfersOut || 0;
  const monthlyExpenses = summary.monthlyExpenses || 0;

  const balanceChangePercent = useMemo(() => {
    if (previous === 0) return "0.00";
    return (((balance - previous) / previous) * 100).toFixed(2);
  }, [balance, previous]);

  const formatter = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formattedBalance = useMemo(() => formatter(balance), [balance]);
  const formattedMonthlyTopUps = useMemo(() => formatter(monthlyTopUps), [monthlyTopUps]);
  const formattedMonthlyTransfersOut = useMemo(
    () => formatter(monthlyTransfersOut),
    [monthlyTransfersOut]
  );
  const formattedMonthlyExpenses = useMemo(
    () => formatter(monthlyExpenses),
    [monthlyExpenses]
  );

  return {
    balance,
    formattedBalance,
    balanceChangePercent,
    isLoading,
    // untuk TransactionSummary lama
    formattedMonthlyTopUps,
    formattedMonthlyTransfersOut,
    formattedMonthlyExpenses,
  };
}