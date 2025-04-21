import { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { APP_CONFIG } from '../../constants/config';

const TransactionFilters = ({ 
  onApplyFilters, 
  onClearFilters,
  initialFilters = {},
  className = ''
}) => {
  const [filters, setFilters] = useState({
    type: initialFilters.type || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    search: initialFilters.search || ''
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };
  
  // Handle clearing filters
  const handleClear = () => {
    const emptyFilters = {
      type: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    };
    setFilters(emptyFilters);
    onClearFilters();
  };
  
  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Transaction Type */}
          <div>
            <label htmlFor="type" className="form-label">Transaction Type</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">All Types</option>
              <option value={APP_CONFIG.TRANSACTION_TYPES.TRANSFER_IN}>Transfer In</option>
              <option value={APP_CONFIG.TRANSACTION_TYPES.TRANSFER_OUT}>Transfer Out</option>
              <option value={APP_CONFIG.TRANSACTION_TYPES.TOP_UP}>Top Up</option>
              <option value={APP_CONFIG.TRANSACTION_TYPES.PAYMENT}>Payment</option>
              <option value={APP_CONFIG.TRANSACTION_TYPES.REFUND}>Refund</option>
            </select>
          </div>
          
          {/* Date Range */}
          <div>
            <Input
              label="From Date"
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Input
              label="To Date"
              type="date"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleChange}
            />
          </div>
          
          {/* Search */}
          <div>
            <Input
              label="Search"
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Description or account"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            Clear Filters
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

TransactionFilters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
  className: PropTypes.string
};

export default TransactionFilters;