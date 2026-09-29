import React from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helpText,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && <p className="text-xs text-error-500 mt-0.5">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-400 mt-0.5">{helpText}</p>}
    </div>
  );
};
