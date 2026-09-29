import React from 'react';
import { Zap, BatteryCharging, Sparkles, Battery } from 'lucide-react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import type { CalculatorMode } from '../../types/quote';

interface ModeOption {
  id: CalculatorMode;
  label: string;
  tagline: string;
  icon: React.ElementType;
  badge?: string;
}

const MODES: ModeOption[] = [
  {
    id: 'panel_inverter',
    label: 'Panel + Inverter',
    tagline: 'Standard Grid-Tied PV',
    icon: Zap,
  },
  {
    id: 'panel_battery_combo',
    label: 'Panels + Battery Combo',
    tagline: 'Hybrid Solar & Storage',
    icon: BatteryCharging,
    badge: 'Popular',
  },
  {
    id: 'sigenergy',
    label: 'Sigenergy System',
    tagline: 'SigStor 5-in-1 Ecosystem',
    icon: Sparkles,
    badge: 'Featured',
  },
  {
    id: 'battery_only',
    label: 'Battery Only',
    tagline: 'Retrofit & AC Coupling',
    icon: Battery,
  },
];

export const ModeSelector: React.FC = () => {
  const mode = useCalculatorStore((s) => s.mode);
  const setMode = useCalculatorStore((s) => s.setMode);

  return (
    <div className="bg-[#0b0d17]/80 border-b border-white/[0.06] px-4 lg:px-6 py-3">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 lg:gap-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`relative group flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-950/50 via-[#181c33] to-indigo-900/30 border-indigo-500/60 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                    : 'bg-[#121526]/60 border-white/[0.06] hover:bg-[#181d33] hover:border-white/[0.15]'
                }`}
              >
                {/* Icon box with glowing background on active */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/40'
                      : 'bg-[#1a2037] text-slate-400 group-hover:text-indigo-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs sm:text-sm font-bold truncate tracking-tight ${
                        isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {m.label}
                    </span>
                    {m.badge && (
                      <span className="hidden xl:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.tagline}</p>
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
