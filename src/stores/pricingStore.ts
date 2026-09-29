import { create } from 'zustand'
import type { CustomerPriceSummary, OwnerMarginPanel, IncentiveConfig } from '../types/pricing'

interface PricingState {
  pricingMethod: 'package' | 'component'
  customerSummary: CustomerPriceSummary
  ownerMargin: OwnerMarginPanel | null
  isOwner: boolean
  incentiveConfig: IncentiveConfig
  minimumMarginPercent: number

  setApprovedDiscount: (amount: number) => void
  setPricingMethod: (method: 'package' | 'component') => void
  setIsOwner: (value: boolean) => void
  updateIncentiveConfig: (config: Partial<IncentiveConfig>) => void
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
}

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
}

export const usePricingStore = create<PricingState>((set) => ({
  pricingMethod: 'component',
  customerSummary: defaultCustomerSummary,
  ownerMargin: null,
  isOwner: false,
  incentiveConfig: defaultIncentiveConfig,
  minimumMarginPercent: 15,

  setApprovedDiscount: (amount) => set((state) => ({
    customerSummary: { ...state.customerSummary, approvedDiscount: amount }
  })),
  setPricingMethod: (method) => set({ pricingMethod: method }),
  setIsOwner: (value) => set({ isOwner: value }),
  updateIncentiveConfig: (config) => set((state) => ({
    incentiveConfig: { ...state.incentiveConfig, ...config }
  })),
}))
