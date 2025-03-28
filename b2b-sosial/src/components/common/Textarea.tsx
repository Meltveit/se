// src/components/common/Textarea.tsx
import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    hint, 
    fullWidth = false, 
    className = '', 
    id,
    ...rest 
  }, ref) => {
    const textareaId = id || Math.random().toString(36).substring(2, 9);
    
    const baseTextareaStyles = 'block rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const widthStyle = fullWidth ? 'w-full' : '';
    const errorStyle = error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 text-gray-900';
    
    return (
      <div className={`${widthStyle} ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`${baseTextareaStyles} ${widthStyle} ${errorStyle}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...rest}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${textareaId}-error`}>
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${textareaId}-hint`}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;