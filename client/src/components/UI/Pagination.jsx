import PropTypes from 'prop-types';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  showPageNumbers = true,
  showFirstLast = true
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Determine range of pages to show
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
      
      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 1;
      
      if (!showLeftDots && showRightDots) {
        // Show first pages
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (showLeftDots && !showRightDots) {
        // Show last pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        // Show middle pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  // Don't render if only one page
  if (totalPages <= 1) return null;
  
  return (
    <nav className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-outline py-1 px-3 text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-outline py-1 px-3 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        <div className="flex space-x-1">
          {showFirstLast && (
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="Go to first page"
              className="px-2 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="px-2 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {showPageNumbers && getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1 text-sm text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm font-medium rounded-md
                  ${currentPage === page
                    ? 'bg-primary-600 text-white border border-primary-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`
                }
              >
                {page}
              </button>
            )
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="px-2 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {showFirstLast && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Go to last page"
              className="px-2 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  showPageNumbers: PropTypes.bool,
  showFirstLast: PropTypes.bool
};

export default Pagination;