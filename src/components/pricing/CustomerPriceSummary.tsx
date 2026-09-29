import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { AlertCircle, FileText, Save, Tag } from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(val);

export const CustomerPriceSummary: React.FC = () => {
  const state = useCalculatorStore((s) => s.state);
  const customerInfo = useCalculatorStore((s) => s.customerInfo);
  const isDirty = useCalculatorStore((s) => s.isDirty);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);
  const customerSummary = usePricingStore((s) => s.customerSummary);
  const quoteStatus = useQuoteStore((s) => s.quoteStatus);

  // Calculate system subtotal from all selected products
  let systemSubtotal = 0;
  if (selectedPanels.product) {
    systemSubtotal += selectedPanels.product.sellPrice * selectedPanels.quantity;
  }
  for (const inv of selectedInverters) {
    if (inv.product) systemSubtotal += inv.product.sellPrice * inv.quantity;
  }
  for (const bat of selectedBatteries) {
    if (bat.product) systemSubtotal += bat.product.sellPrice * bat.quantity;
  }
  for (const ctrl of selectedControllers) {
    if (ctrl.product) systemSubtotal += ctrl.product.sellPrice * ctrl.quantity;
  }
  for (const gw of selectedGateways) {
    if (gw.product) systemSubtotal += gw.product.sellPrice * gw.quantity;
  }

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (e.lineTotal || 0), 0);
  const packageAdjustment = 0;
  const subtotalExGST = systemSubtotal + extrasTotal + packageAdjustment;
  const contractTotal = subtotalExGST * 1.1;

  const vicRebate = state === 'VIC' && customerInfo.vicRebate ? 1400 : 0;
  const stcValue = systemSubtotal > 0 ? 3500 : 0; // Placeholder STC
  const amountAfterIncentives = contractTotal - vicRebate - stcValue;

  const vicLoan = state === 'VIC' && customerInfo.vicLoan ? 1400 : 0;
  const approvedDiscount = customerSummary?.approvedDiscount || 0;
  const upfrontPayable = amountAfterIncentives - vicLoan - approvedDiscount;

  const statusLabel = quoteStatus || 'draft';
  const statusMap: Record<string, string> = {
    draft: 'Draft',
    discount_requested: 'Discount Requested',
    discount_approved: 'Discount Approved',
    finalized: 'Finalized',
    sent: 'Sent',
  };

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-white">Customer Price Summary</h2>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-600 text-gray-300">
          {statusMap[statusLabel] || 'Draft'}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
        <Row label="System Subtotal" value={formatCurrency(systemSubtotal)} />
        <Row label="Extras" value={formatCurrency(extrasTotal)} />
        {packageAdjustment !== 0 && (
          <Row label="Package Adjustment" value={formatCurrency(packageAdjustment)} accent />
        )}

        <hr className="border-surface-600 my-1" />

        <Row label="Contract Total (inc. GST)" value={formatCurrency(contractTotal)} bold />

        <hr className="border-surface-600 my-1" />

        {(vicRebate > 0 || stcValue > 0) && (
          <div className="flex flex-col gap-2">
            <span className="font-medium text-gray-300 text-xs uppercase tracking-wider">Incentive Deductions</span>
            {vicRebate > 0 && (
              <Row label="VIC Solar Rebate" value={`-${formatCurrency(vicRebate)}`} green />
            )}
            {stcValue > 0 && (
              <Row label="STC Value" value={`-${formatCurrency(stcValue)}`} green />
            )}
          </div>
        )}

        <Row label="Amount After Incentives" value={formatCurrency(amountAfterIncentives)} bold />

        {vicLoan > 0 && (
          <Row label="VIC Interest-Free Loan" value={`-${formatCurrency(vicLoan)}`} green />
        )}

        {approvedDiscount > 0 && (
          <div className="flex justify-between items-center py-1.5 px-3 bg-accent-500/10 rounded-lg">
            <span className="text-accent-400 font-medium">Owner-approved discount</span>
            <span className="text-accent-400 font-semibold">-{formatCurrency(approvedDiscount)}</span>
          </div>
        )}

        <hr className="border-surface-600 my-1" />

        <div className="flex justify-between items-center text-xl font-bold text-primary-400 pt-1">
          <span>Upfront Payable</span>
          <span>{formatCurrency(Math.max(0, upfrontPayable))}</span>
        </div>
      </div>

      {isDirty && (
        <div className="flex items-center gap-2 text-warning-500 text-sm mt-1">
          <AlertCircle size={14} />
          <span>Unsaved changes</span>
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-3">
        <button className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-colors cursor-pointer">
          <Save size={16} />
          Save Draft
        </button>
        <button className="w-full py-2.5 bg-surface-700 hover:bg-surface-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-colors cursor-pointer">
          <Tag size={16} />
          Request Discount
        </button>
        <button className="w-full py-2.5 border border-surface-500 hover:bg-surface-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-colors cursor-pointer">
          <FileText size={16} />
          Generate Quote PDF
        </button>
      </div>
    </div>
  );
};

function Row({ label, value, bold, green, accent }: {
  label: string; value: string; bold?: boolean; green?: boolean; accent?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold text-base' : ''}`}>
      <span className={green ? 'text-green-400' : accent ? 'text-primary-400' : 'text-gray-400'}>
        {label}
      </span>
      <span className={green ? 'text-green-400' : bold ? 'text-white' : 'text-gray-200'}>
        {value}
      </span>
    </div>
  );
}
