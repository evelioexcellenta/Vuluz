import MainLayout from '../components/layout/MainLayout';
import TopUpForm from '../components/transaction/TopUpForm';

const TopUpPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Top Up Wallet</h1>
        <p className="text-gray-600">Add funds to your wallet using various payment methods</p>
      </div>
      
      <TopUpForm />
    </MainLayout>
  );
};

export default TopUpPage;