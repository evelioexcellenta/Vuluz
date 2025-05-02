import { useEffect, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "../../components/Layout/AppLayout";
import BalanceCard from "../../components/Dashboard/BalanceCard";
import TransactionSummary from "../../components/Dashboard/TransactionSummary";
import CashFlowChart from "../../components/Dashboard/CashFlowChart";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { TransactionContext } from "../../contexts/TransactionContext";

const Dashboard = () => {
  // ▶ Semua hooks dipanggil langsung
  const { user, isAuthenticated } = useAuth();
  const { reloadAllData } = useContext(TransactionContext);
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to copy account number to clipboard
  const copyAccountNumber = () => {
    if (user && user.walletNumber) {
      navigator.clipboard
        .writeText(user.walletNumber.toString())
        .then(() => {
          // Show success message
          setCopySuccess(true);

          // Hide success message after 2 seconds
          setTimeout(() => {
            setCopySuccess(false);
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  // ▶ Panggil reloadAllData hanya sekali saat Dashboard pertama kali mount
  useEffect(() => {
    if (isAuthenticated && user) {
      reloadAllData();
    }
    // Hanya sekali, jadi kita disable exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ▶ Protect route: jika belum login, redirect ke login
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-poppins">
          Welcome back, {user.fullName}!
        </h1>
        <p className="text-gray-600 font-poppins">
          Here's your financial overview on {user.walletName}
        </p>
      </div>

      <div className="space-y-6">
        {/* Balance + Account Number */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 font-poppins">
                Account Number
              </p>
              <div className="flex items-center mt-1 relative">
                <p className="text-lg font-medium text-gray-800 font-poppins">
                  {user.walletNumber}
                </p>
                <button
                  onClick={copyAccountNumber}
                  aria-label="Copy account number"
                  className="ml-2 text-primary hover:text-primary-700 focus:outline-none"
                >
                  {/* SVG icon copy */}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 
                         12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 
                         2 0 002 2z"
                    />
                  </svg>
                </button>

                {/* Copy success tooltip */}
                {copySuccess && (
                  <div className="absolute left-0 -bottom-8 bg-green-100 text-green-800 text-xs px-2 py-1 rounded shadow-sm">
                    Copied to clipboard!
                  </div>
                )}
              </div>
            </div>

            {/* Balance Card */}
            <BalanceCard />
          </div>

          {/* Cash Flow Chart */}
          <div className="col-span-1 lg:col-span-2">
            <CashFlowChart />
          </div>
        </div>

        {/* Transaction Summary */}
        <TransactionSummary />

        {/* Recent Transactions */}
        <RecentTransactions
          limit={5}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
