import { PropertyStatus } from './uk-property';
import { Property } from './property';

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'beds-asc'
  | 'beds-desc'
  | 'size-asc'
  | 'size-desc';

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  propertyTypes: string[];
  status: PropertyStatus;
  features: string[];
  sortBy: SortOption;
  radius?: number;
  location?: string;
}

export interface SearchResults {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
}