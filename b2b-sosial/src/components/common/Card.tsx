import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hoverable?: boolean;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  hoverable = false,
  noPadding = false,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden 
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''} 
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-4 py-4 sm:px-6">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={noPadding ? '' : 'px-4 py-5 sm:p-6'}>{children}</div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50">{footer}</div>
      )}
    </div>
  );
};

export default Card;