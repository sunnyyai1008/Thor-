import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, ChevronDown, Check, Sparkles } from 'lucide-react';
import Fuse from 'fuse.js';

export interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeType?: 'priority' | 'warning' | 'neutral' | 'success';
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
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

  const selectedOption = options.find((opt) => opt.id === value);

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
      threshold: 0.35,
    });
    return fuse.search(searchQuery).map((result) => result.item);
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
    Object.values(groupedOptions).forEach((groupOpts) => {
      flat.push(...groupOpts);
    });
    return flat;
  }, [groupedOptions]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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
        setHighlightedIndex((prev) => (prev < flatGroupedOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
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

  const getStockIndicator = (status?: string) => {
    switch (status) {
      case 'low_stock':
        return <span className="w-2 h-2 rounded-full bg-amber-400" title="Low Stock" />;
      case 'out_of_stock':
        return <span className="w-2 h-2 rounded-full bg-rose-500" title="Out of Stock" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-emerald-400" title="In Stock" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0d101d] border rounded-xl shadow-inner transition-all text-left cursor-pointer ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
            : 'border-white/[0.1] hover:border-white/[0.2]'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {selectedOption ? (
            <>
              {selectedOption.stockStatus && getStockIndicator(selectedOption.stockStatus)}
              <div className="truncate">
                <span className="text-white text-xs sm:text-sm font-semibold truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.sublabel && (
                  <span className="text-[11px] text-slate-400 ml-2 font-mono">
                    {selectedOption.sublabel}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span className="text-slate-500 text-xs sm:text-sm">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {selectedOption?.badge && (
            <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}
          />
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-[#0e1120] border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Fixed Search Box at top of dropdown */}
          <div className="p-2 border-b border-white/[0.08] sticky top-0 bg-[#0e1120] z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search brand, model, wattage..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#070912] border border-white/[0.1] rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Scrollable Results List */}
          <ul ref={listRef} className="max-h-60 overflow-y-auto py-1">
            {Object.keys(groupedOptions).length === 0 ? (
              <li className="px-4 py-6 text-xs text-slate-400 text-center">
                No matching equipment found. Try another search.
              </li>
            ) : (
              Object.entries(groupedOptions).map(([group, opts]) => (
                <div key={group}>
                  {group !== 'Default' && (
                    <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                      {group}
                    </div>
                  )}
                  {opts.map((option) => {
                    const index = flatGroupedOptions.findIndex((o) => o.id === option.id);
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
                        className={`flex items-center justify-between px-3.5 py-2 cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 text-white border-l-2 border-indigo-500'
                            : isHighlighted
                            ? 'bg-white/[0.05] text-white'
                            : 'text-slate-300 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {option.stockStatus && getStockIndicator(option.stockStatus)}
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-white truncate">
                              {option.label}
                            </span>
                            {option.sublabel && (
                              <span className="text-[10px] text-slate-400 font-mono truncate">
                                {option.sublabel}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {option.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {option.badge}
                            </span>
                          )}
                          {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
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
