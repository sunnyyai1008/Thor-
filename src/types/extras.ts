export type ExtraCategory = 'roof_mounting' | 'battery_backup' | 'electrical_monitoring' | 'removal_specialist';

export type ChargingMethod = 'fixed' | 'per_item' | 'per_panel' | 'per_metre' | 'per_circuit';

export interface ExtraCatalogueItem {
  id: string;
  name: string;
  description?: string;
  category: ExtraCategory;
  chargingMethod: ChargingMethod;
  unitPrice: number;
  /** Quantity included in the bundle before overage charges apply */
  bundleIncludedQty: number | null;
  /** Price per unit after the included bundle quantity is exceeded */
  bundleOverageUnitPrice: number | null;
  isActive: boolean;
  /** Indicates if the final price needs manual adjustment or confirmation */
  isPricePending: boolean;
  isAutoAdded: boolean;
  /** Rules/conditions to automatically add this extra to a quote */
  autoAddRules?: Record<string, any>;
  preventDuplicate: boolean;
}

export interface SelectedExtra {
  id: string;
  catalogueItemId: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  /** If the extra is included as part of the system package */
  isIncludedInPackage: boolean;
  isPricePending: boolean;
  isAutoAdded: boolean;
  autoAddReason?: string;
  chargingMethod?: ChargingMethod;
  bundleIncludedQty?: number | null;
  bundleOverageUnitPrice?: number | null;
}

export interface ChargingRule {
  id: string;
  extraId: string;
  method: ChargingMethod;
  unitPrice: number;
  bundleIncludedQty?: number;
  bundleOverageUnitPrice?: number;
  /** Conditions under which this charging rule applies */
  conditions?: {
    panelCount?: number;
    systemSize?: number;
    batteryBrand?: string;
    [key: string]: any;
  };
}
