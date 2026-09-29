import React, { useMemo } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { brands, productFamilies } from '../../data/products';
import { BatteryCharging, Zap, Sun, ShieldAlert, Sparkles, Plus, Minus } from 'lucide-react';

export const PanelBatteryComboMode: React.FC = () => {
  const products = usePricingStore((s) => s.products);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const comboFamily = useCalculatorStore((s) => s.systemSelection.comboFamily);
  const phase = useCalculatorStore((s) => s.phase);

  const setSelectedPanels = useCalculatorStore((s) => s.setSelectedPanels);
  const updateInverter = useCalculatorStore((s) => s.updateInverter);
  const updateBattery = useCalculatorStore((s) => s.updateBattery);
  const setComboFamily = useCalculatorStore((s) => s.setComboFamily);

  // Panels
  const panelProducts = useMemo(
    () => products.filter((p) => p.category === 'panel'),
    []
  );

  // Families with batteries
  const batteryFamilies = useMemo(() => {
    const batBrands = new Set(
      products.filter((p) => p.category === 'battery').map((p) => p.familyId || p.brandId)
    );
    return productFamilies.filter((f) => batBrands.has(f.id));
  }, []);

  const comboFamilyObj = productFamilies.find((f) => f.id === comboFamily);
  const comboBrandObj = comboFamilyObj ? brands.find((b) => b.id === comboFamilyObj.brandId) : null;

  // Inverters compatible with selected family's batteries
  const compatibleInverters = useMemo(() => {
    if (!comboFamily) return [];
    return products.filter(
      (p) =>
        p.category === 'inverter' &&
        (!p.phase || p.phase === phase) &&
        (p.brandId === comboBrandObj?.id || p.compatibleWith?.includes(comboFamily))
    );
  }, [comboFamily, phase, comboBrandObj]);

  const compatibleBatteries = useMemo(() => {
    if (!comboFamily) return [];
    return products.filter(
      (p) =>
        p.category === 'battery' &&
        (p.familyId === comboFamily || p.brandId === comboBrandObj?.id)
    );
  }, [comboFamily, comboBrandObj]);

  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const familyId = e.target.value;
    setComboFamily(familyId || null);
    updateInverter(0, null, 1);
    updateBattery(0, null, 1);
  };

  const solarCapacityKw = selectedPanels.product
    ? ((selectedPanels.quantity * (selectedPanels.product.powerWatts || 0)) / 1000).toFixed(2)
    : '0.00';

  const batteryCapacityKwh = selectedBatteries[0]?.product?.capacityKwh
    ? ((selectedBatteries[0].quantity * selectedBatteries[0].product.capacityKwh)).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-5">
      {/* Solar Panel Array */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Solar Panel Array</h3>
              <p className="text-xs text-slate-400">Pair solar PV generation with battery storage</p>
            </div>
          </div>

          {selectedPanels.product && selectedPanels.quantity > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-950/60 to-purple-900/40 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-semibold text-indigo-300 uppercase">Array:</span>
              <span className="text-base font-extrabold text-white font-mono">{solarCapacityKw} kW</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Panel Quantity</label>
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
      </div>

      {/* Battery & Inverter Ecosystem */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Battery & Hybrid Ecosystem</h3>
              <p className="text-xs text-slate-400">Pair compatible inverter controllers and modular storage units</p>
            </div>
          </div>

          {Number(batteryCapacityKwh) > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-950/60 to-indigo-900/40 border border-purple-500/30 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-semibold text-purple-300 uppercase">Storage:</span>
              <span className="text-base font-extrabold text-white font-mono">{batteryCapacityKwh} kWh</span>
            </div>
          )}
        </div>

        {/* Step 1: Ecosystem Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Step 1: Choose Brand / Battery Ecosystem
          </label>
          <select
            value={comboFamily || ''}
            onChange={handleFamilyChange}
            className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
          >
            <option value="">Select Ecosystem Brand / Family...</option>
            {batteryFamilies.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (Compatible Hybrid Architecture)
              </option>
            ))}
          </select>
        </div>

        {comboFamily ? (
          <div className="space-y-4 pt-2">
            {/* Step 2: Compatible Inverter */}
            <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Step 2: Compatible Inverter / Energy Hub
              </label>
              <div className="flex gap-3">
                <select
                  value={selectedInverters[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value) || null;
                    updateInverter(0, product, selectedInverters[0]?.quantity || 1);
                  }}
                  className="flex-1 bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
                >
                  <option value="">Select Compatible Inverter...</option>
                  {compatibleInverters.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({(p.powerWatts || 0) / 1000}kW) — {p.type}
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

            {/* Step 3: Battery Module */}
            <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Step 3: Battery Storage Capacity / Units
                </label>
                {selectedBatteries[0]?.product?.capacityKwh && (
                  <span className="text-[11px] text-purple-300 font-mono">
                    {selectedBatteries[0].product.capacityKwh} kWh per unit
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedBatteries[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value) || null;
                    updateBattery(0, product, selectedBatteries[0]?.quantity || 1);
                  }}
                  className="flex-1 bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
                >
                  <option value="">Select Battery Module...</option>
                  {compatibleBatteries.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.capacityKwh} kWh Usable)
                    </option>
                  ))}
                </select>
                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    value={selectedBatteries[0]?.quantity || 1}
                    onChange={(e) =>
                      updateBattery(
                        0,
                        selectedBatteries[0]?.product || null,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full bg-[#070912] border border-white/[0.1] rounded-xl px-3 py-2.5 text-white text-sm text-center font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 rounded-xl border border-dashed border-white/[0.1] bg-[#0d101d]/50 p-6">
            <BatteryCharging className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Select an ecosystem brand first</p>
            <p className="text-xs text-slate-500 mt-1">
              Choose an ecosystem above to filter certified compatible inverters and battery modules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
