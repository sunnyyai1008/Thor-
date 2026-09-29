import React, { useState, useMemo } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { extrasCatalogue } from '../../data/extras';
import { Search, Plus, X, AlertTriangle, Wrench, Check, Sparkles } from 'lucide-react';
import type { ExtraCatalogueItem, SelectedExtra } from '../../types/extras';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

const unitLabels: Record<string, string> = {
  fixed: 'Fixed',
  per_item: 'Per Item',
  per_panel: 'Per Panel',
  per_metre: 'Per Metre',
  per_circuit: 'Per Circuit',
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
    { key: 'all', label: 'All Items' },
    { key: 'roof_mounting', label: 'Roof & Mounting' },
    { key: 'battery_backup', label: 'Battery & Backup' },
    { key: 'electrical_monitoring', label: 'Electrical & Monitoring' },
    { key: 'removal_specialist', label: 'Removal & Specialist' },
  ];

  const filteredCatalogue = useMemo(() => {
    return extrasCatalogue.filter((item) => {
      if (!item.isActive) return false;
      const matchesSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const alreadySelected =
        item.preventDuplicate &&
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
  const hasPendingPrice = selectedExtras.some((e) => e.isPricePending);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Extras & Custom Site Work</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                {selectedExtras.length} Selected
              </span>
            </div>
            <p className="text-xs text-slate-400">Add-ons, switchboard upgrades, tilt frames, and specialist works</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCatalogue(!showCatalogue)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
            showCatalogue
              ? 'bg-white/[0.1] text-white hover:bg-white/[0.15]'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          <Plus className={`w-3.5 h-3.5 transition-transform ${showCatalogue ? 'rotate-45' : ''}`} />
          <span>{showCatalogue ? 'Close Catalogue' : 'Add Item'}</span>
        </button>
      </div>

      {/* Catalogue Drawer / Browser */}
      {showCatalogue && (
        <div className="mb-5 p-4 rounded-xl bg-[#090b14] border border-indigo-500/25 shadow-xl space-y-3.5">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-600/40'
                    : 'bg-[#121526] text-slate-400 hover:text-white hover:bg-[#1a2037]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search add-on catalogue (e.g. Smart Meter, Scissor lift, Bird proofing)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121526] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          {/* Grid of Addable Items */}
          <div className="max-h-64 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCatalogue.length > 0 ? (
              filteredCatalogue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddExtra(item)}
                  className="group flex items-center justify-between p-3 bg-[#121526]/80 hover:bg-[#1a2037] border border-white/[0.06] hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono text-emerald-400 font-semibold">
                        {item.isPricePending ? 'Price Pending' : formatCurrency(item.unitPrice)}
                      </span>
                      <span>•</span>
                      <span>{unitLabels[item.chargingMethod] || item.chargingMethod}</span>
                      {item.bundleIncludedQty && (
                        <span className="text-[10px] text-amber-300">
                          (incl. {item.bundleIncludedQty})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-slate-500 text-xs">
                No matching extras found. Try adjusting your search query.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Items Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#090b14]/60">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] text-slate-400 uppercase bg-[#101424] border-b border-white/[0.06]">
            <tr>
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-3 py-3 font-semibold w-24 text-center">Qty</th>
              <th className="px-3 py-3 font-semibold">Charging Rate</th>
              <th className="px-4 py-3 font-semibold text-right">Line Total</th>
              <th className="px-3 py-3 font-semibold w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {selectedExtras.map((extra) => (
              <tr key={extra.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium text-white">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-200">{extra.description}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {extra.isIncludedInPackage && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Included in Package
                        </span>
                      )}
                      {extra.isPricePending && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-2.5 h-2.5" /> Price Pending
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">{extra.unit}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <input
                    type="number"
                    min="1"
                    value={extra.quantity}
                    onChange={(e) => updateExtraQuantity(extra.id, parseInt(e.target.value) || 1)}
                    className="w-16 bg-[#141829] border border-white/[0.1] rounded-lg px-2 py-1 text-white text-center font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </td>
                <td className="px-3 py-3 text-slate-300 font-mono">
                  {extra.isIncludedInPackage ? '$0.00' : formatCurrency(extra.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white">
                  {formatCurrency(calculateLineTotal(extra))}
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => removeExtra(extra.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {selectedExtras.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
                  No additional site extras added. Click "Add Item" above to browse the catalogue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pending Price Blocker Notice */}
      {hasPendingPrice && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Price Pending Notice:</strong> One or more specialist line items require custom engineering assessment. Generating a finalized binding quote is blocked until priced or excluded.
          </p>
        </div>
      )}

      {/* Extras Subtotal Bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-xs">
        <span className="text-slate-400 font-medium">Total Additional Works:</span>
        <span className="text-base font-extrabold text-white font-mono">{formatCurrency(extrasTotal)}</span>
      </div>
    </div>
  );
};
