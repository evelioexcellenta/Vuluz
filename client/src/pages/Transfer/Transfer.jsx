import { useState } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import TransferForm from '../../components/Transfer/TransferForm';
import FavoriteTransfer from '../../components/Transfer/FavoriteTransfer';
import Card from '../../components/UI/Card';
import useTransactions from '../../hooks/useTransactions';

const Transfer = () => {
  const [transferMode, setTransferMode] = useState('favorites'); // 'favorites' or 'manual'
  const { createTransfer, isLoading } = useTransactions();
  
  // Handle tranasfer form submission
  const handleTransfer = async (transferData) => {
    return await createTransfer(transferData);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Transfer Money</h1>
        
        {/* Transfer Mode Toggle */}
        <Card>
          <Card.Body>
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setTransferMode('favorites')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${transferMode === 'favorites'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Favorite Recipients
              </button>
              <button
                onClick={() => setTransferMode('manual')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${transferMode === 'manual'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Manual Transfer
              </button>
            </div>
          </Card.Body>
        </Card>
        
        {/* Transfer Forms */}
        {transferMode === 'favorites' ? (
          <FavoriteTransfer 
            onSubmit={handleTransfer}
            isLoading={isLoading}
          />
        ) : (
          <TransferForm 
            onSubmit={handleTransfer}
            isLoading={isLoading}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Transfer;