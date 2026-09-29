import React from 'react';
import { Sun, Moon, User, Shield, Zap, MapPin, SlidersHorizontal } from 'lucide-react';
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
  const setIsSettingsOpen = usePricingStore((s) => s.setIsSettingsOpen);

  return (
    <header className="sticky top-0 z-40 bg-[#0d101d]/90 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between flex-wrap gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-md shadow-amber-500/20 text-white">
            <Sun className="w-5 h-5 text-amber-100 animate-[spin_20s_linear_infinite]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 border border-[#0d101d] flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                THOR <span className="text-indigo-400 font-extrabold">SOLAR</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO CALC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Australian System Sizing & Margin Engine</p>
          </div>
        </div>

        {/* Center: Jurisdiction & Grid Phase Controls */}
        <div className="flex items-center gap-2 sm:gap-4 bg-[#141829] p-1 rounded-xl border border-white/[0.06] shadow-inner">
          {/* State / Jurisdiction */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400 pl-2 pr-1 hidden md:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              State:
            </span>
            <div className="flex items-center bg-[#0b0d17] p-0.5 rounded-lg border border-white/[0.05]">
              <button
                type="button"
                onClick={() => setState('VIC')}
                className={`relative px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  state === 'VIC'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-600/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                VIC
                {state === 'VIC' && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setState('NSW')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  state === 'NSW'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-600/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                NSW
              </button>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-white/[0.1] hidden sm:block" />

          {/* Grid Phase */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400 pl-1 pr-1 hidden md:inline">
              Grid:
            </span>
            <div className="flex items-center bg-[#0b0d17] p-0.5 rounded-lg border border-white/[0.05]">
              <button
                type="button"
                onClick={() => setPhase('single')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  phase === 'single'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-600/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Single Phase
              </button>
              <button
                type="button"
                onClick={() => setPhase('three')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  phase === 'three'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-600/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Three Phase
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions & Role Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all border border-transparent hover:border-white/[0.08] cursor-pointer"
            title="Toggle Visual Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Price & Installation Cost Settings Button */}
          <button
            type="button"
            onClick={() => {
              setIsOwner(true);
              setIsSettingsOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-900/60 to-violet-900/50 hover:from-indigo-600 hover:to-violet-600 border border-indigo-500/40 text-indigo-200 hover:text-white transition-all cursor-pointer shadow-sm shadow-indigo-950/40"
            title="Configure Equipment Wholesale/Retail Prices and Installation Fees"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
            <span className="hidden sm:inline">Set Prices & Costs</span>
            <span className="sm:hidden">Prices</span>
          </button>

          {/* Role Toggle with clear status badge */}
          <button
            type="button"
            onClick={() => setIsOwner(!isOwner)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-sm ${
              isOwner
                ? 'bg-gradient-to-r from-rose-950/80 to-red-900/60 border-rose-500/40 text-rose-200 shadow-rose-950/30'
                : 'bg-[#141829] border-white/[0.08] text-slate-300 hover:border-white/[0.16] hover:bg-[#1a2037]'
            }`}
            title="Click to toggle between Sales Representative view and confidential Owner Margin view"
          >
            {isOwner ? (
              <>
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Owner Mode</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sales View</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
