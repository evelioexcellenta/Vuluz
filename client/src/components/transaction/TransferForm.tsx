import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserIcon, DollarSignIcon, MessageSquareIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TransferData } from '../../types/transaction';
import { createTransfer } from '../../services/transactionService';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

interface TransferFormData {
  recipient: string;
  amount: string;
  description: string;
}

const TransferForm = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<TransferFormData>();
  
  const watchedAmount = watch('amount', '0');
  const watchedRecipient = watch('recipient', '');
  
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value || '0');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numValue);
  };
  
  const onSubmit = (data: TransferFormData) => {
    const amount = parseFloat(data.amount);
    
    if (currentUser && amount > currentUser.balance) {
      alert('Insufficient funds');
      return;
    }
    
    setTransferData({
      recipient: data.recipient,
      amount,
      description: data.description,
    });
    
    setShowConfirmation(true);
  };
  
  const confirmTransfer = async () => {
    if (!transferData) return;
    
    setLoading(true);
    try {
      await createTransfer(transferData);
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const cancelTransfer = () => {
    setShowConfirmation(false);
    setTransferData(null);
  };
  
  const startNewTransfer = () => {
    setSuccess(false);
    setShowConfirmation(false);
    setTransferData(null);
  };
  
  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <div className="text-center py-6">
          <div className="mx-auto rounded-full bg-green-100 p-3 mb-4 inline-block">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Transfer Successful!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully transferred {formatCurrency(transferData?.amount.toString() || '0')} to {transferData?.recipient}.
          </p>
          <Button onClick={startNewTransfer}>Make Another Transfer</Button>
        </div>
      </Card>
    );
  }
  
  if (showConfirmation && transferData) {
    return (
      <Card className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Confirm Transfer</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">From</span>
            <span className="font-medium">{currentUser?.firstName} {currentUser?.lastName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">To</span>
            <span className="font-medium">{transferData.recipient}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">{formatCurrency(transferData.amount.toString())}</span>
          </div>
          
          {transferData.description && (
            <div className="flex justify-between">
              <span className="text-gray-600">Description</span>
              <span className="font-medium">{transferData.description}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            onClick={cancelTransfer}
            disabled={loading}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmTransfer}
            isLoading={loading}
            fullWidth
          >
            Confirm Transfer
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Transfer Money</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Recipient Name"
          icon={<UserIcon size={18} />}
          error={errors.recipient?.message}
          {...register('recipient', {
            required: 'Recipient name is required',
          })}
        />
        
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
            validate: value => 
              !currentUser || parseFloat(value) <= currentUser.balance || 
              'Insufficient funds',
          })}
        />
        
        {watchedAmount && (
          <div className="mb-4 text-right text-sm text-gray-600">
            You're transferring {formatCurrency(watchedAmount)}
          </div>
        )}
        
        <Input
          label="Description (Optional)"
          icon={<MessageSquareIcon size={18} />}
          error={errors.description?.message}
          {...register('description')}
        />
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!watchedRecipient || !watchedAmount}
          >
            Continue
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TransferForm;