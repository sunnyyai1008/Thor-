import React, { useMemo, useState } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { products, brands, productFamilies } from '../../data/products';
import { Battery, Power, Settings, Home, HardDrive } from 'lucide-react';

export const BatteryOnlyMode = () => {
  const [couplingType, setCouplingType] = useState<'ac_coupled' | 'dc_coupled'>('ac_coupled');
  const [batteryLocation, setBatteryLocation] = useState('garage');
  const [backupOption, setBackupOption] = useState('none');

  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const existingSystem = useCalculatorStore((s) => s.systemSelection.existingSystem);
  const phase = useCalculatorStore((s) => s.phase);

  const updateBattery = useCalculatorStore((s) => s.updateBattery);
  const updateController = useCalculatorStore((s) => s.updateController);
  const setExistingSystem = useCalculatorStore((s) => s.setExistingSystem);

  const batteryFamilies = useMemo(() => {
    const batBrands = new Set(products.filter(p => p.category === 'battery').map(p => p.familyId || p.brandId));
    return productFamilies.filter(f => batBrands.has(f.id));
  }, []);

  const [selectedFamily, setSelectedFamily] = useState<string>('');

  const familyObj = productFamilies.find(f => f.id === selectedFamily);
  const brandObj = familyObj ? brands.find(b => b.id === familyObj.brandId) : null;

  const compatibleBatteries = useMemo(() => {
    if (!selectedFamily) return [];
    return products.filter(p => p.category === 'battery' && (p.familyId === selectedFamily || p.brandId === brandObj?.id));
  }, [selectedFamily, brandObj]);

  const compatibleControllers = useMemo(() => {
    if (!selectedFamily) return [];
    return products.filter(p => 
      p.category === 'inverter' && 
      (p.type === 'hybrid' || p.type === 'ac_coupled') &&
      (!p.phase || p.phase === phase) &&
      (p.brandId === brandObj?.id || p.compatibleWith?.includes(selectedFamily))
    );
  }, [selectedFamily, phase, brandObj]);

  return (
    <div className="space-y-6">
      {/* Existing System Information */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-primary-400" />
          Existing Solar System
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Existing Inverter Brand</label>
            <input 
              type="text"
              placeholder="e.g. Fronius, SMA"
              className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={existingSystem?.brand || ''}
              onChange={(e) => setExistingSystem({ ...(existingSystem || { model: '', capacity: 0, retainInverter: true, notes: '' }), brand: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">System Capacity (kW)</label>
            <input 
              type="number"
              step="0.1"
              placeholder="e.g. 6.6"
              className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={existingSystem?.capacity || ''}
              onChange={(e) => setExistingSystem({ ...(existingSystem || { brand: '', model: '', retainInverter: true, notes: '' }), capacity: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded bg-surface-900 border-surface-700 text-primary-500 focus:ring-primary-500 h-4 w-4"
              checked={existingSystem?.retainInverter ?? true}
              onChange={(e) => setExistingSystem({ ...(existingSystem || { brand: '', model: '', capacity: 0, notes: '' }), retainInverter: e.target.checked })}
            />
            <span className="ml-2 text-sm text-surface-300">Retain existing inverter (AC Coupled)</span>
          </label>
        </div>
      </div>

      {/* Battery Configuration */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <h3 className="text-lg font-medium text-white mb-6 flex items-center">
          <Battery className="w-5 h-5 mr-2 text-primary-400" />
          Battery Configuration
        </h3>

        {/* Coupling Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-300 mb-2">Coupling Type</label>
          <div className="flex bg-surface-900 p-1 rounded-lg border border-surface-700">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${couplingType === 'ac_coupled' ? 'bg-surface-700 text-white shadow-sm' : 'text-surface-400 hover:text-white'}`}
              onClick={() => setCouplingType('ac_coupled')}
            >
              AC Coupled (Add-on)
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${couplingType === 'dc_coupled' ? 'bg-surface-700 text-white shadow-sm' : 'text-surface-400 hover:text-white'}`}
              onClick={() => setCouplingType('dc_coupled')}
            >
              DC Coupled (Hybrid Replacement)
            </button>
          </div>
        </div>

        {/* Battery Family */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-300 mb-1">Battery Family / Brand</label>
          <select 
            className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedFamily}
            onChange={(e) => {
              setSelectedFamily(e.target.value);
              updateBattery(0, null, 1);
              updateController(0, null, 1);
            }}
          >
            <option value="">Select Battery Family...</option>
            {batteryFamilies.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {selectedFamily && (
          <div className="space-y-6">
            {/* Battery Module */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1 flex items-center">
                <HardDrive className="w-4 h-4 mr-1.5" /> Battery Module
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

            {/* Compatible Controller/Inverter */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1 flex items-center">
                <Power className="w-4 h-4 mr-1.5" /> Controller / Inverter
              </label>
              <div className="flex gap-4">
                <select 
                  className="flex-1 bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedControllers[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value) || null;
                    updateController(0, product, selectedControllers[0]?.quantity || 1);
                  }}
                >
                  <option value="">Select Controller...</option>
                  {compatibleControllers.map(p => {
                    const brand = brands.find(b => b.id === p.brandId)?.name || '';
                    return (
                      <option key={p.id} value={p.id}>
                        {brand} {p.name} {p.type ? `(${p.type})` : ''}
                      </option>
                    );
                  })}
                </select>
                <div className="w-24">
                  <input 
                    type="number"
                    min="1"
                    className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedControllers[0]?.quantity || 1}
                    onChange={(e) => updateController(0, selectedControllers[0]?.product || null, parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Installation Options */}
      <div className="bg-surface-800 rounded-lg p-6 border border-surface-700">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-400" />
          Installation Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Battery Location</label>
            <select 
              className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={batteryLocation}
              onChange={(e) => setBatteryLocation(e.target.value)}
            >
              <option value="garage">Garage (Indoor)</option>
              <option value="outdoor">Outdoor Wall</option>
              <option value="freestanding">Outdoor Freestanding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Backup Requirements</label>
            <select 
              className="w-full bg-surface-900 border border-surface-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={backupOption}
              onChange={(e) => setBackupOption(e.target.value)}
            >
              <option value="none">No Backup Required</option>
              <option value="1_circuit">Essential (1 Circuit)</option>
              <option value="2_circuits">Advanced (2 Circuits)</option>
              <option value="whole_home">Whole Home Backup</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
