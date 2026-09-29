import React from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-surface-600'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
    </label>
  );
};
