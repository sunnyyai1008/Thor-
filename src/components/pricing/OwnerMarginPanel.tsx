import React, { useState } from 'react';
import { usePricingStore } from '../../stores/pricingStore';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { Lock, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle, Percent, SlidersHorizontal, Check, ThumbsDown } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(val);

export const OwnerMarginPanel: React.FC = () => {
  const isOwner = usePricingStore((s) => s.isOwner);
  const setIsSettingsOpen = usePricingStore((s) => s.setIsSettingsOpen);
  const setApprovedDiscountStore = usePricingStore((s) => s.setApprovedDiscount);
  const installationCostsConfig = usePricingStore((s) => s.installationCosts);

  const quoteStatus = useQuoteStore((s) => s.quoteStatus);
  const discountRequest = useQuoteStore((s) => s.discountRequest);
  const approveDiscount = useQuoteStore((s) => s.approveDiscount);
  const rejectDiscount = useQuoteStore((s) => s.rejectDiscount);

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

  // Installation dynamic fee & extras
  const baseInstall = equipmentRevenue > 0 ? (installationCostsConfig.baseSolarInstall || 1800) : 0;
  const batteryInstall = selectedBatteries.some((b) => b.product) ? (installationCostsConfig.batteryInstallAddon || 1200) : 0;
  const installationCosts = baseInstall + batteryInstall;
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

      {/* Pending Discount Approval Card (Section 11) */}
      {quoteStatus === 'discount_requested' && discountRequest && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Sales Discount Request Pending
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {formatCurrency(discountRequest.amount)}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 bg-black/40 p-2 rounded-lg border border-white/[0.06] italic">
            "{discountRequest.reason || 'No justification provided'}"
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                approveDiscount(discountRequest.amount, 'Owner');
                setApprovedDiscount(discountRequest.amount);
                setApprovedDiscountStore(discountRequest.amount);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve ${discountRequest.amount}</span>
            </button>
            <button
              type="button"
              onClick={() => rejectDiscount('Declined by owner')}
              className="py-1.5 px-3 rounded-lg bg-white/[0.08] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      )}

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

      {/* Button to open pricing and cost settings modal */}
      <button
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        className="w-full mt-3.5 py-2.5 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
        <span>Manage Equipment & Installation Rates</span>
      </button>
    </div>
  );
};
