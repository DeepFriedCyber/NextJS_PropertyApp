// types/FeaturedProperty.ts

  export interface FeaturedProperty {
    id: string;
    title: string;
    description?: string;
    price: number;
    location: string;
    imageUrl: string;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    status: 'for-sale' | 'for-rent' | 'sold' | 'let-agreed';
  }
  
