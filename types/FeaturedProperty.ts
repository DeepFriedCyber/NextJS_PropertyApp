// types/FeaturedProperty.ts

export interface FeaturedProperty {
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
