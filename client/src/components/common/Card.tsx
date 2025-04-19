import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  onClick,
  hover = false,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-card overflow-hidden';
  const hoverClasses = hover ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : '';
  const cursorClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${cursorClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={`px-5 py-4 ${headerClassName}`}>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={`px-5 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-5 py-3 bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;