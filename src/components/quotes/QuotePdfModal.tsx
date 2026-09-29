import React from 'react';
import { useCalculatorStore } from '../../stores/calculatorStore';
import { usePricingStore } from '../../stores/pricingStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { calculateLineTotal } from '../extras/ExtrasPanel';
import { X, Printer, Download, ShieldCheck, Sun, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(val);

export const QuotePdfModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const state = useCalculatorStore((s) => s.state);
  const phase = useCalculatorStore((s) => s.phase);
  const customerInfo = useCalculatorStore((s) => s.customerInfo);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);

  const customerSummary = usePricingStore((s) => s.customerSummary);
  const quoteStatus = useQuoteStore((s) => s.quoteStatus);
  const discountApproval = useQuoteStore((s) => s.discountApproval);

  if (!isOpen) return null;

  // Check for Price Pending items
  const pricePendingItems = selectedExtras.filter((e) => e.isPricePending);
  const isBlocked = pricePendingItems.length > 0;

  // Calculations
  let systemSubtotal = 0;
  if (selectedPanels.product) systemSubtotal += selectedPanels.product.sellPrice * selectedPanels.quantity;
  for (const inv of selectedInverters) if (inv.product) systemSubtotal += inv.product.sellPrice * inv.quantity;
  for (const bat of selectedBatteries) if (bat.product) systemSubtotal += bat.product.sellPrice * bat.quantity;
  for (const gw of selectedGateways) if (gw.product) systemSubtotal += gw.product.sellPrice * gw.quantity;

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + calculateLineTotal(e), 0);
  const subtotalExGST = systemSubtotal + extrasTotal;
  const gstAmount = subtotalExGST * 0.1;
  const contractTotal = subtotalExGST * 1.1;

  const vicRebate = state === 'VIC' && customerInfo.vicRebate ? 1400 : 0;
  const panelKw = selectedPanels.product ? (selectedPanels.quantity * selectedPanels.product.powerWatts) / 1000 : 0;
  const stcValue = panelKw > 0 ? Math.round(panelKw * 1.185 * 9 * 39) : systemSubtotal > 0 ? 3500 : 0;
  const totalIncentives = vicRebate + stcValue;
  const amountAfterIncentives = Math.max(0, contractTotal - totalIncentives);

  const vicLoan = state === 'VIC' && customerInfo.vicLoan ? 1400 : 0;
  const approvedDiscount = customerSummary?.approvedDiscount || (discountApproval?.amount || 0);
  const upfrontPayable = Math.max(0, amountAfterIncentives - vicLoan - approvedDiscount);

  const quoteNumber = `TS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const quoteDate = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Customer Quote Preview
            </span>
            <span className="text-xs text-slate-400">• Reference: {quoteNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isBlocked && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body / Printable Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 font-sans print:p-0">
          {/* Price Pending Blocker Banner */}
          {isBlocked ? (
            <div className="p-8 text-center bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-4 my-6">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-xl font-bold text-rose-900">Quotation Generation Blocked</h2>
              <p className="text-sm text-rose-700 max-w-md mx-auto">
                Specialist work item(s) are currently marked <strong>"Price Pending"</strong>. Per company policy, a final binding customer quote cannot be issued until these items are explicitly priced or excluded.
              </p>
              <div className="inline-block bg-white p-3 rounded-xl border border-rose-200 text-xs font-semibold text-rose-800">
                Pending: {pricePendingItems.map((e) => e.description).join(', ')}
              </div>
              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 cursor-pointer"
                >
                  Return to Calculator to Resolve
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Sun className="w-6 h-6 text-amber-500" />
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">
                      THOR <span className="text-indigo-600">SOLAR</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Clean Energy Council Approved Solar Retailer</p>
                  <p className="text-xs text-slate-500">Australian Business Number: 84 629 104 382</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                    Official Quotation
                  </span>
                  <div className="text-xs text-slate-600 font-mono">Quote Ref: {quoteNumber}</div>
                  <div className="text-xs text-slate-600">Date: {quoteDate}</div>
                  <div className="text-xs text-slate-500">Valid For: 14 Days</div>
                </div>
              </div>

              {/* Customer & Site Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Details
                  </span>
                  <div className="font-bold text-sm text-slate-900">{customerInfo.name || 'Valued Customer'}</div>
                  <div className="text-slate-600 mt-0.5">{customerInfo.phone || 'Phone not provided'}</div>
                  <div className="text-slate-600">{customerInfo.email || 'Email not provided'}</div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Installation Site
                  </span>
                  <div className="font-bold text-slate-900">
                    {customerInfo.installationAddress || 'Site address pending confirmation'}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Postcode: {customerInfo.postcode || 'N/A'} • Jurisdiction: {state} ({phase === 'single' ? 'Single Phase 230V' : 'Three Phase 415V'})
                  </div>
                  <div className="text-slate-600">
                    Roof: {customerInfo.roofType} • Building: {customerInfo.storeys} Storey
                  </div>
                </div>
              </div>

              {/* Proposed Equipment Specifications */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Proposed Clean Energy Equipment
                </h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Equipment Specification</th>
                        <th className="px-3 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPanels.product && (
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-500">Solar PV Array</td>
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {selectedPanels.product.name}
                            <div className="text-[11px] font-normal text-slate-500">Tier 1 Bloomberg Rated Monocrystalline PV</div>
                          </td>
                          <td className="px-3 py-3 text-center font-bold">{selectedPanels.quantity}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">
                            {((selectedPanels.quantity * selectedPanels.product.powerWatts) / 1000).toFixed(2)} kW
                          </td>
                        </tr>
                      )}

                      {selectedInverters.map((inv, idx) =>
                        inv.product ? (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-semibold text-slate-500">Inverter</td>
                            <td className="px-4 py-3 font-bold text-slate-900">
                              {inv.product.name}
                              <div className="text-[11px] font-normal text-slate-500">
                                {inv.product.type === 'hybrid' ? 'Hybrid Battery-Ready' : 'Grid-Tied String Inverter'}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center font-bold">{inv.quantity}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">
                              {((inv.product.powerWatts || 0) / 1000).toFixed(1)} kW
                            </td>
                          </tr>
                        ) : null
                      )}

                      {selectedBatteries.map((bat, idx) =>
                        bat.product ? (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-semibold text-slate-500">Battery Storage</td>
                            <td className="px-4 py-3 font-bold text-slate-900">
                              {bat.product.name}
                              <div className="text-[11px] font-normal text-slate-500">Lithium Iron Phosphate (LiFePO4) Modular Storage</div>
                            </td>
                            <td className="px-3 py-3 text-center font-bold">{bat.quantity}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">
                              {((bat.product.capacityKwh || 0) * bat.quantity).toFixed(1)} kWh
                            </td>
                          </tr>
                        ) : null
                      )}

                      {selectedGateways.map((gw, idx) =>
                        gw.product ? (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-semibold text-slate-500">Gateway / Backup</td>
                            <td className="px-4 py-3 font-bold text-slate-900">{gw.product.name}</td>
                            <td className="px-3 py-3 text-center font-bold">{gw.quantity}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">UPS 0ms</td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Site Works & Extras Table */}
              {selectedExtras.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Site Works, Compliance & Add-Ons
                  </h3>
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Scope Description</th>
                          <th className="px-3 py-2.5 text-center">Quantity</th>
                          <th className="px-4 py-2.5 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedExtras.map((extra) => (
                          <tr key={extra.id}>
                            <td className="px-4 py-2.5 font-medium text-slate-800">
                              {extra.description}
                              {extra.autoAddReason && (
                                <span className="block text-[10px] text-slate-500 italic">{extra.autoAddReason}</span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono">
                              {extra.quantity} {extra.unit}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                              {formatCurrency(calculateLineTotal(extra))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Calculation Summary (Section 10) */}
              <div className="border-t-2 border-slate-900 pt-5">
                <div className="max-w-xs ml-auto space-y-2 text-xs">
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>System Equipment Subtotal:</span>
                    <span className="font-mono font-semibold">{formatCurrency(systemSubtotal)}</span>
                  </div>

                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Site Works & Extras:</span>
                    <span className="font-mono font-semibold">{formatCurrency(extrasTotal)}</span>
                  </div>

                  <div className="flex justify-between py-1 text-slate-500">
                    <span>Includes GST (10%):</span>
                    <span className="font-mono">{formatCurrency(gstAmount)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 font-bold text-slate-900 border-t border-slate-200">
                    <span>Contract Total (inc. GST):</span>
                    <span className="font-mono text-sm">{formatCurrency(contractTotal)}</span>
                  </div>

                  {/* Incentive deductions */}
                  {totalIncentives > 0 && (
                    <div className="py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <div className="flex justify-between text-emerald-800 font-bold">
                        <span>Government Incentives:</span>
                        <span className="font-mono">-{formatCurrency(totalIncentives)}</span>
                      </div>
                      {stcValue > 0 && (
                        <div className="flex justify-between text-[11px] text-emerald-700">
                          <span>• Small-scale Tech Certificates (STCs):</span>
                          <span className="font-mono">-{formatCurrency(stcValue)}</span>
                        </div>
                      )}
                      {vicRebate > 0 && (
                        <div className="flex justify-between text-[11px] text-emerald-700">
                          <span>• Solar Victoria State Rebate:</span>
                          <span className="font-mono">-{formatCurrency(vicRebate)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between py-1 font-semibold text-slate-800">
                    <span>Amount After Incentives:</span>
                    <span className="font-mono">{formatCurrency(amountAfterIncentives)}</span>
                  </div>

                  {vicLoan > 0 && (
                    <div className="flex justify-between py-1 text-indigo-700 font-medium">
                      <span>VIC 0% Interest Loan (4 Years):</span>
                      <span className="font-mono">-{formatCurrency(vicLoan)}</span>
                    </div>
                  )}

                  {/* Section 10: Approved discount */}
                  {approvedDiscount > 0 && (
                    <div className="py-2 px-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
                      <div className="flex justify-between font-bold">
                        <span>Owner-approved discount:</span>
                        <span className="font-mono text-purple-700">-{formatCurrency(approvedDiscount)}</span>
                      </div>
                    </div>
                  )}

                  {/* Upfront Payable */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white mt-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      Final Upfront Payable
                    </span>
                    <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                      {formatCurrency(upfrontPayable)}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Payable upon certified electrical sign-off & grid connection
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Acceptance Signature Section */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-900 mb-6">Customer Acceptance</p>
                  <div className="border-b border-slate-300 pb-1 mb-1"></div>
                  <p>Signature: __________________________</p>
                  <p className="mt-1">Date: ____ / ____ / 2026</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-6">Authorized Installer Sign-off</p>
                  <div className="border-b border-slate-300 pb-1 mb-1"></div>
                  <p>Signature: __________________________</p>
                  <p className="mt-1">Thor Solar Representative</p>
                </div>
              </div>

              {/* Privacy Notice */}
              <p className="text-[10px] text-slate-400 text-center pt-4">
                * Note: Strictly confidential customer proposal. All equipment is Clean Energy Council compliant and eligible for standard warranties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
