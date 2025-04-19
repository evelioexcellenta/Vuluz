import { format } from 'date-fns';
import { ArrowUpIcon, ArrowDownIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Transaction, TransactionType } from '../../types/transaction';
import Card from '../common/Card';

interface ActivityFeedProps {
  transactions: Transaction[];
  limit?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  transactions, 
  limit = 5 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };
  
  const limitedTransactions = transactions.slice(0, limit);
  
  return (
    <Card title="Recent Activity" className="h-full">
      <div className="space-y-4">
        {limitedTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent transactions</p>
        ) : (
          limitedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <div className={`
                rounded-full p-2 mr-3
                ${transaction.type === TransactionType.TOP_UP 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-primary-100 text-primary-600'}
              `}>
                {transaction.type === TransactionType.TOP_UP 
                  ? <ArrowDownIcon className="h-5 w-5" /> 
                  : <ArrowUpIcon className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === TransactionType.TOP_UP 
                        ? `Top up from ${transaction.source}` 
                        : `Transfer to ${transaction.recipient}`}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                  <p className={`font-medium 
                    ${transaction.type === TransactionType.TOP_UP 
                      ? 'text-green-600' 
                      : 'text-red-600'}
                  `}>
                    {transaction.type === TransactionType.TOP_UP 
                      ? `+${formatCurrency(transaction.amount)}` 
                      : `-${formatCurrency(transaction.amount)}`}
                  </p>
                </div>
                {transaction.description && (
                  <p className="text-sm text-gray-500 mt-1">{transaction.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <Link 
        to="/transactions" 
        className="flex items-center justify-center mt-6 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        View All Transactions
        <ArrowRight size={16} className="ml-2" />
      </Link>
    </Card>
  );
};

export default ActivityFeed;