import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { products, brands } from '../../data/products';
import { Plus, Minus, Trash2, Zap, Info } from 'lucide-react';

const getBrandName = (brandId: string) => brands.find(b => b.id === brandId)?.name || '';

export const PanelInverterMode: React.FC = () => {
  const phase = useCalculatorStore((s) => s.phase);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const setSelectedPanels = useCalculatorStore((s) => s.setSelectedPanels);
  const addInverter = useCalculatorStore((s) => s.addInverter);
  const removeInverter = useCalculatorStore((s) => s.removeInverter);
  const updateInverter = useCalculatorStore((s) => s.updateInverter);

  const panelProducts = products.filter(p => p.category === 'panel');
  const inverterProducts = products.filter(p => p.category === 'inverter' && (p.phase === phase || !p.phase));

  const handlePanelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const panel = panelProducts.find(p => p.id === e.target.value) || null;
    setSelectedPanels(panel, selectedPanels.quantity || 10);
  };

  const handlePanelQtyChange = (delta: number) => {
    setSelectedPanels(selectedPanels.product, Math.max(1, (selectedPanels.quantity || 1) + delta));
  };

  const solarCapacityKw = selectedPanels.product
    ? ((selectedPanels.quantity * (selectedPanels.product.powerWatts || 0)) / 1000).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-4">
      {/* Panel Selection */}
      <div className="bg-surface-800 border border-surface-600 rounded-xl p-5">
        <h3 className="text-white text-base font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-400" />
          Panel Selection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Panel Model</label>
            <select
              value={selectedPanels.product?.id || ''}
              onChange={handlePanelChange}
              className="w-full bg-surface-700 border border-surface-500 rounded-lg px-3 py-2.5 text-white text-sm focus:border-primary-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Panel...</option>
              {panelProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.powerWatts}W) {p.isPriority ? '★' : ''} {p.stockStatus === 'low_stock' ? '⚠' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Quantity</label>
            <div className="flex items-center gap-0 bg-surface-700 border border-surface-500 rounded-lg overflow-hidden w-max">
              <button
                onClick={() => handlePanelQtyChange(-1)}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-surface-600 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={selectedPanels.quantity || 0}
                onChange={(e) => setSelectedPanels(selectedPanels.product, Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center text-white text-sm bg-transparent border-x border-surface-500 py-2 focus:outline-none"
              />
              <button
                onClick={() => handlePanelQtyChange(1)}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-surface-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {selectedPanels.product && selectedPanels.quantity > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-700 flex justify-between items-end">
            <span className="text-gray-400 text-sm">Solar Capacity</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary-400">{solarCapacityKw}</span>
              <span className="text-primary-400/70 text-sm">kW</span>
            </div>
          </div>
        )}
      </div>

      {/* Inverter Selection */}
      <div className="bg-surface-800 border border-surface-600 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-base font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-400" />
            Inverter Selection
          </h3>
          <button
            onClick={addInverter}
            className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Inverter
          </button>
        </div>

        <div className="space-y-3">
          {selectedInverters.map((inv, index) => (
            <div key={index} className="flex gap-3 items-end bg-surface-700/40 p-3 rounded-lg border border-surface-600/50">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1.5">Inverter Model</label>
                <select
                  value={inv.product?.id || ''}
                  onChange={(e) => {
                    const product = inverterProducts.find(p => p.id === e.target.value) || null;
                    updateInverter(index, product, inv.quantity);
                  }}
                  className="w-full bg-surface-700 border border-surface-500 rounded-lg px-3 py-2.5 text-white text-sm focus:border-primary-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Inverter...</option>
                  {inverterProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({(p.powerWatts || 0) / 1000}kW) — {p.type}
                    </option>
                  ))}
                </select>
                {inv.product?.type && (
                  <span className={`inline-block mt-1.5 px-2 py-0.5 text-[11px] rounded font-medium ${
                    inv.product.type === 'hybrid' ? 'bg-purple-900/40 text-purple-300' :
                    inv.product.type === 'micro' ? 'bg-blue-900/40 text-blue-300' :
                    'bg-surface-600 text-gray-300'
                  }`}>
                    {inv.product.type === 'string' ? 'String Inverter' :
                     inv.product.type === 'hybrid' ? 'Hybrid Inverter' :
                     inv.product.type === 'micro' ? 'Microinverter' : inv.product.type}
                  </span>
                )}
              </div>
              <div className="w-24">
                <label className="block text-sm text-gray-400 mb-1.5">Qty</label>
                <div className="flex items-center bg-surface-700 border border-surface-500 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateInverter(index, inv.product, Math.max(1, inv.quantity - 1))}
                    className="p-2 text-gray-400 hover:text-white hover:bg-surface-600 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-white flex-1 text-center text-sm">{inv.quantity}</span>
                  <button
                    onClick={() => updateInverter(index, inv.product, inv.quantity + 1)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-surface-600 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeInverter(index)}
                className="text-red-400/60 hover:text-red-400 p-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {selectedInverters.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-surface-600 rounded-lg">
              Click "Add Inverter" to configure inverters for this system.
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 text-gray-500 bg-surface-900/50 p-3 rounded-lg text-xs">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Quantity rules for microinverters are owner-configurable. Multiple inverters supported.</p>
        </div>
      </div>
    </div>
  );
};
