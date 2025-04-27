import { Link } from "react-router-dom";
import AppLayout from "../../components/Layout/AppLayout";
import BalanceCard from "../../components/Dashboard/BalanceCard";
import TransactionSummary from "../../components/Dashboard/TransactionSummary";
import CashFlowChart from "../../components/Dashboard/CashFlowChart";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.fullName || "User"}!
        </h1>
        <p className="text-gray-600">Here's your financial overview on {user?.walletName}</p>
      </div>

      <div className="space-y-6">
        {/* Balance and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Account + Balance (1/3) */}
          <div className="col-span-1 space-y-6">
            {/* Account Number */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Account Number</p>
              <div className="flex items-center mt-1">
                <p className="text-lg font-medium text-gray-800">
                  {user?.walletNumber || "No Wallet"}
                </p>
                <button className="ml-2 text-primary-600 hover:text-primary-700">
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Balance Card */}
            <BalanceCard />
          </div>

          {/* Right: Chart (2/3) */}
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