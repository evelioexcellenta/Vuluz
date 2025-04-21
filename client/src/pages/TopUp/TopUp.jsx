import AppLayout from '../../components/Layout/AppLayout';
import TopUpForm from '../../components/TopUp/TopUpForm';
import useTransactions from '../../hooks/useTransactions';

const TopUp = () => {
  const { createTopUp, isLoading } = useTransactions();
  
  // Handle top-up form submission
  const handleTopUp = async (topUpData) => {
    return await createTopUp(topUpData);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Add Money</h1>
        
        <TopUpForm 
          onSubmit={handleTopUp}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
};

export default TopUp;