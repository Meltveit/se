import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  // Size variants
  const sizeVariants = {
    sm: {
      switch: 'w-8 h-4',
      dot: 'h-3 w-3',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-10 h-5',
      dot: 'h-4 w-4',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-12 h-6',
      dot: 'h-5 w-5',
      translate: 'translate-x-6',
    },
  };

  return (
    <button
      type="button"
      id={id}
      className={`${sizeVariants[size].switch} ${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span
        className={`${checked ? sizeVariants[size].translate : 'translate-x-0'} ${sizeVariants[size].dot} pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200`}
      />
    </button>
  );
};

export default Switch;