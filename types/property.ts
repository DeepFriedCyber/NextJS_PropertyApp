export interface Property {
  id: string;
  name: string;
  price: number;
  location: string;
  imageUrl: string;
  description: string;
  type: 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'bungalow' | 'cottage' | 'maisonette' | 'commercial';
  features: string[];
  bedrooms: number;
  bathrooms: number;
  area: number; // in square metres
  status: 'for-sale' | 'for-rent' | 'under-offer' | 'sold' | 'let-agreed';
  tenure: 'freehold' | 'leasehold' | 'share-of-freehold';
  councilTaxBand?: string;
  epcRating?: string;
  createdAt: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest';

export interface PropertyFilters {
  type?: Property['type'];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  status?: Property['status'];
  location?: string;
  tenure?: Property['tenure'];
}
