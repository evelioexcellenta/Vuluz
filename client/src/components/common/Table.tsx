import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  pagination?: PaginationProps;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;
  
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-1">
        <button 
          className="px-3 py-1 rounded-md text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages.map(page => (
          <button
            key={page}
            className={`px-3 py-1 rounded-md text-sm font-medium 
              ${page === currentPage 
                ? 'bg-primary-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button 
          className="px-3 py-1 rounded-md text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Table<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  pagination,
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) {
  const renderSortIndicator = (column: Column<T>) => {
    if (!column.sortable || column.key !== sortColumn) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase 
                  ${column.align === 'center' ? 'text-center' : ''} 
                  ${column.align === 'right' ? 'text-right' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort && onSort(column.key)}
              >
                <div className={`
                  ${column.sortable ? 'cursor-pointer hover:text-gray-700' : ''}
                  ${column.align === 'center' ? 'justify-center' : ''}
                  ${column.align === 'right' ? 'justify-end' : ''}
                  flex items-center
                `}>
                  {column.header}
                  {renderSortIndicator(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={keyExtractor(item)} 
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td 
                    key={`${keyExtractor(item)}-${column.key}`} 
                    className={`px-6 py-4 text-sm 
                      ${column.align === 'center' ? 'text-center' : ''} 
                      ${column.align === 'right' ? 'text-right' : ''}`}
                  >
                    {column.render ? column.render(item, index) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {pagination && (
        <Pagination 
          currentPage={pagination.currentPage} 
          totalPages={pagination.totalPages} 
          onPageChange={pagination.onPageChange} 
        />
      )}
    </div>
  );
}

export default Table;