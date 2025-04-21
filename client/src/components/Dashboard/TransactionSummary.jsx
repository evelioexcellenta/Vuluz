import PropTypes from 'prop-types';
import Card from '../UI/Card';
import useBalance from '../../hooks/useBalance';

const TransactionSummary = ({ className = '' }) => {
  const { 
    formattedMonthlyTopUps, 
    formattedMonthlyTransfersOut, 
    formattedMonthlyExpenses,
    isLoading 
  } = useBalance();
  
  // Summary items
  const summaryItems = [
    {
      title: 'Monthly Top-ups',
      value: formattedMonthlyTopUps,
      icon: (
        <div className="p-2 rounded-full bg-accent-100 text-accent-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Monthly Transfers',
      value: formattedMonthlyTransfersOut,
      icon: (
        <div className="p-2 rounded-full bg-primary-100 text-primary-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Monthly Expenses',
      value: formattedMonthlyExpenses,
      icon: (
        <div className="p-2 rounded-full bg-error-100 text-error-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      ),
    },
  ];
  
  return (
    <Card className={`animate-fade-in ${className}`}>
      <Card.Header title="Transaction Summary" subtitle="Current month" />
      <Card.Body>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              {item.icon}
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                {isLoading ? (
                  <div className="h-6 w-24 animate-pulse bg-gray-200 rounded-md mt-1"></div>
                ) : (
                  <p className="text-lg font-medium text-gray-800">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

TransactionSummary.propTypes = {
  className: PropTypes.string
};

export default TransactionSummary;