export const COUNCIL_TAX_BANDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
export type CouncilTaxBand = typeof COUNCIL_TAX_BANDS[number];

export const EPC_RATINGS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export type EPCRating = typeof EPC_RATINGS[number];

export const PROPERTY_TYPES = [
  'detached',
  'semi-detached',
  'terraced',
  'flat',
  'bungalow',
  'cottage',
  'maisonette',
  'commercial'
] as const;
export type PropertyType = typeof PROPERTY_TYPES[number];

export const TENURE_TYPES = [
  'freehold',
  'leasehold',
  'share-of-freehold'
] as const;
export type TenureType = typeof TENURE_TYPES[number];

export const PROPERTY_STATUS = [
  'for-sale',
  'for-rent',
  'under-offer',
  'sold',
  'let-agreed'
] as const;
export type PropertyStatus = typeof PROPERTY_STATUS[number];

export interface PostcodeLookupResult {
  postcode: string;
  latitude: number;
  longitude: number;
  town: string;
  region: string;
  country: string;
}

export const UK_PROPERTY_FEATURES = [
  { id: 'gas_central_heating', label: 'Gas Central Heating' },
  { id: 'oil_central_heating', label: 'Oil Central Heating' },
  { id: 'electric_heating', label: 'Electric Heating' },
  { id: 'double_glazing', label: 'Double Glazing' },
  { id: 'triple_glazing', label: 'Triple Glazing' },
  { id: 'solar_panels', label: 'Solar Panels' },
  { id: 'cavity_wall_insulation', label: 'Cavity Wall Insulation' },
  { id: 'loft_insulation', label: 'Loft Insulation' },
  { id: 'conservatory', label: 'Conservatory' },
  { id: 'garage', label: 'Garage' },
  { id: 'parking', label: 'Parking' },
  { id: 'garden', label: 'Garden' },
  { id: 'south_facing_garden', label: 'South Facing Garden' },
  { id: 'patio', label: 'Patio' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'fitted_kitchen', label: 'Fitted Kitchen' },
  { id: 'utility_room', label: 'Utility Room' },
  { id: 'ensuite', label: 'En-suite' },
  { id: 'built_in_storage', label: 'Built-in Storage' },
  { id: 'cellar', label: 'Cellar' },
  { id: 'chain_free', label: 'Chain Free' },
  { id: 'new_build', label: 'New Build' },
  { id: 'period_features', label: 'Period Features' },
  { id: 'wood_floors', label: 'Wood Floors' },
  { id: 'smart_home', label: 'Smart Home Features' },
  { id: 'security_system', label: 'Security System' },
  { id: 'satellite_tv', label: 'Satellite TV' },
  { id: 'fibre_broadband', label: 'Fibre Broadband' }
] as const;

export type PropertyFeature = typeof UK_PROPERTY_FEATURES[number]['id'];

export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
}

export interface UKProperty extends Property {
  features: PropertyFeature[];
  epcRating: EPCRating;
  councilTaxBand: CouncilTaxBand;
}
