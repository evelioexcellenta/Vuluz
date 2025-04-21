import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import { ROUTES } from '../../constants/routes';
import useTransactions from '../../hooks/useTransactions';
import { formatDate, formatCurrency, getTransactionTypeLabel, getTransactionColorClass, getTransactionBadgeClass } from '../../utils/formatters';
import Button from '../UI/Button';

const RecentTransactions = ({ limit = 5, className = '' }) => {
  const { transactions, isLoading } = useTransactions();
  
  // Get limited number of most recent transactions
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, limit);
  }, [transactions, limit]);
  
  return (
    <Card className={`animate-fade-in ${className}`}>
      <Card.Header 
        title="Recent Transactions" 
        className="flex justify-between items-center"
      >
        <Link to={ROUTES.TRANSACTIONS} className="text-sm text-primary-600 hover:text-primary-800">
          View all
        </Link>
      </Card.Header>
      <Card.Body className="p-0">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ) : recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="transition hover:bg-gray-50">
                <div className="px-6 py-4 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${getTransactionBadgeClass(transaction.type).replace('badge-', 'bg-').replace('green', 'accent-100').replace('red', 'error-100').replace('blue', 'primary-100')}`}>
                      {transaction.type === 'TRANSFER_IN' && (
                        <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      )}
                      {transaction.type === 'TRANSFER_OUT' && (
                        <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {transaction.type === 'TOP_UP' && (
                        <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      {transaction.type === 'PAYMENT' && (
                        <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      {transaction.type === 'REFUND' && (
                        <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        <span>{formatDate(transaction.date)}</span>
                        <span className="mx-1">•</span>
                        <span className="inline-flex items-center">
                          <span className={`badge ${getTransactionBadgeClass(transaction.type)} mr-1`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className={`text-right ${getTransactionColorClass(transaction.type)}`}>
                    <p className="text-sm font-semibold">
                      {transaction.type === 'TRANSFER_IN' || transaction.type === 'TOP_UP' || transaction.type === 'REFUND' 
                        ? '+' 
                        : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.account}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No transactions yet</p>
            <div className="mt-4">
              <Link to={ROUTES.TOP_UP}>
                <Button variant="primary" size="sm">Add funds</Button>
              </Link>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

RecentTransactions.propTypes = {
  limit: PropTypes.number,
  className: PropTypes.string
};

export default RecentTransactions;