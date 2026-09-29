import React from 'react';

export interface BadgeProps {
  variant?: 'stock' | 'priority' | 'status' | 'info';
  statusValue?: string; // e.g., 'in_stock', 'low_stock', 'out_of_stock'
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  statusValue,
  children,
  className = '',
}) => {
  let colors = 'bg-surface-700 text-gray-200';

  if (variant === 'stock') {
    if (statusValue === 'in_stock') colors = 'bg-success-500/20 text-success-500 border-success-500/30';
    else if (statusValue === 'low_stock') colors = 'bg-warning-500/20 text-warning-500 border-warning-500/30';
    else if (statusValue === 'out_of_stock') colors = 'bg-error-500/20 text-error-500 border-error-500/30';
    else colors = 'bg-surface-700 text-gray-200';
  } else if (variant === 'priority') {
    colors = 'bg-amber-500/20 text-amber-500 border-amber-500/30';
  } else if (variant === 'status') {
    colors = 'bg-accent-500/20 text-accent-500 border-accent-500/30';
  } else if (variant === 'info') {
    colors = 'bg-primary-500/20 text-primary-500 border-primary-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors} ${className}`}>
      {children}
    </span>
  );
};
