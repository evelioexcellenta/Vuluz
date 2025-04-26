import { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import TransactionTable from '../../components/Transactions/TransactionTable';
import TransactionFilters from '../../components/Transactions/TransactionFilters';
import Modal from '../../components/UI/Modal';
import Card from '../../components/UI/Card';
import useTransactions from '../../hooks/useTransactions';
import { formatDateTime, formatCurrency, getTransactionTypeLabel, getTransactionBadgeClass } from '../../utils/formatters';

const Transactions = () => {
  const { 
    transactions, 
    isLoading, 
    filters,
    applyFilters, 
    clearFilters ,
    sortTransactions     
  } = useTransactions();
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle viewing transaction details
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        
        {/* Filters */}
        <TransactionFilters 
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          initialFilters={filters}
        />
        
        {/* Transaction Table */}
        <Card>
          <Card.Body className="p-0">
            <TransactionTable 
              transactions={transactions}
              isLoading={isLoading}
              onViewTransaction={handleViewTransaction}
              itemsPerPage={10}
              onSortChange={sortTransactions}   
            />
          </Card.Body>
        </Card>
      </div>
      
      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Transaction Details"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedTransaction.description}</h3>
                <p className="text-sm text-gray-500">{formatDateTime(selectedTransaction.date)}</p>
              </div>
              <span className={`badge ${getTransactionBadgeClass(selectedTransaction.type)}`}>
                {getTransactionTypeLabel(selectedTransaction.type)}
              </span>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className={`text-lg font-semibold ${
                    ['TRANSFER_IN', 'TOP_UP', 'REFUND'].includes(selectedTransaction.type) 
                      ? 'text-accent-600' 
                      : 'text-error-600'
                  }`}>
                    {['TRANSFER_IN', 'TOP_UP', 'REFUND'].includes(selectedTransaction.type) ? '+' : '-'}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Account</p>
                  <p className="text-base text-gray-800">{selectedTransaction.account}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="text-base text-gray-800">{selectedTransaction.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-base text-success-600">Completed</p>
                </div>
              </div>
            </div>
            
            {selectedTransaction.description && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-base text-gray-800">{selectedTransaction.description}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AppLayout>
  );
};

export default Transactions;