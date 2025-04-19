import MainLayout from '../components/layout/MainLayout';
import TransferForm from '../components/transaction/TransferForm';

const TransferPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600">Send money to friends, family or businesses</p>
      </div>
      
      <TransferForm />
    </MainLayout>
  );
};

export default TransferPage;