import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { CustomerSiteForm } from './components/customer/CustomerSiteForm';
import { OfficeNotes } from './components/customer/OfficeNotes';
import { PanelInverterMode } from './components/calculator/PanelInverterMode';
import { PanelBatteryComboMode } from './components/calculator/PanelBatteryComboMode';
import { SigenergyMode } from './components/calculator/SigenergyMode';
import { BatteryOnlyMode } from './components/calculator/BatteryOnlyMode';
import { ExtrasPanel } from './components/extras/ExtrasPanel';
import { CustomerPriceSummary } from './components/pricing/CustomerPriceSummary';
import { OwnerMarginPanel } from './components/pricing/OwnerMarginPanel';
import { OwnerPricingSettingsModal } from './components/pricing/OwnerPricingSettingsModal';
import { useCalculatorStore } from './stores/calculatorStore';
import { useAutoSiteCharges } from './hooks/useAutoSiteCharges';

function CalculatorContent() {
  const mode = useCalculatorStore((s) => s.mode);

  switch (mode) {
    case 'panel_inverter':
      return <PanelInverterMode />;
    case 'panel_battery_combo':
      return <PanelBatteryComboMode />;
    case 'sigenergy':
      return <SigenergyMode />;
    case 'battery_only':
      return <BatteryOnlyMode />;
    default:
      return <PanelInverterMode />;
  }
}

function App() {
  // Section 2 & 9: Explicit auto-added site charge rule synchronizer
  useAutoSiteCharges();

  // Section 11: Warning before leaving with unsaved changes
  const isDirty = useCalculatorStore((s) => s.isDirty);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const sidebar = (
    <div className="space-y-4">
      <CustomerPriceSummary />
      <OwnerMarginPanel />
    </div>
  );

  return (
    <>
      <AppLayout sidebar={sidebar}>
        <div className="space-y-4">
          <CustomerSiteForm />
          <CalculatorContent />
          <ExtrasPanel />
          <OfficeNotes />
        </div>
      </AppLayout>

      {/* Owner Pricing & Installation Rates Configuration Modal */}
      <OwnerPricingSettingsModal />
    </>
  );
}

export default App;
