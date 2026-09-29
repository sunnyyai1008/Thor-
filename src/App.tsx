import { AppLayout } from './components/layout/AppLayout'
import { CustomerSiteForm } from './components/customer/CustomerSiteForm'
import { OfficeNotes } from './components/customer/OfficeNotes'
import { PanelInverterMode } from './components/calculator/PanelInverterMode'
import { PanelBatteryComboMode } from './components/calculator/PanelBatteryComboMode'
import { SigenergyMode } from './components/calculator/SigenergyMode'
import { BatteryOnlyMode } from './components/calculator/BatteryOnlyMode'
import { ExtrasPanel } from './components/extras/ExtrasPanel'
import { CustomerPriceSummary } from './components/pricing/CustomerPriceSummary'
import { OwnerMarginPanel } from './components/pricing/OwnerMarginPanel'
import { useCalculatorStore } from './stores/calculatorStore'

function CalculatorContent() {
  const mode = useCalculatorStore((s) => s.mode)

  switch (mode) {
    case 'panel_inverter':
      return <PanelInverterMode />
    case 'panel_battery_combo':
      return <PanelBatteryComboMode />
    case 'sigenergy':
      return <SigenergyMode />
    case 'battery_only':
      return <BatteryOnlyMode />
    default:
      return <PanelInverterMode />
  }
}

function App() {
  const sidebar = (
    <div className="space-y-4">
      <CustomerPriceSummary />
      <OwnerMarginPanel />
    </div>
  )

  return (
    <AppLayout sidebar={sidebar}>
      <div className="space-y-4">
        <CustomerSiteForm />
        <CalculatorContent />
        <ExtrasPanel />
        <OfficeNotes />
      </div>
    </AppLayout>
  )
}

export default App
