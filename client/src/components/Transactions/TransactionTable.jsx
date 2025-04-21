import { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../UI/Table';
import Pagination from '../UI/Pagination';
import { formatDate, formatCurrency, getTransactionTypeLabel, getTransactionBadgeClass } from '../../utils/formatters';

const TransactionTable = ({ 
  transactions = [], 
  isLoading = false,
  onViewTransaction = null, 
  itemsPerPage = 10,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Compute total pages
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  // Get current transactions based on pagination
  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Define table columns
  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (row) => formatDate(row.date)
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <span className={`badge ${getTransactionBadgeClass(row.type)}`}>
          {getTransactionTypeLabel(row.type)}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true
    },
    {
      key: 'account',
      label: 'Account',
      sortable: true
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => {
        const isPositive = ['TRANSFER_IN', 'TOP_UP', 'REFUND'].includes(row.type);
        return (
          <span className={isPositive ? 'text-accent-600' : 'text-error-600'}>
            {isPositive ? '+' : '-'}{formatCurrency(row.amount)}
          </span>
        );
      }
    }
  ];
  
  return (
    <div className={className}>
      <Table
        columns={columns}
        data={currentTransactions}
        isLoading={isLoading}
        onRowClick={onViewTransaction}
        sortable={true}
        emptyMessage="No transactions found."
      />
      
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes.array,
  isLoading: PropTypes.bool,
  onViewTransaction: PropTypes.func,
  itemsPerPage: PropTypes.number,
  className: PropTypes.string
};

export default TransactionTable;