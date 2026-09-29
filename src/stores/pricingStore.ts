import { create } from 'zustand';
import type { CustomerPriceSummary, OwnerMarginPanel, IncentiveConfig } from '../types/pricing';
import type { Product, StockStatus } from '../types/product';
import { products as defaultProducts } from '../data/products';

export interface InstallationCostConfig {
  baseSolarInstall: number;
  batteryInstallAddon: number;
  twoStoreyFee: number;
  threeStoreyFee: number;
  roofTypeFees: Record<string, number>;
  batteryLocationFees: Record<string, number>;
}

interface PricingState {
  pricingMethod: 'package' | 'component';
  customerSummary: CustomerPriceSummary;
  ownerMargin: OwnerMarginPanel | null;
  isOwner: boolean;
  isSettingsOpen: boolean;
  incentiveConfig: IncentiveConfig;
  minimumMarginPercent: number;
  targetMarginPercent: number;
  products: Product[];
  installationCosts: InstallationCostConfig;

  setApprovedDiscount: (amount: number) => void;
  setPricingMethod: (method: 'package' | 'component') => void;
  setIsOwner: (value: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  updateIncentiveConfig: (config: Partial<IncentiveConfig>) => void;
  setMinimumMarginPercent: (percent: number) => void;
  setTargetMarginPercent: (percent: number) => void;

  updateProductPricing: (
    id: string,
    costPrice: number,
    sellPrice: number,
    isPriority?: boolean,
    stockStatus?: StockStatus
  ) => void;
  resetProductPricing: () => void;
  updateInstallationCosts: (config: Partial<InstallationCostConfig>) => void;
}

const defaultCustomerSummary: CustomerPriceSummary = {
  systemSubtotal: 0,
  extrasTotal: 0,
  packageAdjustment: 0,
  approvedDiscount: 0,
  contractTotalIncGST: 0,
  incentiveDeductions: {
    vicRebate: 0,
    stcValue: 0,
    otherIncentives: 0,
  },
  amountAfterIncentives: 0,
  loanFinancedAmount: 0,
  upfrontPayable: 0,
};

const defaultIncentiveConfig: IncentiveConfig = {
  stcZoneFactors: {
    1: 1.382,
    2: 1.382,
    3: 1.185,
    4: 0.988,
  },
  stcPrice: 39,
  vicRebateAmount: 1400,
  vicLoanAmount: 1400,
};

const defaultInstallationCosts: InstallationCostConfig = {
  baseSolarInstall: 1800,
  batteryInstallAddon: 1200,
  twoStoreyFee: 250,
  threeStoreyFee: 500,
  roofTypeFees: {
    Tile: 0,
    Colorbond: 0,
    'Klip-Lok': 35,
    Terracotta: 30,
    Flat: 45,
    Other: 50,
  },
  batteryLocationFees: {
    Garage: 0,
    'External Wall': 150,
    Indoor: 0,
    Other: 250,
  },
};

// Load saved custom products from localStorage if available
const loadInitialProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem('thor_solar_products_pricing');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved product pricing, using defaults');
  }
  return defaultProducts;
};

// Load saved installation costs from localStorage
const loadInitialInstallationCosts = (): InstallationCostConfig => {
  try {
    const saved = localStorage.getItem('thor_solar_installation_costs');
    if (saved) {
      return { ...defaultInstallationCosts, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to parse saved installation costs, using defaults');
  }
  return defaultInstallationCosts;
};

export const usePricingStore = create<PricingState>((set) => ({
  pricingMethod: 'component',
  customerSummary: defaultCustomerSummary,
  ownerMargin: null,
  isOwner: false,
  isSettingsOpen: false,
  incentiveConfig: defaultIncentiveConfig,
  minimumMarginPercent: 15,
  targetMarginPercent: 25,
  products: loadInitialProducts(),
  installationCosts: loadInitialInstallationCosts(),

  setApprovedDiscount: (amount) =>
    set((state) => ({
      customerSummary: { ...state.customerSummary, approvedDiscount: amount },
    })),
  setPricingMethod: (method) => set({ pricingMethod: method }),
  setIsOwner: (value) => set({ isOwner: value }),
  setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
  updateIncentiveConfig: (config) =>
    set((state) => ({
      incentiveConfig: { ...state.incentiveConfig, ...config },
    })),
  setMinimumMarginPercent: (percent) => set({ minimumMarginPercent: percent }),
  setTargetMarginPercent: (percent) => set({ targetMarginPercent: percent }),

  updateProductPricing: (id, costPrice, sellPrice, isPriority, stockStatus) =>
    set((state) => {
      const updated = state.products.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            costPrice,
            sellPrice,
            ...(isPriority !== undefined ? { isPriority } : {}),
            ...(stockStatus !== undefined ? { stockStatus } : {}),
          };
        }
        return p;
      });
      try {
        localStorage.setItem('thor_solar_products_pricing', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save product pricing to localStorage', e);
      }
      return { products: updated };
    }),

  resetProductPricing: () => {
    try {
      localStorage.removeItem('thor_solar_products_pricing');
    } catch (e) {}
    set({ products: defaultProducts });
  },

  updateInstallationCosts: (config) =>
    set((state) => {
      const updated = { ...state.installationCosts, ...config };
      try {
        localStorage.setItem('thor_solar_installation_costs', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save installation costs to localStorage', e);
      }
      return { installationCosts: updated };
    }),
}));
