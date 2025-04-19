import { format } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, XIcon } from 'lucide-react';
import { Transaction, TransactionType } from '../../types/transaction';
import Button from '../common/Button';

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  transaction, 
  onClose 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy h:mm a');
  };
  
  const generateReceipt = () => {
    // In a real app, this would generate a PDF or trigger a download
    alert('Receipt generation would be implemented here');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-8 text-center">
            <div className={`
              mx-auto rounded-full p-3 mb-3 inline-block
              ${transaction.type === TransactionType.TOP_UP 
                ? 'bg-green-100 text-green-600' 
                : 'bg-primary-100 text-primary-600'}
            `}>
              {transaction.type === TransactionType.TOP_UP 
                ? <ArrowDownIcon size={28} /> 
                : <ArrowUpIcon size={28} />}
            </div>
            <h3 className="text-2xl font-bold">{formatCurrency(transaction.amount)}</h3>
            <div className="flex items-center justify-center mt-1">
              <CheckCircleIcon className="text-green-500 h-5 w-5 mr-1" />
              <span className="text-green-600">Completed</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium">{formatDate(transaction.date)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium capitalize">{transaction.type.replace('-', ' ')}</span>
            </div>
            
            {transaction.type === TransactionType.TRANSFER && transaction.recipient && (
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient</span>
                <span className="font-medium">{transaction.recipient}</span>
              </div>
            )}
            
            {transaction.type === TransactionType.TOP_UP && transaction.source && (
              <div className="flex justify-between">
                <span className="text-gray-500">Source</span>
                <span className="font-medium">{transaction.source}</span>
              </div>
            )}
            
            {transaction.description && (
              <div className="flex justify-between">
                <span className="text-gray-500">Description</span>
                <span className="font-medium">{transaction.description}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium capitalize">{transaction.status}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              variant="outline" 
              fullWidth
              onClick={generateReceipt}
            >
              Download Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;