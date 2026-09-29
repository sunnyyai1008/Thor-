import type { ZoneConfig, PostcodeZoneMapping, SiteChargeConfig } from '../types/zones';

/**
 * ZONES AND SITE CHARGES CONFIGURATION
 * Note: These values are configurable and should be approved by the business owner.
 * STC multipliers change periodically based on the deemed years and government regulations.
 */

// Default STC multipliers and configurations per zone.
// PLACEHOLDER VALUES: Require owner approval to ensure pricing accuracy.
export const stcZones: ZoneConfig[] = [
  {
    zoneNumber: 1,
    name: 'Zone 1',
    stcMultiplier: 1.382,
    deemedYears: 10,
  },
  {
    zoneNumber: 2,
    name: 'Zone 2',
    stcMultiplier: 1.382,
    deemedYears: 10,
  },
  {
    zoneNumber: 3,
    name: 'Zone 3',
    stcMultiplier: 1.185,
    deemedYears: 10,
  },
  {
    zoneNumber: 4,
    name: 'Zone 4',
    stcMultiplier: 0.988,
    deemedYears: 10,
  },
] as const;

// Map postcode ranges to specific zones
// IMPORTANT: Owner must configure this mapping for target service areas.
export const postcodeZones: PostcodeZoneMapping[] = [
  // Example: { minPostcode: 2000, maxPostcode: 2999, zoneNumber: 3 },
];

// Configuration for site-specific complexity charges (e.g. multi-storey, battery locations)
// Owner-configurable structure.
export const siteChargeConfig: SiteChargeConfig = {
  storeyCharges: {
    singleStorey: 0,
    doubleStorey: 250, // Example placeholder
    threeStorey: 500, // Example placeholder
  },
  batteryLocationCharges: {
    garage: 0,
    externalWall: 150, // Example placeholder
    remoteLocation: 300, // Example placeholder
  },
};
