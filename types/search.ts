import { PropertyStatus } from './uk-property';
import { Property } from './property';
import { PropertiesRecord } from '@/lib/xata';

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'beds-asc'
  | 'beds-desc'
  | 'size-asc'
  | 'size-desc';

export type SearchMode = 'semantic' | 'filter';

export interface SearchFilters {
  priceRange: [number, number];
  bedrooms: number[];
  propertyType: string[];
  location: string;
  radius: number; // in miles
}

export interface SearchState {
  mode: SearchMode;
  query: string;
  filters: SearchFilters;
  results: PropertiesRecord[];
  isLoading: boolean;
}

