import React, { useMemo } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { products, brands, productFamilies } from '../../data/products';
import { AlertCircle, Battery, Zap, PanelTop } from 'lucide-react';

export const PanelBatteryComboMode = () => {
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
  const panelProducts = useMemo(() => 
    products.filter(p => p.category === 'panel').sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0)),
  []);

  // Families with batteries
  const batteryFamilies = useMemo(() => {
    const batBrands = new Set(products.filter(p => p.category === 'battery').map(p => p.familyId || p.brandId));
    return productFamilies.filter(f => batBrands.has(f.id));
  }, []);

  const comboFamilyObj = productFamilies.find(f => f.id === comboFamily);
  const comboBrandObj = comboFamilyObj ? brands.find(b => b.id === comboFamilyObj.brandId) : null;

  // Inverters compatible with selected family's batteries
  const compatibleInverters = useMemo(() => {
    if (!comboFamily) return [];
    return products.filter(p => 
      p.category === 'inverter' && 
      (!p.phase || p.phase === phase) &&
      (p.brandId === comboBrandObj?.id || p.compatibleWith?.includes(comboFamily))
    );
  }, [comboFamily, phase, comboBrandObj]);

  const compatibleBatteries = useMemo(() => {
    if (!comboFamily) return [];
    return products.filter(p => p.category === 'battery' && (p.familyId === comboFamily || p.brandId === comboBrandObj?.id));
  }, [comboFamily, comboBrandObj]);

  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const familyId = e.target.value;
    setComboFamily(familyId || null);
    // Reset inverter and battery when family changes
    updateInverter(0, null, 1);
    updateBattery(0, null, 1);
  };

  return (
    <div className="space-y-6">
      {/* Panel Selection */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <PanelTop className="w-5 h-5 mr-2 text-primary-400" />
          Solar Panels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Panel Model</label>
            <select 
              className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedPanels.product?.id || ''}
              onChange={(e) => {
                const product = products.find(p => p.id === e.target.value) || null;
                setSelectedPanels(product, selectedPanels.quantity || 1);
              }}
            >
              <option value="">Select Panel...</option>
              {panelProducts.map(p => {
                const brand = brands.find(b => b.id === p.brandId)?.name || '';
                return (
                  <option key={p.id} value={p.id}>
                    {brand} {p.name} {p.powerWatts ? `(${p.powerWatts}W)` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Quantity</label>
            <input 
              type="number"
              min="1"
              className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedPanels.quantity || ''}
              onChange={(e) => setSelectedPanels(selectedPanels.product, parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Battery System Family */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary-400" />
          Battery System Ecosystem
        </h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-300 mb-1">Ecosystem / Brand Family</label>
          <select 
            className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={comboFamily || ''}
            onChange={handleFamilyChange}
          >
            <option value="">Select Ecosystem...</option>
            {batteryFamilies.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {comboFamily ? (
          <div className="space-y-6">
            {/* Inverter */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Compatible Inverter</label>
              <div className="flex gap-4">
                <select 
                  className="flex-1 bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedInverters[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value) || null;
                    updateInverter(0, product, selectedInverters[0]?.quantity || 1);
                  }}
                >
                  <option value="">Select Inverter...</option>
                  {compatibleInverters.map(p => {
                    const brand = brands.find(b => b.id === p.brandId)?.name || '';
                    return (
                      <option key={p.id} value={p.id}>
                        {brand} {p.name}
                      </option>
                    );
                  })}
                </select>
                <div className="w-24">
                  <input 
                    type="number"
                    min="1"
                    className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedInverters[0]?.quantity || 1}
                    onChange={(e) => updateInverter(0, selectedInverters[0]?.product || null, parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>

            {/* Battery */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Battery Module</label>
              <div className="flex gap-4">
                <select 
                  className="flex-1 bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedBatteries[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value) || null;
                    updateBattery(0, product, selectedBatteries[0]?.quantity || 1);
                  }}
                >
                  <option value="">Select Battery...</option>
                  {compatibleBatteries.map(p => {
                    const brand = brands.find(b => b.id === p.brandId)?.name || '';
                    return (
                      <option key={p.id} value={p.id}>
                        {brand} {p.name} {p.capacityKwh ? `(${p.capacityKwh} kWh)` : ''}
                      </option>
                    );
                  })}
                </select>
                <div className="w-24">
                  <input 
                    type="number"
                    min="1"
                    className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedBatteries[0]?.quantity || 1}
                    onChange={(e) => updateBattery(0, selectedBatteries[0]?.product || null, parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
            
            {/* Notice if selections are missing */}
            {(!selectedInverters[0]?.product || !selectedBatteries[0]?.product) && (
              <div className="bg-surface-900 border border-surface-700 rounded-md p-3 flex items-start text-sm">
                <AlertCircle className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-surface-300">
                  Please select both an inverter and battery module to complete the system configuration.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface-900 border border-surface-700 rounded-md p-6 flex flex-col items-center justify-center text-center">
            <Battery className="w-8 h-8 text-surface-500 mb-2" />
            <p className="text-surface-400 text-sm">Select an ecosystem to configure inverter and battery options</p>
          </div>
        )}
      </div>
    </div>
  );
};
