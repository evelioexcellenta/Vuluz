import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  helper = '',
  disabled = false,
  readOnly = false,
  required = false,
  className = '',
  containerClassName = '',
  ...rest
}, ref) => {
  return (
    <div className={`form-control ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-error-600">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={`
          form-input
          ${error ? 'border-error-600 focus:ring-error-600 focus:border-error-600' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
        {...rest}
      />
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
      
      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helper: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string
};

export default Input;