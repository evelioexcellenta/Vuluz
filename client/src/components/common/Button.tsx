import React from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  size = 'md',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  icon
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 disabled:bg-secondary-300',
    outline: 'border border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-300 disabled:border-primary-300',
    ghost: 'text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-300',
    danger: 'bg-error-500 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-success-500 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${disabled || isLoading ? 'cursor-not-allowed opacity-70' : ''}
        ${className}
      `}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;