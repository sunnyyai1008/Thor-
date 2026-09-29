import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import Fuse from 'fuse.js';

export interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  thumbnailUrl?: string;
  group?: string;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const fuse = new Fuse(options, {
      keys: ['label', 'sublabel', 'group'],
      threshold: 0.3,
    });
    return fuse.search(searchQuery).map(result => result.item);
  }, [options, searchQuery]);

  const groupedOptions = React.useMemo(() => {
    return filteredOptions.reduce((acc, option) => {
      const group = option.group || 'Default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {} as Record<string, SelectOption[]>);
  }, [filteredOptions]);

  const flatGroupedOptions = React.useMemo(() => {
    const flat: SelectOption[] = [];
    Object.values(groupedOptions).forEach(groupOpts => {
      flat.push(...groupOpts);
    });
    return flat;
  }, [groupedOptions]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < flatGroupedOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatGroupedOptions[highlightedIndex]) {
          onChange(flatGroupedOptions[highlightedIndex].id);
          setIsOpen(false);
          setSearchQuery('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-3 py-2 bg-surface-800 border border-surface-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surface-800 border border-surface-600 rounded-md shadow-lg">
          <div className="p-2 border-b border-surface-600 sticky top-0 bg-surface-800 z-10 rounded-t-md">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 bg-surface-900 border border-surface-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200"
              />
            </div>
          </div>
          
          <ul ref={listRef} className="max-h-[300px] overflow-y-auto py-1">
            {Object.keys(groupedOptions).length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">No options found</li>
            ) : (
              Object.entries(groupedOptions).map(([group, opts]) => (
                <div key={group}>
                  {group !== 'Default' && (
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 bg-surface-900/50">
                      {group}
                    </div>
                  )}
                  {opts.map((option) => {
                    const index = flatGroupedOptions.findIndex(o => o.id === option.id);
                    const isSelected = value === option.id;
                    const isHighlighted = highlightedIndex === index;
                    
                    return (
                      <li
                        key={option.id}
                        onClick={() => {
                          onChange(option.id);
                          setIsOpen(false);
                          setSearchQuery('');
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm ${
                          isHighlighted ? 'bg-primary-500/10 text-primary-50' : 'text-gray-200 hover:bg-surface-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {option.thumbnailUrl && (
                            <img src={option.thumbnailUrl} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                          )}
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-medium">{option.label}</span>
                            {option.sublabel && (
                              <span className="truncate text-xs text-gray-400">{option.sublabel}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {option.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-surface-600 rounded text-gray-300">
                              {option.badge}
                            </span>
                          )}
                          {isSelected && <Check className="w-4 h-4 text-primary-500" />}
                        </div>
                      </li>
                    );
                  })}
                </div>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
