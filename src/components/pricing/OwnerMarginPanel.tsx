import React, { useState } from 'react';
import { usePricingStore } from '../../stores/pricingStore';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { Lock, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle, Percent } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(val);

export const OwnerMarginPanel: React.FC = () => {
  const isOwner = usePricingStore((s) => s.isOwner);
  const setApprovedDiscountStore = usePricingStore((s) => s.setApprovedDiscount);

  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);

  const [approvedDiscount, setApprovedDiscount] = useState<number>(0);

  if (!isOwner) return null;

  // Cost & Revenue Calculation
  let equipmentCosts = 0;
  let equipmentRevenue = 0;

  if (selectedPanels.product) {
    equipmentCosts += (selectedPanels.product.costPrice || 0) * selectedPanels.quantity;
    equipmentRevenue += (selectedPanels.product.sellPrice || 0) * selectedPanels.quantity;
  }
  for (const inv of selectedInverters) {
    if (inv.product) {
      equipmentCosts += (inv.product.costPrice || 0) * inv.quantity;
      equipmentRevenue += (inv.product.sellPrice || 0) * inv.quantity;
    }
  }
  for (const bat of selectedBatteries) {
    if (bat.product) {
      equipmentCosts += (bat.product.costPrice || 0) * bat.quantity;
      equipmentRevenue += (bat.product.sellPrice || 0) * bat.quantity;
    }
  }
  for (const ctrl of selectedControllers) {
    if (ctrl.product) {
      equipmentCosts += (ctrl.product.costPrice || 0) * ctrl.quantity;
      equipmentRevenue += (ctrl.product.sellPrice || 0) * ctrl.quantity;
    }
  }
  for (const gw of selectedGateways) {
    if (gw.product) {
      equipmentCosts += (gw.product.costPrice || 0) * gw.quantity;
      equipmentRevenue += (gw.product.sellPrice || 0) * gw.quantity;
    }
  }

  // Installation flat fee & extras
  const installationCosts = equipmentRevenue > 0 ? 1800 : 0;
  const extraCosts = selectedExtras.reduce((sum, e) => sum + (e.lineTotal || 0) * 0.6, 0); // ~60% COGS estimate for site works
  const totalCost = equipmentCosts + installationCosts + extraCosts;

  const extrasRevenue = selectedExtras.reduce((sum, e) => sum + (e.lineTotal || 0), 0);
  const totalRevenue = equipmentRevenue + extrasRevenue; // ex-GST revenue
  const profitBeforeDiscount = totalRevenue - totalCost;
  const profitAfterDiscount = profitBeforeDiscount - approvedDiscount;
  const marginAfterDiscount = totalRevenue > 0 ? (profitAfterDiscount / totalRevenue) * 100 : 0;

  const minMarginPercent = 15;
  const minProfitRequired = totalRevenue * (minMarginPercent / 100);
  const discountHeadroom = Math.max(0, profitAfterDiscount - minProfitRequired);

  const handleDiscountChange = (val: number) => {
    setApprovedDiscount(val);
    setApprovedDiscountStore(val);
  };

  const getMarginBadge = (pct: number) => {
    if (pct >= 22) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-400" /> Healthy ({pct.toFixed(1)}%)
        </span>
      );
    }
    if (pct >= 15) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" /> Moderate ({pct.toFixed(1)}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-rose-400" /> Critical Margin ({pct.toFixed(1)}%)
      </span>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border-2 border-rose-900/50 shadow-2xl relative overflow-hidden">
      {/* Corner security ribbon */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-rose-900/30">
        <div className="flex items-center gap-2 text-rose-400">
          <Lock className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Owner Margin Analysis</span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
          Restricted View
        </span>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Underlying COGS Cost
        </span>

        <div className="flex justify-between items-center text-slate-300">
          <span>Equipment Wholesale Cost</span>
          <span className="font-mono">{formatCurrency(equipmentCosts)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span>Contractor Installation Cost</span>
          <span className="font-mono">{formatCurrency(installationCosts)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span>Extras Materials & Labour</span>
          <span className="font-mono">{formatCurrency(extraCosts)}</span>
        </div>

        <div className="flex justify-between items-center font-bold text-white pt-2 border-t border-white/[0.08]">
          <span>Total Combined Job Cost</span>
          <span className="font-mono text-rose-300">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      {/* Profit Analysis Container */}
      <div className="mt-4 p-4 rounded-xl bg-[#090b14] border border-white/[0.08] space-y-3 text-xs">
        <div className="flex justify-between items-center text-slate-400">
          <span>Total Revenue (ex-GST)</span>
          <span className="font-mono font-semibold text-white">{formatCurrency(totalRevenue)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-300 font-semibold">
          <span>Company Profit Before Discount</span>
          <span className="font-mono text-emerald-400">{formatCurrency(profitBeforeDiscount)}</span>
        </div>

        {/* Editable Discount Simulation Input */}
        <div className="flex items-center justify-between py-1 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
          <div>
            <span className="block font-semibold text-white">Approved Discount:</span>
            <span className="text-[10px] text-slate-400">Owner simulated allowance</span>
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
            <input
              type="number"
              min="0"
              step="50"
              value={approvedDiscount || ''}
              placeholder="0.00"
              onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
              className="w-28 bg-[#141829] border border-white/[0.1] rounded-lg pl-6 pr-2.5 py-1.5 text-white font-mono text-xs text-right focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Required label: Company profit remaining after discount */}
        <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center">
          <span className="font-bold text-white text-xs">Company profit remaining after discount:</span>
          <span
            className={`font-mono text-base font-extrabold ${
              profitAfterDiscount >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(profitAfterDiscount)}
          </span>
        </div>

        {/* Margin Status */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-slate-400 text-xs">Net Margin After Discount:</span>
          {getMarginBadge(marginAfterDiscount)}
        </div>

        {/* Headroom */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
          <span>Discount Headroom Above {minMarginPercent}% Minimum:</span>
          <span className="font-mono font-bold text-indigo-300">{formatCurrency(discountHeadroom)}</span>
        </div>
      </div>
    </div>
  );
};
