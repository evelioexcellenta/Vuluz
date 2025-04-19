import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { TransactionType } from '../../types/transaction';
import Button from '../common/Button';
import Input from '../common/Input';

interface FiltersData {
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  type: string;
}

interface TransactionHistoryFiltersProps {
  onApplyFilters: (filters: {
    dateRange?: { start: Date; end: Date };
    type?: TransactionType;
    amountRange?: { min: number; max: number };
  }) => void;
  onResetFilters: () => void;
}

const TransactionHistoryFilters: React.FC<TransactionHistoryFiltersProps> = ({
  onApplyFilters,
  onResetFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<FiltersData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      type: '',
    },
  });
  
  const onSubmit = (data: FiltersData) => {
    const filters: any = {};
    
    if (data.startDate && data.endDate) {
      filters.dateRange = {
        start: new Date(data.startDate),
        end: new Date(data.endDate),
      };
    }
    
    if (data.type) {
      filters.type = data.type as TransactionType;
    }
    
    if (data.minAmount || data.maxAmount) {
      filters.amountRange = {
        min: data.minAmount ? parseFloat(data.minAmount) : 0,
        max: data.maxAmount ? parseFloat(data.maxAmount) : Number.MAX_SAFE_INTEGER,
      };
    }
    
    onApplyFilters(filters);
  };
  
  const handleResetFilters = () => {
    reset();
    onResetFilters();
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <Button
          variant="outline"
          size="sm"
          icon={<FilterIcon size={16} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      {showFilters && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  placeholder="Start date"
                  icon={<CalendarIcon size={16} />}
                  {...register('startDate')}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  icon={<CalendarIcon size={16} />}
                  {...register('endDate')}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select
                {...register('type')}
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out focus:border-primary-500 focus:ring-primary-400/20"
              >
                <option value="">All Types</option>
                <option value={TransactionType.TRANSFER}>Transfer</option>
                <option value={TransactionType.TOP_UP}>Top Up</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  step="0.01"
                  min="0"
                  {...register('minAmount')}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  step="0.01"
                  min="0"
                  {...register('maxAmount')}
                />
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button type="submit" variant="primary">Apply Filters</Button>
              <Button type="button" variant="ghost" onClick={handleResetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TransactionHistoryFilters;