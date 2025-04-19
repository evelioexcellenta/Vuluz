import React, { forwardRef } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  icon,
  showPasswordToggle = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : props.type;
  
  const baseInputClasses = 'px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out';
  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-400/20 text-error-900'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-400/20';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          id={id}
          ref={ref}
          type={inputType}
          className={`
            ${baseInputClasses}
            ${stateClasses}
            ${icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${className}
          `}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={togglePassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon size={18} />
            ) : (
              <EyeIcon size={18} />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;