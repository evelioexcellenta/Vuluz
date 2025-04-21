import AppLayout from '../../components/Layout/AppLayout';
import TransferForm from '../../components/Transfer/TransferForm';
import useTransactions from '../../hooks/useTransactions';

const Transfer = () => {
  const { createTransfer, isLoading } = useTransactions();
  
  // Handle transfer form submission
  const handleTransfer = async (transferData) => {
    return await createTransfer(transferData);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Transfer Money</h1>
        
        <TransferForm 
          onSubmit={handleTransfer}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
};

export default Transfer;