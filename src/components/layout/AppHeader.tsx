import React from 'react';
import { Sun, Moon, User, Shield } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';

export const AppHeader: React.FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const state = useCalculatorStore((s) => s.state);
  const setState = useCalculatorStore((s) => s.setState);
  const phase = useCalculatorStore((s) => s.phase);
  const setPhase = useCalculatorStore((s) => s.setPhase);
  const isOwner = usePricingStore((s) => s.isOwner);
  const setIsOwner = usePricingStore((s) => s.setIsOwner);

  return (
    <header className="bg-surface-900 border-b border-surface-700 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 text-primary-400">
        <Sun className="w-5 h-5" />
        <h1 className="text-lg font-bold text-white">Solar Calculator</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* State Toggle */}
        <div className="flex items-center p-0.5 bg-surface-800 rounded-lg border border-surface-700">
          <button
            onClick={() => setState('VIC')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              state === 'VIC' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            VIC
          </button>
          <button
            onClick={() => setState('NSW')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              state === 'NSW' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            NSW
          </button>
        </div>

        {/* Phase Toggle */}
        <div className="flex items-center p-0.5 bg-surface-800 rounded-lg border border-surface-700">
          <button
            onClick={() => setPhase('single')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              phase === 'single' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Single Phase
          </button>
          <button
            onClick={() => setPhase('three')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              phase === 'three' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Three Phase
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Role Toggle */}
        <button
          onClick={() => setIsOwner(!isOwner)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
            isOwner
              ? 'bg-red-900/30 border-red-800/50 text-red-300'
              : 'bg-surface-800 border-surface-700 text-gray-300 hover:text-white'
          }`}
          title="Toggle Owner/Sales View"
        >
          {isOwner ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
          <span>{isOwner ? 'Owner' : 'Sales'}</span>
        </button>
      </div>
    </header>
  );
};
