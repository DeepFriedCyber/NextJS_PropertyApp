import { PropertiesRecord } from '@/lib/xata';
import { FeaturedProperty } from '@/types/FeaturedProperty';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  status: string;
  imageUrl: string;
  squareFeet: number;
  listingAgent: string;
  createdAt: string;
  isFeatured: boolean;
  isForSale: boolean;
}

export type PropertyUnion = (PropertiesRecord & { _type: 'xata' }) | (FeaturedProperty & { _type: 'featured' });

export const isXataProperty = (property: PropertyUnion): property is PropertiesRecord & { _type: 'xata' } => {
  return property._type === 'xata';
};

export type SortOption = 'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest';

export interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  status?: string;
}
