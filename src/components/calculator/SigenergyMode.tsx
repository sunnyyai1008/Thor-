import React, { useMemo, useState } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { products, brands } from '../../data/products';
import { Sparkles, Server, Battery, Wifi, Sun, Info, Plus, Minus } from 'lucide-react';

export const SigenergyMode: React.FC = () => {
  const [includePanels, setIncludePanels] = useState(true);

  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);

  const setSelectedPanels = useCalculatorStore((s) => s.setSelectedPanels);
  const updateInverter = useCalculatorStore((s) => s.updateInverter);
  const updateBattery = useCalculatorStore((s) => s.updateBattery);
  const updateGateway = useCalculatorStore((s) => s.updateGateway);
  const phase = useCalculatorStore((s) => s.phase);

  const panelProducts = useMemo(
    () => products.filter((p) => p.category === 'panel'),
    []
  );

  const sigenergyControllers = useMemo(
    () =>
      products.filter(
        (p) =>
          p.brandId === 'brand-sigenergy' &&
          p.category === 'inverter' &&
          (!p.phase || p.phase === phase)
      ),
    [phase]
  );

  const sigenergyBatteries = useMemo(
    () =>
      products.filter((p) => p.brandId === 'brand-sigenergy' && p.category === 'battery'),
    []
  );

  const sigenergyGateways = useMemo(
    () =>
      products.filter(
        (p) =>
          p.brandId === 'brand-sigenergy' &&
          p.category === 'accessory' &&
          p.name.toLowerCase().includes('gateway')
      ),
    []
  );

  const totalBatteryCapacity = useMemo(() => {
    let total = 0;
    selectedBatteries.forEach((sb) => {
      if (sb.product?.capacityKwh) {
        total += sb.product.capacityKwh * sb.quantity;
      }
    });
    return total;
  }, [selectedBatteries]);

  const solarCapacityKw = selectedPanels.product
    ? ((selectedPanels.quantity * (selectedPanels.product.powerWatts || 0)) / 1000).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-5">
      {/* Optional Solar Array */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Solar Panels (Optional)</h3>
              <p className="text-xs text-slate-400">Sigenergy can be deployed with or without new panels</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-[#0e1120] px-3 py-1.5 rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all">
            <input
              type="checkbox"
              checked={includePanels}
              onChange={(e) => {
                setIncludePanels(e.target.checked);
                if (!e.target.checked) setSelectedPanels(null, 0);
              }}
              className="w-4 h-4 rounded text-indigo-500 bg-[#070912] border-white/20 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-200">Include New Panels</span>
          </label>
        </div>

        {includePanels && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-1">
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Module Model</label>
              <select
                value={selectedPanels.product?.id || ''}
                onChange={(e) => {
                  const product = panelProducts.find((p) => p.id === e.target.value) || null;
                  setSelectedPanels(product, selectedPanels.quantity || 16);
                }}
                className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="">Select Photovoltaic Module...</option>
                {panelProducts.map((p) => {
                  const brand = brands.find((b) => b.id === p.brandId)?.name || '';
                  return (
                    <option key={p.id} value={p.id}>
                      {brand ? `${brand} - ` : ''}{p.name} ({p.powerWatts}W)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="md:col-span-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Quantity</label>
                {selectedPanels.product && (
                  <span className="text-xs font-bold text-amber-400 font-mono">{solarCapacityKw} kW</span>
                )}
              </div>
              <div className="flex items-center bg-[#0d101d] border border-white/[0.1] rounded-xl overflow-hidden p-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedPanels(selectedPanels.product, Math.max(1, (selectedPanels.quantity || 1) - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={selectedPanels.quantity || ''}
                  onChange={(e) => setSelectedPanels(selectedPanels.product, Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 text-center font-bold text-sm text-white bg-transparent focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setSelectedPanels(selectedPanels.product, (selectedPanels.quantity || 1) + 1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sigenergy Core Components */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-600/30 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Sigenergy SigStor 5-in-1</h3>
              <p className="text-xs text-slate-400">Integrated Energy Controller, modular batteries & backup gateway</p>
            </div>
          </div>

          {totalBatteryCapacity > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-950/60 to-indigo-900/40 border border-violet-500/30 px-3.5 py-1.5 rounded-xl">
              <span className="text-[11px] font-semibold text-violet-300 uppercase">Storage:</span>
              <span className="text-base font-extrabold text-white font-mono">{totalBatteryCapacity.toFixed(1)} kWh</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Energy Controller */}
          <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                Sigen Energy Controller (Hybrid Inverter)
              </label>
              <span className="text-[10px] text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                Single or Three Phase
              </span>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedInverters[0]?.product?.id || ''}
                onChange={(e) => {
                  const product = products.find((p) => p.id === e.target.value) || null;
                  updateInverter(0, product, selectedInverters[0]?.quantity || 1);
                }}
                className="flex-1 bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="">Select Sigen Energy Controller...</option>
                {sigenergyControllers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({(p.powerWatts || 0) / 1000}kW)
                  </option>
                ))}
              </select>
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={selectedInverters[0]?.quantity || 1}
                  onChange={(e) =>
                    updateInverter(
                      0,
                      selectedInverters[0]?.product || null,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full bg-[#070912] border border-white/[0.1] rounded-xl px-3 py-2.5 text-white text-sm text-center font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Battery Module */}
          <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-purple-400" />
                SigStor Modular Battery Units (5 kWh increments)
              </label>
              <span className="text-[10px] text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                Stackable up to 6 modules
              </span>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedBatteries[0]?.product?.id || ''}
                onChange={(e) => {
                  const product = products.find((p) => p.id === e.target.value) || null;
                  updateBattery(0, product, selectedBatteries[0]?.quantity || 2);
                }}
                className="flex-1 bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="">Select Sigen Battery Module...</option>
                {sigenergyBatteries.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.capacityKwh} kWh)
                  </option>
                ))}
              </select>
              <div className="w-28 flex items-center bg-[#070912] border border-white/[0.1] rounded-xl overflow-hidden p-0.5">
                <button
                  type="button"
                  onClick={() =>
                    updateBattery(
                      0,
                      selectedBatteries[0]?.product || null,
                      Math.max(1, (selectedBatteries[0]?.quantity || 1) - 1)
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-bold text-sm text-white font-mono">
                  {selectedBatteries[0]?.quantity || 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateBattery(
                      0,
                      selectedBatteries[0]?.product || null,
                      Math.min(6, (selectedBatteries[0]?.quantity || 1) + 1)
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sigen Gateway */}
          <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                Sigen Gateway (Full Home Backup & Grid Isolation)
              </label>
              <span className="text-[10px] text-slate-400">0ms UPS Switchover</span>
            </div>
            <select
              value={selectedGateways[0]?.product?.id || ''}
              onChange={(e) => {
                const product = products.find((p) => p.id === e.target.value) || null;
                updateGateway(0, product, selectedGateways[0]?.quantity || 1);
              }}
              className="w-full bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="">Select Sigen Gateway (Optional for Whole-Home Backup)...</option>
              {sigenergyGateways.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 text-slate-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] text-xs">
          <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <p>
            Controller, battery module, and gateway compatibility rules are owner-configurable. Sigenergy modules feature AI-assisted multi-module cell balancing.
          </p>
        </div>
      </div>
    </div>
  );
};
