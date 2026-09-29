import type { BatteryCouplingType, PhaseType, Product } from './product';
import type { SelectedExtra } from './extras';
import type { CustomerPriceSummary, OwnerMarginPanel, State } from './pricing';

export type QuoteStatus = 'draft' | 'discount_requested' | 'discount_approved' | 'discount_rejected' | 'finalized' | 'sent';

export type CalculatorMode = 'panel_inverter' | 'panel_battery_combo' | 'sigenergy' | 'battery_only';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  installationAddress: string;
  postcode: string;
  /** Solar zone (1-4) */
  zone: 1 | 2 | 3 | 4;
  storeys: number;
  roofType: string;
  batteryLocation?: string;
  batteryCoupling?: BatteryCouplingType;
  vicRebate: boolean;
  vicLoan: boolean;
  officeNotes?: string;
  ownerNotes?: string;
}

export interface SystemProduct {
  product: Product;
  quantity: number;
}

export interface SystemSelection {
  mode: CalculatorMode;
  state: State;
  phase: PhaseType;
  panels?: SystemProduct;
  inverters?: SystemProduct[];
  batteries?: SystemProduct[];
  controllers?: SystemProduct[];
  gateways?: SystemProduct[];
  accessories?: SystemProduct[];
  existingSystem?: {
    existingInverterBrand?: string;
    existingInverterModel?: string;
    existingSolarCapacity?: number;
    retainExistingInverter?: boolean;
    compatibilityNotes?: string;
  };
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: QuoteStatus;
  customerInfo: CustomerInfo;
  systemSelection: SystemSelection;
  selectedExtras: SelectedExtra[];
  pricing: CustomerPriceSummary;
  /** Nullable if owner pricing is not available or not calculated */
  ownerPricing: OwnerMarginPanel | null;
  discountRequest?: {
    amount: number;
    reason: string;
    timestamp: string;
  };
  discountApproval?: {
    amount: number;
    approvedBy: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
  isDirty: boolean;
}
