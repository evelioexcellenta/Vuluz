import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import { Transaction, TransactionType, TransactionFilters } from '../types/transaction';
import MainLayout from '../components/layout/MainLayout';
import Table from '../components/common/Table';
import TransactionHistoryFilters from '../components/transaction/TransactionHistoryFilters';
import TransactionModal from '../components/transaction/TransactionModal';
import Button from '../components/common/Button';
import { ArrowDownIcon, ArrowUpIcon, DownloadIcon } from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const itemsPerPage = 10;
  
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filters, sortColumn, sortDirection]);
  
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { transactions: fetchedTransactions, total } = await getTransactions(
        currentPage,
        itemsPerPage,
        filters
      );
      
      // Apply client-side sorting (in a real app, this would be handled by the server)
      const sortedTransactions = [...fetchedTransactions].sort((a, b) => {
        if (sortColumn === 'date') {
          return sortDirection === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        
        if (sortColumn === 'amount') {
          return sortDirection === 'asc'
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        
        if (sortColumn === 'type') {
          return sortDirection === 'asc'
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        }
        
        return 0;
      });
      
      setTransactions(sortedTransactions);
      setTotalTransactions(total);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setFilters(undefined);
    setCurrentPage(1);
  };
  
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };
  
  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const exportTransactions = () => {
    // In a real app, this would generate a CSV or Excel file
    alert('In a real app, this would download your transaction history');
  };
  
  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (row: Transaction) => formatDate(row.date),
      width: '20%',
      sortable: true,
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: Transaction) => (
        <div className="flex items-center">
          <span className={`
            p-1 rounded-full mr-2
            ${row.type === TransactionType.TOP_UP 
              ? 'bg-green-100 text-green-600' 
              : 'bg-primary-100 text-primary-600'}
          `}>
            {row.type === TransactionType.TOP_UP 
              ? <ArrowDownIcon size={16} /> 
              : <ArrowUpIcon size={16} />}
          </span>
          <span className="capitalize">{row.type.replace('-', ' ')}</span>
        </div>
      ),
      width: '20%',
      sortable: true,
    },
    {
      key: 'details',
      header: 'Details',
      render: (row: Transaction) => (
        <div>
          <p className="font-medium">
            {row.type === TransactionType.TOP_UP 
              ? `From ${row.source}` 
              : `To ${row.recipient}`}
          </p>
          {row.description && (
            <p className="text-sm text-gray-500">{row.description}</p>
          )}
        </div>
      ),
      width: '35%',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Transaction) => (
        <span className={`font-medium 
          ${row.type === TransactionType.TOP_UP 
            ? 'text-green-600' 
            : 'text-red-600'}
        `}>
          {row.type === TransactionType.TOP_UP 
            ? `+${formatCurrency(row.amount)}` 
            : `-${formatCurrency(row.amount)}`}
        </span>
      ),
      align: 'right' as const,
      width: '15%',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Transaction) => (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          {row.status}
        </span>
      ),
      align: 'center' as const,
      width: '10%',
    },
  ];
  
  return (
    <MainLayout>
      <TransactionHistoryFilters
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-end p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            icon={<DownloadIcon size={16} />}
            onClick={exportTransactions}
          >
            Export
          </Button>
        </div>
        
        <Table
          data={transactions}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalTransactions / itemsPerPage),
            onPageChange: handlePageChange,
          }}
        />
      </div>
      
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </MainLayout>
  );
};

export default TransactionsPage;