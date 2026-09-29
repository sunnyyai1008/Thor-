import React, { useState } from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { QuotePdfModal } from '../quotes/QuotePdfModal';
import {
  AlertCircle,
  FileText,
  Save,
  Tag,
  ShieldCheck,
  CheckCircle,
  Download,
  Info,
  DollarSign,
  TrendingDown,
  ChevronRight,
  GitCompare,
} from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(val);

export const CustomerPriceSummary: React.FC = () => {
  const state = useCalculatorStore((s) => s.state);
  const customerInfo = useCalculatorStore((s) => s.customerInfo);
  const isDirty = useCalculatorStore((s) => s.isDirty);
  const markClean = useCalculatorStore((s) => s.markClean);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);

  const customerSummary = usePricingStore((s) => s.customerSummary);
  const quoteStatus = useQuoteStore((s) => s.quoteStatus);
  const requestDiscount = useQuoteStore((s) => s.requestDiscount);
  const saveDraft = useQuoteStore((s) => s.saveDraft);
  const discountApproval = useQuoteStore((s) => s.discountApproval);

  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [conflictResolved, setConflictResolved] = useState(false);

  // Compute live subtotal
  let systemSubtotal = 0;
  if (selectedPanels.product) systemSubtotal += selectedPanels.product.sellPrice * selectedPanels.quantity;
  for (const inv of selectedInverters) if (inv.product) systemSubtotal += inv.product.sellPrice * inv.quantity;
  for (const bat of selectedBatteries) if (bat.product) systemSubtotal += bat.product.sellPrice * bat.quantity;
  for (const ctrl of selectedControllers) if (ctrl.product) systemSubtotal += ctrl.product.sellPrice * ctrl.quantity;
  for (const gw of selectedGateways) if (gw.product) systemSubtotal += gw.product.sellPrice * gw.quantity;

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (e.lineTotal || 0), 0);
  const subtotalExGST = systemSubtotal + extrasTotal;
  const gstAmount = subtotalExGST * 0.1;
  const contractTotal = subtotalExGST * 1.1;

  // Incentives
  const vicRebate = state === 'VIC' && customerInfo.vicRebate ? 1400 : 0;
  // Sized STC formula or base placeholder
  const panelKw = selectedPanels.product ? (selectedPanels.quantity * selectedPanels.product.powerWatts) / 1000 : 0;
  const stcValue = panelKw > 0 ? Math.round(panelKw * 1.185 * 9 * 39) : systemSubtotal > 0 ? 3500 : 0;
  const totalIncentives = vicRebate + stcValue;
  const amountAfterIncentives = Math.max(0, contractTotal - totalIncentives);

  const vicLoan = state === 'VIC' && customerInfo.vicLoan ? 1400 : 0;
  const approvedDiscount = customerSummary?.approvedDiscount || 0;
  const upfrontPayable = Math.max(0, amountAfterIncentives - vicLoan - approvedDiscount);

  const handleSave = () => {
    saveDraft({
      status: 'draft',
      pricing: {
        ...customerSummary,
        systemSubtotal,
        extrasTotal,
        contractTotalIncGST: contractTotal,
        amountAfterIncentives,
        upfrontPayable,
      },
    });
    markClean();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(requestedAmount) || 0;
    if (amt > 0) {
      requestDiscount(amt, discountReason);
      setDiscountModalOpen(false);
      setRequestedAmount('');
      setDiscountReason('');
    }
  };

  const statusBadge = () => {
    switch (quoteStatus) {
      case 'discount_requested':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Discount Pending Approval</span>;
      case 'discount_approved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Discount Approved</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/[0.08] text-slate-300 border border-white/[0.1]">Draft Quote</span>;
    }
  };

  return (
    <div id="customer-price-summary-card" className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.1] shadow-2xl relative">
      {/* Decorative gradient corner glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Customer Price Summary</h2>
          <p className="text-[11px] text-slate-400">Formal financial quote breakdown</p>
        </div>
        {statusBadge()}
      </div>

      {/* Financial Rows */}
      <div className="space-y-2.5 text-xs">
        {/* System Subtotal */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">System Equipment Subtotal</span>
          <span className="font-mono font-semibold text-slate-200">{formatCurrency(systemSubtotal)}</span>
        </div>

        {/* Extras Subtotal */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Site Works & Add-Ons</span>
          <span className="font-mono font-semibold text-slate-200">{formatCurrency(extrasTotal)}</span>
        </div>

        {/* GST Amount */}
        <div className="flex justify-between items-center py-1 text-slate-500">
          <span>Includes GST (10%)</span>
          <span className="font-mono">{formatCurrency(gstAmount)}</span>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/[0.08] my-2" />

        {/* Contract Total Inc GST */}
        <div className="flex justify-between items-center py-1">
          <span className="font-bold text-white text-sm">Contract Total (inc. GST)</span>
          <span className="font-mono font-bold text-white text-sm">{formatCurrency(contractTotal)}</span>
        </div>

        {/* Incentive Deductions */}
        {(vicRebate > 0 || stcValue > 0) && (
          <div className="my-3 p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              <span>Government Incentives</span>
              <span className="font-mono">-{formatCurrency(totalIncentives)}</span>
            </div>

            {stcValue > 0 && (
              <div className="flex justify-between items-center text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  STC Solar Rebate (Clean Energy Reg)
                </span>
                <span className="font-mono font-semibold text-emerald-300">-{formatCurrency(stcValue)}</span>
              </div>
            )}

            {vicRebate > 0 && (
              <div className="flex justify-between items-center text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Solar Victoria State Rebate
                </span>
                <span className="font-mono font-semibold text-emerald-300">-{formatCurrency(vicRebate)}</span>
              </div>
            )}
          </div>
        )}

        {/* Amount After Incentives */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-300 font-medium">Amount After Incentives</span>
          <span className="font-mono font-bold text-slate-100">{formatCurrency(amountAfterIncentives)}</span>
        </div>

        {/* VIC Interest-Free Loan */}
        {vicLoan > 0 && (
          <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs">
            <span>VIC Interest-Free Loan (4 yrs)</span>
            <span className="font-mono font-bold">-{formatCurrency(vicLoan)}</span>
          </div>
        )}

        {/* Owner-Approved Discount Line */}
        {approvedDiscount > 0 && (
          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
              Owner-Approved Discount
            </span>
            <span className="font-mono font-extrabold text-purple-300">-{formatCurrency(approvedDiscount)}</span>
          </div>
        )}

        {/* Grand Total Hero Box */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 via-[#14182f] to-indigo-900/60 border border-indigo-500/40 shadow-lg shadow-indigo-950/50">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Final Upfront Payable
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-0.5">
            {formatCurrency(upfrontPayable)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Due upon installation completion & grid signoff</p>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {isDirty && (
        <div className="flex items-center gap-2 text-amber-400 text-xs mt-3 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Configuration modified — click "Save Quote"</span>
        </div>
      )}

      {saveToast && (
        <div className="flex items-center gap-2 text-emerald-400 text-xs mt-3 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Quote draft saved successfully</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 mt-4 pt-3 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Quote Draft</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDiscountModalOpen(true)}
            className="py-2 px-3 rounded-xl bg-[#141829] hover:bg-[#1a2037] border border-white/[0.1] hover:border-white/[0.2] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Request Discount</span>
          </button>

          <button
            type="button"
            onClick={() => setPdfModalOpen(true)}
            className="py-2 px-3 rounded-xl bg-[#141829] hover:bg-[#1a2037] border border-white/[0.1] hover:border-white/[0.2] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Quote PDF</span>
          </button>
        </div>
      </div>

      {/* Section 11: Conflict Reconciliation Dialog */}
      {quoteStatus === 'discount_approved' && isDirty && !conflictResolved && (
        <div className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <GitCompare className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Reconciliation Required: Pricing Modified</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            An owner discount of {formatCurrency(approvedDiscount)} was approved, but the system configuration was modified afterwards. Reconcile this quote to proceed:
          </p>
          <button
            type="button"
            onClick={() => setConflictResolved(true)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Reconcile & Keep Approved Discount
          </button>
        </div>
      )}

      {/* Customer Quotation PDF Preview & Print Modal */}
      <QuotePdfModal isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} />

      {/* Discount Request Modal */}
      {discountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121526] border border-indigo-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                Submit Discount Request
              </h3>
              <button
                type="button"
                onClick={() => setDiscountModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDiscountSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Discount Amount ($ AUD)</label>
                <input
                  type="number"
                  step="50"
                  required
                  placeholder="e.g. 500"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="w-full bg-[#070912] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Business Justification</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Match competitor price or multiple system bundle..."
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full bg-[#070912] border border-white/[0.1] rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
