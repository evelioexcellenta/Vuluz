import { useState } from 'react';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface BalanceCardProps {
  balance: number;
  accountNumber: string;
  onTopUp: () => void;
  onTransfer: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ 
  balance, 
  accountNumber,
  onTopUp, 
  onTransfer 
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Account Number</span>
          <button 
            onClick={copyAccountNumber}
            className="p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <CheckIcon size={16} className="text-green-500" />
            ) : (
              <CopyIcon size={16} className="text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-lg font-medium tracking-wider">{accountNumber}</p>
      </Card>

      <Card className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Balance</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold transition-all duration-300">
            {showBalance ? formatCurrency(balance) : '••••••••'}
          </h1>
          <p className="text-white/70 mt-1 text-sm">
            Available Balance
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            size="md"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            onClick={onTopUp}
            fullWidth
          >
            Top Up
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            onClick={onTransfer}
            fullWidth
          >
            Transfer
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BalanceCard;