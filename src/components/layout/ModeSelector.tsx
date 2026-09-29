import React from 'react';
import { Zap, Battery, Sparkles, BatteryCharging } from 'lucide-react';
import { useCalculatorStore } from '../../stores/calculatorStore';

const MODES = [
  { id: 'panel_inverter', label: 'Panel + Inverter', icon: Zap },
  { id: 'panel_battery_combo', label: 'Panels + Battery Combo', icon: Battery },
  { id: 'sigenergy', label: 'Sigenergy', icon: Sparkles },
  { id: 'battery_only', label: 'Battery Only', icon: BatteryCharging },
] as const;

export const ModeSelector: React.FC = () => {
  const { mode, setMode } = useCalculatorStore((s) => ({
    mode: s.mode,
    setMode: s.setMode,
  }));

  return (
    <div className="bg-surface-900 border-b border-surface-800 px-4 py-3">
      <div className="flex flex-row gap-3 overflow-x-auto pb-1 no-scrollbar">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-surface-600 bg-surface-800 text-gray-400 hover:bg-surface-700 hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
