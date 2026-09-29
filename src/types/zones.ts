export interface ZoneConfig {
  zoneNumber: number;
  name: string;
  /** STC multiplier for this zone */
  stcMultiplier: number;
  /** Number of deemed years for STC calculations */
  deemedYears: number;
}

export interface PostcodeZoneMapping {
  minPostcode: number;
  maxPostcode: number;
  zoneNumber: number;
}

export interface SiteChargeConfig {
  storeyCharges: Record<string, number>;
  batteryLocationCharges: Record<string, number>;
}
