import { PropertyType, TenureType } from "@/types/uk-property";

// Map CSV property types to our application's property types
export const propertyTypeMap: Record<string, PropertyType> = {
  'detached': 'detached',
  'semi-detached': 'semi-detached',
  'terraced': 'terraced',
  'flat': 'flat',
  'maisonette': 'maisonette',
  'apartment': 'flat',
  'bungalow': 'bungalow',
  'cottage': 'cottage',
  'commercial': 'commercial',
  // Add more mappings as needed
};

// Map CSV tenure types to our application's tenure types
export const tenureMap: Record<string, TenureType> = {
  'freehold': 'freehold',
  'leasehold': 'leasehold',
  'share of freehold': 'share-of-freehold',
  // Add more mappings as needed
};

// Default values
export const defaultPropertyType: PropertyType = 'detached';
export const defaultTenureType: TenureType = 'freehold';