import React from 'react';

export interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex p-1 bg-surface-800 rounded-lg ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            flex-1 text-center font-medium transition-colors rounded-md
            ${size === 'sm' ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3'}
            ${
              value === option.value
                ? 'bg-primary-500 text-white shadow'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-700'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
