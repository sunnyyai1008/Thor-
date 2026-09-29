import React, { useState } from 'react';
import { usePricingStore } from '../../stores/pricingStore';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { Lock, ShieldAlert } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

const getMarginColor = (margin: number) => {
  if (margin >= 20) return 'text-green-400';
  if (margin >= 15) return 'text-yellow-400';
  return 'text-red-400';
};

export const OwnerMarginPanel: React.FC = () => {
  const { isOwner } = usePricingStore();
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);

  const [approvedDiscount, setApprovedDiscount] = useState(0);

  if (!isOwner) return null;

  // Calculate equipment costs (cost price)
  let equipmentCosts = 0;
  let equipmentRevenue = 0;
  if (selectedPanels.product) {
    equipmentCosts += selectedPanels.product.costPrice * selectedPanels.quantity;
    equipmentRevenue += selectedPanels.product.sellPrice * selectedPanels.quantity;
  }
  for (const inv of selectedInverters) {
    if (inv.product) {
      equipmentCosts += inv.product.costPrice * inv.quantity;
      equipmentRevenue += inv.product.sellPrice * inv.quantity;
    }
  }
  for (const bat of selectedBatteries) {
    if (bat.product) {
      equipmentCosts += bat.product.costPrice * bat.quantity;
      equipmentRevenue += bat.product.sellPrice * bat.quantity;
    }
  }
  for (const ctrl of selectedControllers) {
    if (ctrl.product) {
      equipmentCosts += ctrl.product.costPrice * ctrl.quantity;
      equipmentRevenue += ctrl.product.sellPrice * ctrl.quantity;
    }
  }
  for (const gw of selectedGateways) {
    if (gw.product) {
      equipmentCosts += gw.product.costPrice * gw.quantity;
      equipmentRevenue += gw.product.sellPrice * gw.quantity;
    }
  }

  const installationCosts = equipmentRevenue > 0 ? 2000 : 0; // Owner-configurable flat rate
  const extraCosts = selectedExtras.reduce((sum, e) => sum + (e.lineTotal || 0), 0);
  const totalCost = equipmentCosts + installationCosts + extraCosts;

  const totalRevenue = equipmentRevenue + extraCosts; // ex-GST revenue
  const profitBeforeDiscount = totalRevenue - totalCost;
  const profitAfterDiscount = profitBeforeDiscount - approvedDiscount;
  const marginAfterDiscount = totalRevenue > 0 ? (profitAfterDiscount / totalRevenue) * 100 : 0;

  const minMarginPercent = 15;
  const minProfitRequired = totalRevenue * (minMarginPercent / 100);
  const discountHeadroom = Math.max(0, profitAfterDiscount - minProfitRequired);

  return (
    <div className="bg-surface-800 border-2 border-red-900/40 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 bg-red-900/20 rounded-bl-lg">
        <Lock size={14} className="text-red-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-400" />
          Owner Margin Analysis
        </h2>
        <p className="text-xs text-red-400 mt-1">This information is not visible to sales accounts</p>
      </div>

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Cost Breakdown</span>
        <CostRow label="Equipment Costs" value={formatCurrency(equipmentCosts)} />
        <CostRow label="Installation Costs" value={formatCurrency(installationCosts)} />
        <CostRow label="Extra Costs" value={formatCurrency(extraCosts)} />
        <hr className="border-surface-600" />
        <CostRow label="Total Cost" value={formatCurrency(totalCost)} bold />
      </div>

      {/* Profit Analysis */}
      <div className="flex flex-col gap-2.5 text-sm bg-surface-900 p-4 rounded-lg">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Profit Analysis</span>
        <CostRow label="Total Revenue (ex-GST)" value={formatCurrency(totalRevenue)} />
        <div className={`flex justify-between font-medium ${profitBeforeDiscount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>Company Profit Before Discount</span>
          <span>{formatCurrency(profitBeforeDiscount)}</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-gray-400">Approved Discount</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={approvedDiscount || ''}
              onChange={(e) => setApprovedDiscount(Number(e.target.value) || 0)}
              placeholder="0.00"
              className="bg-surface-700 border border-surface-500 rounded-md py-1.5 pl-7 pr-3 w-32 text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <hr className="border-surface-600" />

        <div className={`flex justify-between text-base font-bold ${profitAfterDiscount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>Company profit remaining after discount</span>
          <span>{formatCurrency(profitAfterDiscount)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Margin After Discount</span>
          <span className={`font-semibold ${getMarginColor(marginAfterDiscount)}`}>
            {marginAfterDiscount.toFixed(1)}%
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-surface-700">
          <span>Discount Headroom Above Minimum ({minMarginPercent}%)</span>
          <span>{formatCurrency(discountHeadroom)}</span>
        </div>
      </div>
    </div>
  );
};

function CostRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold text-white' : 'text-gray-300'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
