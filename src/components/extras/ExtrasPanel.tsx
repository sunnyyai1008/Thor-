import React, { useState, useMemo } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { extrasCatalogue } from '../../data/extras';
import { Search, Plus, X, AlertTriangle } from 'lucide-react';
import type { ExtraCatalogueItem } from '../../types/extras';
import type { SelectedExtra } from '../../types/extras';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

const categoryLabels: Record<string, string> = {
  roof_mounting: 'Roof & Mounting',
  battery_backup: 'Battery & Backup',
  electrical_monitoring: 'Electrical & Monitoring',
  removal_specialist: 'Removal & Specialist',
};

const unitLabels: Record<string, string> = {
  fixed: 'fixed',
  per_item: 'per item',
  per_panel: 'per panel',
  per_metre: 'per metre',
  per_circuit: 'per circuit',
};

function calculateLineTotal(extra: SelectedExtra): number {
  if (extra.isIncludedInPackage) return 0;
  const qty = extra.quantity || 1;
  const unitPrice = extra.unitPrice || 0;
  return qty * unitPrice;
}

export const ExtrasPanel: React.FC = () => {
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);
  const addExtra = useCalculatorStore((s) => s.addExtra);
  const removeExtra = useCalculatorStore((s) => s.removeExtra);
  const updateExtraQuantity = useCalculatorStore((s) => s.updateExtraQuantity);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCatalogue, setShowCatalogue] = useState(false);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'roof_mounting', label: 'Roof & Mounting' },
    { key: 'battery_backup', label: 'Battery & Backup' },
    { key: 'electrical_monitoring', label: 'Electrical & Monitoring' },
    { key: 'removal_specialist', label: 'Removal & Specialist' },
  ];

  const filteredCatalogue = useMemo(() => {
    return extrasCatalogue.filter((item) => {
      if (!item.isActive) return false;
      const matchesSearch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      // Don't show already-selected items (prevent duplicates)
      const alreadySelected = item.preventDuplicate &&
        selectedExtras.some((e) => e.catalogueItemId === item.id);
      return matchesSearch && matchesCategory && !alreadySelected;
    });
  }, [searchTerm, activeCategory, selectedExtras]);

  const handleAddExtra = (catalogueItem: ExtraCatalogueItem) => {
    const newExtra: SelectedExtra = {
      id: `extra-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      catalogueItemId: catalogueItem.id,
      description: catalogueItem.name,
      quantity: 1,
      unit: unitLabels[catalogueItem.chargingMethod] || catalogueItem.chargingMethod,
      unitPrice: catalogueItem.unitPrice,
      lineTotal: catalogueItem.unitPrice,
      isIncludedInPackage: false,
      isPricePending: catalogueItem.isPricePending,
      isAutoAdded: false,
    };
    addExtra(newExtra);
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + calculateLineTotal(e), 0);

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Extras & Add-ons</h2>
        <button
          onClick={() => setShowCatalogue(!showCatalogue)}
          className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 cursor-pointer"
        >
          <Plus size={14} />
          {showCatalogue ? 'Hide Catalogue' : 'Add Extra'}
        </button>
      </div>

      {/* Catalogue Browser */}
      {showCatalogue && (
        <div className="flex flex-col gap-3 bg-surface-900 rounded-lg p-4 border border-surface-600">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-700 text-gray-400 hover:bg-surface-600 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search extras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-800 border border-surface-600 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-primary-500 placeholder:text-gray-600"
            />
          </div>

          {/* Available Items */}
          <div className="max-h-52 overflow-y-auto flex flex-col gap-0.5">
            {filteredCatalogue.length > 0 ? filteredCatalogue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 hover:bg-surface-800 rounded-lg cursor-pointer group transition-colors"
                onClick={() => handleAddExtra(item)}
              >
                <div>
                  <div className="text-white text-sm">{item.name}</div>
                  <div className="text-gray-500 text-xs flex items-center gap-2">
                    <span>{formatCurrency(item.unitPrice)}</span>
                    <span className="text-gray-600">•</span>
                    <span>{unitLabels[item.chargingMethod]}</span>
                    {item.isPricePending && (
                      <span className="text-yellow-500 text-[10px] uppercase font-medium">Price Pending</span>
                    )}
                    {item.bundleIncludedQty && (
                      <span className="text-gray-500 text-[10px]">
                        Includes {item.bundleIncludedQty}
                      </span>
                    )}
                  </div>
                </div>
                <Plus size={16} className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )) : (
              <div className="text-gray-500 text-sm p-3 text-center">No extras found</div>
            )}
          </div>
        </div>
      )}

      {/* Selected Extras Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-gray-500 uppercase bg-surface-900/50">
            <tr>
              <th className="px-3 py-2.5 rounded-tl-lg">Description</th>
              <th className="px-3 py-2.5 w-20">Qty</th>
              <th className="px-3 py-2.5">Unit</th>
              <th className="px-3 py-2.5">Price</th>
              <th className="px-3 py-2.5">Total</th>
              <th className="px-3 py-2.5 rounded-tr-lg w-10"></th>
            </tr>
          </thead>
          <tbody>
            {selectedExtras.map((extra, index) => (
              <tr key={extra.id} className={`border-b border-surface-700/50 ${index % 2 === 0 ? '' : 'bg-surface-900/20'}`}>
                <td className="px-3 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white font-medium text-sm">{extra.description}</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {extra.isIncludedInPackage && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-900/40 text-primary-300">Included</span>
                      )}
                      {extra.isPricePending && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400 flex items-center gap-0.5">
                          <AlertTriangle size={9} /> Pending
                        </span>
                      )}
                      {extra.isAutoAdded && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-600 text-gray-400">Auto</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="number"
                    min="1"
                    value={extra.quantity}
                    onChange={(e) => updateExtraQuantity(extra.id, parseInt(e.target.value) || 1)}
                    className="w-16 bg-surface-900 border border-surface-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500"
                  />
                </td>
                <td className="px-3 py-2.5 text-gray-400 text-xs">{extra.unit}</td>
                <td className="px-3 py-2.5 text-gray-300">
                  {extra.isIncludedInPackage ? '\$0.00' : formatCurrency(extra.unitPrice)}
                </td>
                <td className="px-3 py-2.5 text-white font-medium">
                  {formatCurrency(calculateLineTotal(extra))}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <button
                    onClick={() => removeExtra(extra.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {selectedExtras.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500 text-sm">
                  No extras selected. Click "Add Extra" to browse the catalogue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedExtras.some((e) => e.isPricePending) && (
        <div className="p-3 bg-yellow-900/10 border border-yellow-900/30 rounded-lg flex items-start gap-2 text-yellow-400 text-sm">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <p>Final quote blocked until pending prices are resolved or excluded.</p>
        </div>
      )}

      <div className="flex justify-end items-center p-3 bg-surface-900/50 rounded-lg">
        <span className="text-gray-400 mr-4 text-sm">Extras Total</span>
        <span className="text-lg font-bold text-white">{formatCurrency(extrasTotal)}</span>
      </div>
    </div>
  );
};
