import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/transactionService';
import { Transaction } from '../types/transaction';
import MainLayout from '../components/layout/MainLayout';
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionSummaryCard from '../components/dashboard/TransactionSummaryCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TransactionChart from '../components/dashboard/TransactionChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { transactions } = await getTransactions(1, 20);
        setTransactions(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleTopUp = () => {
    navigate('/top-up');
  };
  
  const handleTransfer = () => {
    navigate('/transfer');
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser?.firstName}!
          </h1>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <p className="font-medium text-gray-900">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-sm text-gray-500">Premium Account</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {currentUser?.firstName.charAt(0)}
              {currentUser?.lastName.charAt(0)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <BalanceCard 
            balance={currentUser?.balance || 0}
            accountNumber="1234 5678 9012 3456"
            onTopUp={handleTopUp}
            onTransfer={handleTransfer}
          />
        </div>
        <div className="lg:col-span-2">
          <TransactionChart transactions={transactions} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionSummaryCard transactions={transactions} />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed transactions={transactions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;