import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { brands } from '../../data/products';
import { Plus, Minus, Trash2, Zap, Info, Sparkles, Sun, ShieldCheck } from 'lucide-react';

export const PanelInverterMode: React.FC = () => {
  const products = usePricingStore((s) => s.products);
  const phase = useCalculatorStore((s) => s.phase);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const setSelectedPanels = useCalculatorStore((s) => s.setSelectedPanels);
  const addInverter = useCalculatorStore((s) => s.addInverter);
  const removeInverter = useCalculatorStore((s) => s.removeInverter);
  const updateInverter = useCalculatorStore((s) => s.updateInverter);

  const panelProducts = products.filter((p) => p.category === 'panel');
  const inverterProducts = products.filter(
    (p) => p.category === 'inverter' && (p.phase === phase || !p.phase)
  );

  const handlePanelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const panel = panelProducts.find((p) => p.id === e.target.value) || null;
    setSelectedPanels(panel, selectedPanels.quantity || 16);
  };

  const handlePanelQtyChange = (delta: number) => {
    setSelectedPanels(selectedPanels.product, Math.max(1, (selectedPanels.quantity || 1) + delta));
  };

  const solarCapacityKw = selectedPanels.product
    ? ((selectedPanels.quantity * (selectedPanels.product.powerWatts || 0)) / 1000).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-5">
      {/* Panel Selection Section */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Solar Panel Array</h3>
              <p className="text-xs text-slate-400">Select Tier-1 photovoltaic modules and array size</p>
            </div>
          </div>

          {/* Live Capacity Metric Badge */}
          {selectedPanels.product && selectedPanels.quantity > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-950/60 to-purple-900/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl shadow-inner">
              <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">PV Array:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-white font-mono">{solarCapacityKw}</span>
                <span className="text-xs font-bold text-indigo-400">kW</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          {/* Panel Dropdown */}
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Panel Model
            </label>
            <div className="relative">
              <select
                value={selectedPanels.product?.id || ''}
                onChange={handlePanelChange}
                className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer font-medium"
              >
                <option value="">Select Photovoltaic Module...</option>
                {panelProducts.map((p) => {
                  const brand = brands.find((b) => b.id === p.brandId)?.name || '';
                  return (
                    <option key={p.id} value={p.id}>
                      {brand ? `${brand} - ` : ''}{p.name} ({p.powerWatts}W) {p.isPriority ? '★ Priority' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedPanels.product && (
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  {selectedPanels.product.powerWatts} Watts per module
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Tier 1 Certified
                </span>
                {selectedPanels.product.isPriority && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Priority Stock
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Panel Quantity Stepper */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Panel Quantity
            </label>
            <div className="flex items-center bg-[#0d101d] border border-white/[0.1] rounded-xl overflow-hidden p-1 shadow-inner">
              <button
                type="button"
                onClick={() => handlePanelQtyChange(-1)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                value={selectedPanels.quantity || ''}
                onChange={(e) =>
                  setSelectedPanels(
                    selectedPanels.product,
                    Math.max(0, parseInt(e.target.value) || 0)
                  )
                }
                className="flex-1 text-center font-bold text-base text-white bg-transparent focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => handlePanelQtyChange(1)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inverter Selection Section */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Inverter Infrastructure</h3>
              <p className="text-xs text-slate-400">Grid-tied string, hybrid, or microinverter systems</p>
            </div>
          </div>

          <button
            type="button"
            onClick={addInverter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Inverter</span>
          </button>
        </div>

        {/* Inverters List */}
        <div className="space-y-3">
          {selectedInverters.map((inv, index) => (
            <div
              key={index}
              className="bg-[#0e1120] border border-white/[0.08] hover:border-white/[0.14] rounded-xl p-4 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Model dropdown */}
                <div className="md:col-span-8">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Inverter #{index + 1}
                    </label>
                    {inv.product?.type && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          inv.product.type === 'hybrid'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : inv.product.type === 'micro'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {inv.product.type === 'string'
                          ? 'String Inverter'
                          : inv.product.type === 'hybrid'
                          ? 'Hybrid (Battery Ready)'
                          : inv.product.type === 'micro'
                          ? 'Microinverter'
                          : inv.product.type}
                      </span>
                    )}
                  </div>
                  <select
                    value={inv.product?.id || ''}
                    onChange={(e) => {
                      const product =
                        inverterProducts.find((p) => p.id === e.target.value) || null;
                      updateInverter(index, product, inv.quantity);
                    }}
                    className="w-full bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer font-medium"
                  >
                    <option value="">Select Inverter Unit...</option>
                    {inverterProducts.map((p) => {
                      const brand = brands.find((b) => b.id === p.brandId)?.name || '';
                      return (
                        <option key={p.id} value={p.id}>
                          {brand ? `${brand} - ` : ''}{p.name} ({(p.powerWatts || 0) / 1000}kW)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Quantity */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Quantity
                  </label>
                  <div className="flex items-center bg-[#070912] border border-white/[0.1] rounded-xl overflow-hidden p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateInverter(index, inv.product, Math.max(1, inv.quantity - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-white font-mono">
                      {inv.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateInverter(index, inv.product, inv.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeInverter(index)}
                    className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
                    title="Remove inverter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {selectedInverters.length === 0 && (
            <div className="text-center py-8 rounded-xl border border-dashed border-white/[0.1] bg-[#0d101d]/50 p-6">
              <Zap className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No inverters currently added</p>
              <p className="text-xs text-slate-500 mt-1">
                Click "Add Inverter" above to pair an inverter with this solar system.
              </p>
            </div>
          )}
        </div>

        {/* Regulatory & Compatibility Note */}
        <div className="mt-4 flex items-start gap-2.5 text-slate-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] text-xs">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>
            Multiple inverters are supported. Inverter phase matching applies automatically based on the header toggle ({phase === 'single' ? 'Single Phase 230V' : 'Three Phase 415V'}).
          </p>
        </div>
      </div>
    </div>
  );
};
