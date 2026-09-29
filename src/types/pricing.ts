export type PricingMethod = 'package' | 'component';

export type State = 'VIC' | 'NSW';

export interface CustomerPriceSummary {
  systemSubtotal: number;
  extrasTotal: number;
  packageAdjustment: number;
  approvedDiscount: number;
  contractTotalIncGST: number;
  incentiveDeductions: {
    vicRebate: number;
    stcValue: number;
    otherIncentives: number;
  };
  amountAfterIncentives: number;
  loanFinancedAmount: number;
  upfrontPayable: number;
}

export interface OwnerMarginPanel {
  equipmentCosts: number;
  installationCosts: number;
  extraCosts: number;
  totalCost: number;
  totalRevenue: number;
  companyProfitBeforeDiscount: number;
  approvedDiscount: number;
  companyProfitAfterDiscount: number;
  marginPercentAfterDiscount: number;
  /** Amount of discount that can still be offered before hitting minimum margin */
  discountHeadroomAboveMinimum: number;
  minimumMarginPercent: number;
}

export interface IncentiveConfig {
  /** Factors mapped by zone number */
  stcZoneFactors: Record<number, number>;
  /** Value of a single STC */
  stcPrice: number;
  vicRebateAmount: number;
  vicLoanAmount: number;
}

export interface SiteCharge {
  id: string;
  name: string;
  /** Condition that triggers this charge */
  condition: string;
  amount: number;
  description?: string;
}
