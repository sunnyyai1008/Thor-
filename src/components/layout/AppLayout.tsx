import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { ModeSelector } from './ModeSelector';
import { ChevronUp, ChevronDown, DollarSign } from 'lucide-react';
import { useCalculatorStore } from '../../stores/calculatorStore';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, sidebar }) => {
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Quick total calculation for mobile sticky bar
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedInverters = useCalculatorStore((s) => s.systemSelection.selectedInverters);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedControllers = useCalculatorStore((s) => s.systemSelection.selectedControllers);
  const selectedGateways = useCalculatorStore((s) => s.systemSelection.selectedGateways);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);
  const state = useCalculatorStore((s) => s.state);
  const customerInfo = useCalculatorStore((s) => s.customerInfo);

  let systemSubtotal = 0;
  if (selectedPanels.product) systemSubtotal += selectedPanels.product.sellPrice * selectedPanels.quantity;
  for (const inv of selectedInverters) if (inv.product) systemSubtotal += inv.product.sellPrice * inv.quantity;
  for (const bat of selectedBatteries) if (bat.product) systemSubtotal += bat.product.sellPrice * bat.quantity;
  for (const ctrl of selectedControllers) if (ctrl.product) systemSubtotal += ctrl.product.sellPrice * ctrl.quantity;
  for (const gw of selectedGateways) if (gw.product) systemSubtotal += gw.product.sellPrice * gw.quantity;

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (e.lineTotal || 0), 0);
  const contractTotal = (systemSubtotal + extrasTotal) * 1.1;
  const vicRebate = state === 'VIC' && customerInfo.vicRebate ? 1400 : 0;
  const stcValue = systemSubtotal > 0 ? 3500 : 0;
  const vicLoan = state === 'VIC' && customerInfo.vicLoan ? 1400 : 0;
  const quickUpfront = Math.max(0, contractTotal - vicRebate - stcValue - vicLoan);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d17] text-slate-100 font-sans pb-20 lg:pb-6">
      {/* Top Header */}
      <AppHeader />

      {/* Mode Selector */}
      <ModeSelector />

      {/* Main Body Grid */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column - System Config, Extras, Customer Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {children}
          </div>

          {/* Right Column - Desktop Sticky Price Summary & Owner Margin */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
            {sidebar}
          </aside>

          {/* Mobile Bottom Stacked Sidebar */}
          <div className="lg:hidden col-span-1 space-y-4 mt-2">
            {sidebar}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Price Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121526]/95 backdrop-blur-xl border-t border-white/[0.1] px-4 py-2.5 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upfront Payable</span>
          <div className="text-xl font-extrabold text-indigo-400 font-mono">
            {formatCurrency(quickUpfront)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('customer-price-summary-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Quote</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
