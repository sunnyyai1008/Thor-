import React, { useState, useMemo } from 'react';
import { usePricingStore, type InstallationCostConfig } from '../../stores/pricingStore';
import { brands } from '../../data/products';
import {
  X,
  SlidersHorizontal,
  Package,
  Wrench,
  TrendingUp,
  RotateCcw,
  Search,
  Check,
  Sparkles,
  Shield,
  DollarSign,
  AlertCircle,
  Building,
  Home,
  Save,
} from 'lucide-react';
import type { ProductCategory, StockStatus } from '../../types/product';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);

export const OwnerPricingSettingsModal: React.FC = () => {
  const isSettingsOpen = usePricingStore((s) => s.isSettingsOpen);
  const setIsSettingsOpen = usePricingStore((s) => s.setIsSettingsOpen);
  const isOwner = usePricingStore((s) => s.isOwner);
  const setIsOwner = usePricingStore((s) => s.setIsOwner);

  const products = usePricingStore((s) => s.products);
  const updateProductPricing = usePricingStore((s) => s.updateProductPricing);
  const resetProductPricing = usePricingStore((s) => s.resetProductPricing);

  const installationCosts = usePricingStore((s) => s.installationCosts);
  const updateInstallationCosts = usePricingStore((s) => s.updateInstallationCosts);

  const incentiveConfig = usePricingStore((s) => s.incentiveConfig);
  const updateIncentiveConfig = usePricingStore((s) => s.updateIncentiveConfig);
  const minimumMarginPercent = usePricingStore((s) => s.minimumMarginPercent);
  const setMinimumMarginPercent = usePricingStore((s) => s.setMinimumMarginPercent);

  const [activeTab, setActiveTab] = useState<'products' | 'installation' | 'incentives'>('products');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  // Local state for installation form to allow clean edits
  const [localInstall, setLocalInstall] = useState<InstallationCostConfig>(installationCosts);

  if (!isSettingsOpen) return null;

  const triggerSaveToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleInstallCostSave = () => {
    updateInstallationCosts(localInstall);
    triggerSaveToast();
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brandId.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0e1120] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#141829] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Owner Pricing & Cost Settings</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Owner Privileged
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure wholesale equipment prices, retail selling rates, and labor installation fees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedToast && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-5 bg-[#0b0d17] border-b border-white/[0.06] overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalogue & Pricing ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('installation')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'installation'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Installation & Site Labor Costs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('incentives')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'incentives'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Incentives, STCs & Margins</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: PRODUCT CATALOGUE */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Category Pills & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'panel', label: 'Panels' },
                    { id: 'inverter', label: 'Inverters' },
                    { id: 'battery', label: 'Batteries' },
                    { id: 'accessory', label: 'Gateways / Acc' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setProductCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        productCategoryFilter === cat.id
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                          : 'bg-[#141829] text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filter model or brand..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-[#0b0d17] border border-white/[0.1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all product pricing back to default catalogue values?')) {
                        resetProductPricing();
                        triggerSaveToast();
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all border border-white/[0.06] cursor-pointer"
                    title="Reset to factory defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Pricing Table */}
              <div className="rounded-xl border border-white/[0.08] bg-[#070912] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#121526] text-slate-400 uppercase text-[10px] font-semibold border-b border-white/[0.08]">
                      <tr>
                        <th className="px-4 py-3">Product Name & Spec</th>
                        <th className="px-3 py-3 w-32">Wholesale Cost ($)</th>
                        <th className="px-3 py-3 w-32">Retail Sell ($)</th>
                        <th className="px-3 py-3 w-28 text-center">Gross Profit</th>
                        <th className="px-3 py-3 w-28 text-center">Priority Stock</th>
                        <th className="px-3 py-3 w-32">Stock Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredProducts.map((p) => {
                        const brand = brands.find((b) => b.id === p.brandId)?.name || '';
                        const profit = (p.sellPrice || 0) - (p.costPrice || 0);
                        const marginPct = p.sellPrice > 0 ? (profit / p.sellPrice) * 100 : 0;

                        return (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Product Info */}
                            <td className="px-4 py-3">
                              <div className="font-semibold text-white">{p.name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <span>{brand}</span>
                                <span>•</span>
                                <span className="capitalize">{p.category}</span>
                                {p.powerWatts && (
                                  <>
                                    <span>•</span>
                                    <span>{p.powerWatts}W</span>
                                  </>
                                )}
                                {p.capacityKwh && (
                                  <>
                                    <span>•</span>
                                    <span>{p.capacityKwh} kWh</span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Cost Price */}
                            <td className="px-3 py-3">
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                                <input
                                  type="number"
                                  value={p.costPrice || ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    updateProductPricing(p.id, val, p.sellPrice, p.isPriority, p.stockStatus);
                                    triggerSaveToast();
                                  }}
                                  className="w-full bg-[#121526] border border-white/[0.1] rounded-lg pl-6 pr-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                            </td>

                            {/* Sell Price */}
                            <td className="px-3 py-3">
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                                <input
                                  type="number"
                                  value={p.sellPrice || ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    updateProductPricing(p.id, p.costPrice, val, p.isPriority, p.stockStatus);
                                    triggerSaveToast();
                                  }}
                                  className="w-full bg-[#121526] border border-white/[0.1] rounded-lg pl-6 pr-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 font-bold"
                                />
                              </div>
                            </td>

                            {/* Gross Profit & Margin */}
                            <td className="px-3 py-3 text-center">
                              <div className="font-mono font-bold text-emerald-400">
                                +{formatCurrency(profit)}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {marginPct.toFixed(1)}% margin
                              </div>
                            </td>

                            {/* Priority Star Toggle */}
                            <td className="px-3 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  updateProductPricing(p.id, p.costPrice, p.sellPrice, !p.isPriority, p.stockStatus);
                                  triggerSaveToast();
                                }}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  p.isPriority
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                                    : 'bg-[#121526] text-slate-500 border-white/[0.06] hover:text-white'
                                }`}
                                title="Toggle Priority to Sell"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </td>

                            {/* Stock Status */}
                            <td className="px-3 py-3">
                              <select
                                value={p.stockStatus || 'in_stock'}
                                onChange={(e) => {
                                  updateProductPricing(p.id, p.costPrice, p.sellPrice, p.isPriority, e.target.value as StockStatus);
                                  triggerSaveToast();
                                }}
                                className="w-full bg-[#121526] border border-white/[0.1] rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="discontinued">Discontinued</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALLATION & LABOR COSTS */}
          {activeTab === 'installation' && (
            <div className="space-y-6">
              {/* Primary Base Installation Rates */}
              <div className="p-5 rounded-2xl bg-[#070912] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Wrench className="w-4 h-4 text-indigo-400" />
                  <span>Base Contractor & Electrician Rates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Base Solar PV Installation Labor ($ AUD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="50"
                        value={localInstall.baseSolarInstall}
                        onChange={(e) =>
                          setLocalInstall({ ...localInstall, baseSolarInstall: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Standard residential rooftop solar installation fee</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Battery Installation Add-on ($ AUD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="50"
                        value={localInstall.batteryInstallAddon}
                        onChange={(e) =>
                          setLocalInstall({ ...localInstall, batteryInstallAddon: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Battery commissioning, conduit run, and circuit isolation</p>
                  </div>
                </div>
              </div>

              {/* Multi-Storey Surcharges */}
              <div className="p-5 rounded-2xl bg-[#070912] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Building Storey Access Surcharges ($ AUD)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Double Storey Surcharge
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="50"
                        value={localInstall.twoStoreyFee}
                        onChange={(e) =>
                          setLocalInstall({ ...localInstall, twoStoreyFee: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      3+ Storey Surcharge
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="50"
                        value={localInstall.threeStoreyFee}
                        onChange={(e) =>
                          setLocalInstall({ ...localInstall, threeStoreyFee: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Roof Complexity Rates */}
              <div className="p-5 rounded-2xl bg-[#070912] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Home className="w-4 h-4 text-purple-400" />
                  <span>Roof Surface Complexity Rates ($ per panel)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(localInstall.roofTypeFees).map(([roof, fee]) => (
                    <div key={roof}>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 truncate">
                        {roof} Roof
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="5"
                          value={fee}
                          onChange={(e) =>
                            setLocalInstall({
                              ...localInstall,
                              roofTypeFees: {
                                ...localInstall.roofTypeFees,
                                [roof]: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Battery Location Fees */}
              <div className="p-5 rounded-2xl bg-[#070912] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Battery Location Surcharges ($ AUD)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(localInstall.batteryLocationFees).map(([loc, fee]) => (
                    <div key={loc}>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 truncate">
                        {loc}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="25"
                          value={fee}
                          onChange={(e) =>
                            setLocalInstall({
                              ...localInstall,
                              batteryLocationFees: {
                                ...localInstall.batteryLocationFees,
                                [loc]: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleInstallCostSave}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Installation Rates</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INCENTIVES, STCS & MARGINS */}
          {activeTab === 'incentives' && (
            <div className="space-y-6">
              {/* STC Config */}
              <div className="p-5 rounded-2xl bg-[#070912] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Clean Energy Regulator STC Market Price</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Spot STC Trading Price ($ per Certificate)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="1"
                        value={incentiveConfig.stcPrice}
                        onChange={(e) => {
                          updateIncentiveConfig({ stcPrice: parseFloat(e.target.value) || 39 });
                          triggerSaveToast();
                        }}
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Typical Australian spot market range: $38 - $40</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Minimum Required Margin Floor (%)
                    </label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">%</span>
                      <input
                        type="number"
                        step="1"
                        min="5"
                        max="50"
                        value={minimumMarginPercent}
                        onChange={(e) => {
                          setMinimumMarginPercent(parseFloat(e.target.value) || 15);
                          triggerSaveToast();
                        }}
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-3 pr-7 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Triggers margin warning alerts if profit drops below this</p>
                  </div>
                </div>
              </div>

              {/* State Rebate Defaults */}
              <div className="p-5 rounded-2xl bg-[#070912] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span>Solar Victoria Rebate & Loan Thresholds</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      VIC Solar Victoria Upfront Rebate ($ AUD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="100"
                        value={incentiveConfig.vicRebateAmount}
                        onChange={(e) => {
                          updateIncentiveConfig({ vicRebateAmount: parseFloat(e.target.value) || 1400 });
                          triggerSaveToast();
                        }}
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      VIC 0% Interest Loan Financing Amount ($ AUD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="100"
                        value={incentiveConfig.vicLoanAmount}
                        onChange={(e) => {
                          updateIncentiveConfig({ vicLoanAmount: parseFloat(e.target.value) || 1400 });
                          triggerSaveToast();
                        }}
                        className="w-full bg-[#121526] border border-white/[0.1] rounded-xl pl-7 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#141829] border-t border-white/[0.08]">
          <span className="text-xs text-slate-400">
            Changes apply in real time and are saved to browser storage.
          </span>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
