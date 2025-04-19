import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCardIcon, DollarSignIcon, MessageSquareIcon, CheckCircleIcon } from 'lucide-react';
import { TopUpData } from '../../types/transaction';
import { createTopUp } from '../../services/transactionService';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

interface TopUpFormData {
  source: string;
  amount: string;
  description: string;
}

const TopUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [topUpData, setTopUpData] = useState<TopUpData | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<TopUpFormData>({
    defaultValues: {
      source: 'Credit Card',
    }
  });
  
  const watchedAmount = watch('amount', '0');
  const watchedSource = watch('source', '');
  
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value || '0');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numValue);
  };
  
  const onSubmit = (data: TopUpFormData) => {
    const amount = parseFloat(data.amount);
    
    setTopUpData({
      source: data.source,
      amount,
      description: data.description,
    });
    
    setShowConfirmation(true);
  };
  
  const confirmTopUp = async () => {
    if (!topUpData) return;
    
    setLoading(true);
    try {
      await createTopUp(topUpData);
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('Top up failed:', error);
      alert('Top up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const cancelTopUp = () => {
    setShowConfirmation(false);
    setTopUpData(null);
  };
  
  const startNewTopUp = () => {
    setSuccess(false);
    setShowConfirmation(false);
    setTopUpData(null);
  };
  
  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <div className="text-center py-6">
          <div className="mx-auto rounded-full bg-green-100 p-3 mb-4 inline-block">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Top Up Successful!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully added {formatCurrency(topUpData?.amount.toString() || '0')} to your wallet.
          </p>
          <Button onClick={startNewTopUp}>Make Another Top Up</Button>
        </div>
      </Card>
    );
  }
  
  if (showConfirmation && topUpData) {
    return (
      <Card className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Confirm Top Up</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">{formatCurrency(topUpData.amount.toString())}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Source</span>
            <span className="font-medium">{topUpData.source}</span>
          </div>
          
          {topUpData.description && (
            <div className="flex justify-between">
              <span className="text-gray-600">Description</span>
              <span className="font-medium">{topUpData.description}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            onClick={cancelTopUp}
            disabled={loading}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmTopUp}
            isLoading={loading}
            fullWidth
          >
            Confirm Top Up
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Top Up Wallet</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-400/20"
            {...register('source', {
              required: 'Payment method is required',
            })}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Account">Bank Account</option>
            <option value="PayPal">PayPal</option>
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-error-500">{errors.source.message}</p>
          )}
        </div>
        
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          icon={<DollarSignIcon size={18} />}
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            min: {
              value: 0.01,
              message: 'Amount must be greater than zero',
            },
          })}
        />
        
        {watchedAmount && (
          <div className="mb-4 text-right text-sm text-gray-600">
            You're adding {formatCurrency(watchedAmount)} to your wallet
          </div>
        )}
        
        <Input
          label="Description (Optional)"
          icon={<MessageSquareIcon size={18} />}
          error={errors.description?.message}
          {...register('description')}
        />
        
        {watchedSource === 'Credit Card' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium flex items-center">
              <CreditCardIcon size={16} className="mr-1 text-gray-500" />
              Credit Card Details
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              For demo purposes, no actual payment will be processed. In a real application, 
              you would be redirected to a secure payment page.
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!watchedSource || !watchedAmount}
          >
            Continue
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TopUpForm;