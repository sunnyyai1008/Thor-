import React, { useMemo, useState } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { products, brands } from '../../data/products';
import { Battery, Zap, PanelTop, Server, Wifi } from 'lucide-react';

export const SigenergyMode = () => {
  const [includePanels, setIncludePanels] = useState(true);
  
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters); // used for Energy Controller
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  
  const setSelectedPanels = useCalculatorStore((s) => s.setSelectedPanels);
  const updateInverter = useCalculatorStore((s) => s.updateInverter);
  const updateBattery = useCalculatorStore((s) => s.updateBattery);
  const updateGateway = useCalculatorStore((s) => s.updateGateway);

  const phase = useCalculatorStore((s) => s.phase);

  // Panels
  const panelProducts = useMemo(() => 
    products.filter(p => p.category === 'panel').sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0)),
  []);

  // Sigenergy products
  const sigenergyControllers = useMemo(() => 
    products.filter(p => p.brandId === 'brand-sigenergy' && p.category === 'inverter' && (!p.phase || p.phase === phase)),
  [phase]);

  const sigenergyBatteries = useMemo(() => 
    products.filter(p => p.brandId === 'brand-sigenergy' && p.category === 'battery'),
  []);

  const sigenergyGateways = useMemo(() => 
    products.filter(p => p.brandId === 'brand-sigenergy' && p.category === 'accessory' && p.name.toLowerCase().includes('gateway')),
  []);

  const totalBatteryCapacity = useMemo(() => {
    let total = 0;
    selectedBatteries.forEach(sb => {
      if (sb.product?.capacityKwh) {
        total += sb.product.capacityKwh * sb.quantity;
      }
    });
    return total;
  }, [selectedBatteries]);

  return (
    <div className="space-y-6">
      {/* Panel Selection (Optional) */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <PanelTop className="w-5 h-5 mr-2 text-primary-400" />
            Solar Panels
          </h3>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={includePanels}
              onChange={(e) => {
                setIncludePanels(e.target.checked);
                if (!e.target.checked) setSelectedPanels(null, 0);
              }}
            />
            <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 relative"></div>
            <span className="ml-3 text-sm font-medium text-surface-300">Include Panels</span>
          </label>
        </div>

        {includePanels && (
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
        )}
      </div>

      {/* Sigenergy Core Components */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <h3 className="text-lg font-medium text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary-400" />
          Sigenergy System Configuration
        </h3>

        <div className="space-y-6">
          {/* Energy Controller */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1 flex items-center">
              <Server className="w-4 h-4 mr-1.5" /> Energy Controller
            </label>
            <div className="flex gap-4">
              <select 
                className="flex-1 bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedInverters[0]?.product?.id || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value) || null;
                  updateInverter(0, product, selectedInverters[0]?.quantity || 1);
                }}
              >
                <option value="">Select Energy Controller...</option>
                {sigenergyControllers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
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

          {/* Battery Modules */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1 flex items-center">
              <Battery className="w-4 h-4 mr-1.5" /> Battery Modules
            </label>
            <div className="flex gap-4">
              <select 
                className="flex-1 bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedBatteries[0]?.product?.id || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value) || null;
                  updateBattery(0, product, selectedBatteries[0]?.quantity || 1);
                }}
              >
                <option value="">Select Battery Module...</option>
                {sigenergyBatteries.map(p => (
                  <option key={p.id} value={p.id}>{p.name} {p.capacityKwh ? `(${p.capacityKwh} kWh)` : ''}</option>
                ))}
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
            {totalBatteryCapacity > 0 && (
              <p className="text-sm text-primary-400 mt-2">
                Total Battery Capacity: <span className="font-semibold">{totalBatteryCapacity.toFixed(2)} kWh</span>
              </p>
            )}
          </div>

          {/* Gateway */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1 flex items-center">
              <Wifi className="w-4 h-4 mr-1.5" /> Sigen Gateway
            </label>
            <div className="flex gap-4">
              <select 
                className="flex-1 bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedGateways[0]?.product?.id || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value) || null;
                  updateGateway(0, product, selectedGateways[0]?.quantity || 1);
                }}
              >
                <option value="">Select Gateway (Optional)...</option>
                {sigenergyGateways.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
