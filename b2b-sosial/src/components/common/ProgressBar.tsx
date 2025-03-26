import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'purple';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  showPercentage = true,
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Size variants
  const sizeVariants = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  // Color variants
  const colorVariants = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
  };
  
  // Calculate color based on percentage (optional feature)
  const calculateColor = () => {
    if (normalizedPercentage < 25) return colorVariants.red;
    if (normalizedPercentage < 50) return colorVariants.yellow;
    if (normalizedPercentage < 75) return colorVariants.indigo;
    return colorVariants.green;
  };
  
  // Use the provided color or calculate based on percentage
  const barColor = color === 'blue' ? colorVariants.blue : colorVariants[color];
  
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">{Math.round(normalizedPercentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeVariants[size]}`}>
        <div
          className={`${barColor} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${normalizedPercentage}%` }}
          role="progressbar"
          aria-valuenow={normalizedPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;