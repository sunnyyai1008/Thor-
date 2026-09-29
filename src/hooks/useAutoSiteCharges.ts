import { useEffect } from 'react';
import { useCalculatorStore } from '../stores/calculatorStore';
import { usePricingStore } from '../stores/pricingStore';
import type { SelectedExtra } from '../types/extras';

export const useAutoSiteCharges = () => {
  const customerInfo = useCalculatorStore((s) => s.customerInfo);
  const selectedPanels = useCalculatorStore((s) => s.systemSelection.selectedPanels);
  const selectedBatteries = useCalculatorStore((s) => s.systemSelection.selectedBatteries);
  const selectedExtras = useCalculatorStore((s) => s.selectedExtras);
  const addExtra = useCalculatorStore((s) => s.addExtra);
  const removeExtra = useCalculatorStore((s) => s.removeExtra);
  const updateExtraQuantity = useCalculatorStore((s) => s.updateExtraQuantity);

  const installationCosts = usePricingStore((s) => s.installationCosts);

  useEffect(() => {
    const panelQty = selectedPanels.quantity || 0;
    const hasPanels = !!selectedPanels.product && panelQty > 0;
    const hasBattery = selectedBatteries.some((b) => !!b.product && b.quantity > 0);

    // 1. Storey Charge Handling
    const storeyExtraId = 'auto-storey-charge';
    const existingStoreyExtra = selectedExtras.find((e) => e.id === storeyExtraId);

    if (customerInfo.storeys === 2 && installationCosts.twoStoreyFee > 0) {
      if (!existingStoreyExtra) {
        addExtra({
          id: storeyExtraId,
          catalogueItemId: 'auto-double-storey',
          description: 'Double Storey Site Access Surcharge',
          quantity: 1,
          unit: 'Fixed',
          unitPrice: installationCosts.twoStoreyFee,
          lineTotal: installationCosts.twoStoreyFee,
          isIncludedInPackage: false,
          isPricePending: false,
          isAutoAdded: true,
          autoAddReason: 'Automatically applied for 2-storey building height',
        });
      } else if (existingStoreyExtra.unitPrice !== installationCosts.twoStoreyFee) {
        // Price changed in settings
        removeExtra(storeyExtraId);
        addExtra({
          ...existingStoreyExtra,
          unitPrice: installationCosts.twoStoreyFee,
          lineTotal: installationCosts.twoStoreyFee,
        });
      }
    } else if (customerInfo.storeys === 3 && installationCosts.threeStoreyFee > 0) {
      if (!existingStoreyExtra || existingStoreyExtra.catalogueItemId !== 'auto-three-storey') {
        if (existingStoreyExtra) removeExtra(storeyExtraId);
        addExtra({
          id: storeyExtraId,
          catalogueItemId: 'auto-three-storey',
          description: '3+ Storey Specialist Access Surcharge',
          quantity: 1,
          unit: 'Fixed',
          unitPrice: installationCosts.threeStoreyFee,
          lineTotal: installationCosts.threeStoreyFee,
          isIncludedInPackage: false,
          isPricePending: false,
          isAutoAdded: true,
          autoAddReason: 'Automatically applied for 3+ storey height access',
        });
      }
    } else if (customerInfo.storeys === 1 && existingStoreyExtra) {
      // Reverted to single storey
      removeExtra(storeyExtraId);
    }

    // 2. Roof Material Charge Handling
    const roofExtraId = 'auto-roof-charge';
    const existingRoofExtra = selectedExtras.find((e) => e.id === roofExtraId);
    const roofType = customerInfo.roofType;
    const roofRate = installationCosts.roofTypeFees[roofType] || 0;

    if (hasPanels && roofRate > 0) {
      const lineTotal = roofRate * panelQty;
      if (!existingRoofExtra) {
        addExtra({
          id: roofExtraId,
          catalogueItemId: `auto-roof-${roofType.toLowerCase()}`,
          description: `${roofType} Roof Complexity Mounting`,
          quantity: panelQty,
          unit: 'Per Panel',
          unitPrice: roofRate,
          lineTotal: lineTotal,
          isIncludedInPackage: false,
          isPricePending: false,
          isAutoAdded: true,
          autoAddReason: `Automatically calculated based on ${panelQty} panels on ${roofType} roof`,
        });
      } else {
        // Update quantity if panel count changed
        if (existingRoofExtra.quantity !== panelQty || existingRoofExtra.unitPrice !== roofRate) {
          updateExtraQuantity(roofExtraId, panelQty);
        }
      }
    } else if ((!hasPanels || roofRate === 0) && existingRoofExtra) {
      removeExtra(roofExtraId);
    }

    // 3. Battery Location Charge Handling
    const locationExtraId = 'auto-battery-loc-charge';
    const existingLocExtra = selectedExtras.find((e) => e.id === locationExtraId);
    const locFee = installationCosts.batteryLocationFees[customerInfo.batteryLocation] || 0;

    if (hasBattery && locFee > 0) {
      if (!existingLocExtra) {
        addExtra({
          id: locationExtraId,
          catalogueItemId: `auto-bat-loc-${customerInfo.batteryLocation.toLowerCase().replace(/\s+/g, '-')}`,
          description: `${customerInfo.batteryLocation} Enclosure & Run Surcharge`,
          quantity: 1,
          unit: 'Fixed',
          unitPrice: locFee,
          lineTotal: locFee,
          isIncludedInPackage: false,
          isPricePending: false,
          isAutoAdded: true,
          autoAddReason: `Applied for ${customerInfo.batteryLocation} battery installation requirement`,
        });
      }
    } else if ((!hasBattery || locFee === 0) && existingLocExtra) {
      removeExtra(locationExtraId);
    }
  }, [
    customerInfo.storeys,
    customerInfo.roofType,
    customerInfo.batteryLocation,
    selectedPanels.product,
    selectedPanels.quantity,
    selectedBatteries,
    installationCosts,
  ]);
};
