import { BanIcon as BankIcon, TrendingUpIcon } from 'lucide-react';
import { Transaction, TransactionType } from '../../types/transaction';
import Card from '../common/Card';

interface TransactionSummaryCardProps {
  transactions: Transaction[];
}

const TransactionSummaryCard: React.FC<TransactionSummaryCardProps> = ({ transactions }) => {
  const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  };
  
  const getMonthlyStats = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startOfMonth;
    });
    
    const incoming = monthlyTransactions
      .filter(tx => tx.type === TransactionType.TOP_UP)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const outgoing = monthlyTransactions
      .filter(tx => tx.type === TransactionType.TRANSFER)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    return { incoming, outgoing };
  };
  
  const { incoming, outgoing } = getMonthlyStats();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Card title={`${getCurrentMonth()} Summary`} className="h-full">
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-green-50 rounded-lg">
          <div className="rounded-full bg-green-100 p-2 mr-3">
            <TrendingUpIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Incoming</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(incoming)}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-red-50 rounded-lg">
          <div className="rounded-full bg-red-100 p-2 mr-3">
            <BankIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Outgoing</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(outgoing)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionSummaryCard;