import React from 'react';
import { Plus, Minus } from 'lucide-react';

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  className?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  unit,
  className = '',
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (!disabled && value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (!disabled && value + step <= max) {
      onChange(value + step);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      if (val >= min && val <= max) {
        onChange(val);
      }
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <div className="flex items-center h-10 bg-surface-800 border border-surface-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="flex-shrink-0 px-3 h-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed border-r border-surface-600"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="flex-1 flex items-center bg-surface-900/50">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="w-full text-center bg-transparent text-gray-200 text-sm focus:outline-none hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && <span className="pr-3 text-xs text-gray-500 pointer-events-none">{unit}</span>}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="flex-shrink-0 px-3 h-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed border-l border-surface-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
