import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`bg-surface-800 border border-surface-600 rounded-lg overflow-hidden ${className}`}>
      {(title || collapsible) && (
        <div 
          className={`px-4 py-3 border-b border-surface-600 flex items-center justify-between ${collapsible ? 'cursor-pointer hover:bg-surface-700/50' : ''}`}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          <div>
            {title && <h3 className="text-sm font-semibold text-gray-100">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {collapsible && (
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} 
            />
          )}
        </div>
      )}
      
      <div 
        className={`transition-all duration-200 ease-in-out origin-top ${
          collapsible && isCollapsed ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
        }`}
      >
        <div className="p-4 text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};
