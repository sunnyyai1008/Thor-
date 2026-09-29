import React, { useMemo, useState } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { brands, productFamilies } from '../../data/products';
import { Battery, Power, Settings, Home, HardDrive, CheckCircle2, ShieldAlert } from 'lucide-react';

export const BatteryOnlyMode: React.FC = () => {
  const products = usePricingStore((s) => s.products);
  const [couplingType, setCouplingType] = useState<'ac_coupled' | 'dc_coupled'>('ac_coupled');
  const [batteryLocation, setBatteryLocation] = useState('garage');
  const [backupOption, setBackupOption] = useState('none');
  const [selectedFamily, setSelectedFamily] = useState<string>('');

  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const existingSystem = useCalculatorStore((s) => s.systemSelection.existingSystem);
  const phase = useCalculatorStore((s) => s.phase);

  const updateBattery = useCalculatorStore((s) => s.updateBattery);
  const updateController = useCalculatorStore((s) => s.updateController);
  const setExistingSystem = useCalculatorStore((s) => s.setExistingSystem);

  const batteryFamilies = useMemo(() => {
    const batBrands = new Set(
      products.filter((p) => p.category === 'battery').map((p) => p.familyId || p.brandId)
    );
    return productFamilies.filter((f) => batBrands.has(f.id));
  }, []);

  const familyObj = productFamilies.find((f) => f.id === selectedFamily);
  const brandObj = familyObj ? brands.find((b) => b.id === familyObj.brandId) : null;

  const compatibleBatteries = useMemo(() => {
    if (!selectedFamily) return [];
    return products.filter(
      (p) =>
        p.category === 'battery' &&
        (p.familyId === selectedFamily || p.brandId === brandObj?.id)
    );
  }, [selectedFamily, brandObj]);

  const compatibleControllers = useMemo(() => {
    if (!selectedFamily) return [];
    return products.filter(
      (p) =>
        p.category === 'inverter' &&
        (p.type === 'hybrid' || p.type === 'ac_coupled') &&
        (!p.phase || p.phase === phase) &&
        (p.brandId === brandObj?.id || p.compatibleWith?.includes(selectedFamily))
    );
  }, [selectedFamily, phase, brandObj]);

  return (
    <div className="space-y-5">
      {/* Existing System Information */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Existing Solar System Inspection</h3>
              <p className="text-xs text-slate-400">Details of rooftop PV & inverter currently installed on site</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Retrofit Assessment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Existing Inverter Brand & Model
            </label>
            <input
              type="text"
              placeholder="e.g. Fronius Primo 5.0-1"
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
              value={existingSystem?.brand || ''}
              onChange={(e) =>
                setExistingSystem({
                  ...(existingSystem || {
                    model: '',
                    capacity: 0,
                    retainInverter: true,
                    notes: '',
                  }),
                  brand: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Existing Solar Array Size (kW)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 6.6"
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono font-medium"
              value={existingSystem?.capacity || ''}
              onChange={(e) =>
                setExistingSystem({
                  ...(existingSystem || {
                    brand: '',
                    model: '',
                    retainInverter: true,
                    notes: '',
                  }),
                  capacity: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        {/* Retain Inverter Guarantee Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
          <input
            type="checkbox"
            id="retainInverter"
            checked={existingSystem?.retainInverter ?? true}
            onChange={(e) =>
              setExistingSystem({
                ...(existingSystem || {
                  brand: '',
                  model: '',
                  capacity: 0,
                  notes: '',
                }),
                retainInverter: e.target.checked,
              })
            }
            className="w-4 h-4 rounded text-emerald-500 bg-[#0d101d] border-white/20 mt-0.5 cursor-pointer"
          />
          <label htmlFor="retainInverter" className="text-xs cursor-pointer select-none">
            <span className="font-bold text-white block">Retain Existing Inverter (AC Coupled Storage Add-On)</span>
            <span className="text-emerald-300/80">
              Guaranteed: Existing inverter retained at the property is never charged as new equipment.
            </span>
          </label>
        </div>
      </div>

      {/* Battery Configuration */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Battery className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">New Battery Storage Specification</h3>
              <p className="text-xs text-slate-400">Configure standalone storage capacity and backup circuits</p>
            </div>
          </div>
        </div>

        {/* Coupling Type */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Electrical Coupling Architecture
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCouplingType('ac_coupled')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                couplingType === 'ac_coupled'
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                  : 'bg-[#0d101d] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">AC Coupled (Add-On)</div>
              <div className="text-[11px] opacity-75 mt-0.5">Works with any existing solar inverter</div>
            </button>
            <button
              type="button"
              onClick={() => setCouplingType('dc_coupled')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                couplingType === 'dc_coupled'
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                  : 'bg-[#0d101d] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">DC Coupled (Hybrid Replacement)</div>
              <div className="text-[11px] opacity-75 mt-0.5">Replaces existing inverter with hybrid unit</div>
            </button>
          </div>
        </div>

        {/* Battery Family Selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Battery Brand / Ecosystem
          </label>
          <select
            value={selectedFamily}
            onChange={(e) => {
              setSelectedFamily(e.target.value);
              updateBattery(0, null, 1);
              updateController(0, null, 1);
            }}
            className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
          >
            <option value="">Select Battery Manufacturer...</option>
            {batteryFamilies.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {selectedFamily && (
          <div className="space-y-4 pt-1">
            {/* Battery Module Selection */}
            <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                Select Battery Module & Capacity
              </label>
              <div className="flex gap-3">
                <select
                  value={selectedBatteries[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value) || null;
                    updateBattery(0, product, selectedBatteries[0]?.quantity || 1);
                  }}
                  className="flex-1 bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
                >
                  <option value="">Select Module...</option>
                  {compatibleBatteries.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.capacityKwh} kWh)
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

            {/* Controller / Inverter (if DC or required) */}
            {couplingType === 'dc_coupled' && (
              <div className="bg-[#0e1120] border border-white/[0.08] rounded-xl p-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Power className="w-3.5 h-3.5 text-indigo-400" />
                  Replacement Hybrid Inverter
                </label>
                <select
                  value={selectedControllers[0]?.product?.id || ''}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value) || null;
                    updateController(0, product, selectedControllers[0]?.quantity || 1);
                  }}
                  className="w-full bg-[#070912] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
                >
                  <option value="">Select Hybrid Inverter...</option>
                  {compatibleControllers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Installation & Backup Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/[0.06]">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Battery Enclosure Location</label>
            <select
              value={batteryLocation}
              onChange={(e) => setBatteryLocation(e.target.value)}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="garage">Garage Interior (Standard)</option>
              <option value="outdoor">External Weatherproof Wall</option>
              <option value="freestanding">Ground Mounting Slab</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Emergency Power Backup</label>
            <select
              value={backupOption}
              onChange={(e) => setBackupOption(e.target.value)}
              className="w-full bg-[#0d101d] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="none">Grid Tied (No Outage Backup)</option>
              <option value="1_circuit">1 Essential Emergency Circuit (Fridges/Lights)</option>
              <option value="2_circuits">2 Essential Circuits</option>
              <option value="whole_home">Whole Home Backup (Subject to site survey)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
