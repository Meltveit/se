import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: Option[];
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    options, 
    error, 
    hint, 
    size = 'md', 
    fullWidth = false, 
    leftIcon,
    className = '', 
    id,
    ...rest 
  }, ref) => {
    const selectId = id || Math.random().toString(36).substring(2, 9);
    
    const baseSelectStyles = 'block rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const widthStyle = fullWidth ? 'w-full' : '';
    const errorStyle = error ? 'border-red-300 text-red-900' : 'border-gray-300';
    const iconStyle = leftIcon ? 'pl-10' : '';
    
    const sizeStyles = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-3 text-base',
    };
    
    // Style for option elements to ensure visibility
    const optionClass = "text-gray-900 bg-white";
    
    return (
      <div className={`${widthStyle} ${className}`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`${baseSelectStyles} ${widthStyle} ${errorStyle} ${sizeStyles[size]} ${iconStyle} text-gray-900 bg-white`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            style={{ color: '#111827', backgroundColor: 'white' }} // Explicit color to ensure visibility
            {...rest}
          >
            <option value="" className={optionClass} style={{ color: '#111827', backgroundColor: 'white' }}>
              Select an option
            </option>
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                className={optionClass}
                style={{ color: '#111827', backgroundColor: 'white' }} // Explicit styles for consistent rendering
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${selectId}-error`}>
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${selectId}-hint`}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;