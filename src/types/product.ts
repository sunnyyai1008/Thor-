export type ProductCategory = 'panel' | 'inverter' | 'battery' | 'controller' | 'gateway' | 'accessory' | 'module';

export type InverterType = 'string' | 'hybrid' | 'micro';

export type BatteryCouplingType = 'ac_coupled' | 'dc_coupled';

export type PhaseType = 'single' | 'three';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: string;
  sku?: string;
  /** References Brand.id */
  brandId: string;
  /** References ProductFamily.id */
  familyId?: string;
  /** Display name including brand, model, and key specs */
  name: string;
  category: ProductCategory;
  description?: string;
  /** Power output in watts (panels, inverters) */
  powerWatts?: number;
  /** Battery capacity in kWh */
  capacityKwh?: number;
  /** Nominal battery capacity in kWh (if different from usable) */
  nominalCapacityKwh?: number;
  phase?: PhaseType;
  /** Inverter type (string, hybrid, micro) or battery coupling type */
  type?: InverterType | BatteryCouplingType;
  costPrice: number;
  sellPrice: number;
  stockStatus: StockStatus;
  isPriority?: boolean;
  thumbnailUrl?: string;
  isActive?: boolean;
  /** Array of compatible product IDs */
  compatibleWith?: string[];
  minQuantity?: number;
  maxQuantity?: number;
  quantityStep?: number;
  /** Array of required accessory product IDs */
  requiredAccessories?: string[];
  tags?: string[];
}

export interface ProductFamily {
  id: string;
  /** References Brand.id */
  brandId: string;
  name: string;
  category?: ProductCategory;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  /** Primary product category this brand is known for */
  category?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface CompatibilityRule {
  id: string;
  sourceProductId: string;
  targetProductId: string;
  ruleType: 'requires' | 'compatible_with' | 'replaces';
  notes?: string;
}

export interface DuplicateSuspect {
  id: string;
  productIdA: string;
  productIdB: string;
  /** Similarity score, usually 0 to 1 */
  similarity: number;
  reviewedByOwner: boolean;
  resolution?: 'merge' | 'keep_both' | 'dismiss';
}
