import { getXataClient } from './xata';
import type { FeaturedProperty } from '@/types/FeaturedProperty';
import type { PropertiesRecord } from './xata';
import { mapPropertyRecord } from './xataHelpers';

// Helper function to validate property status
const validatePropertyStatus = (status: string | null | undefined): FeaturedProperty['status'] => {
  const validStatuses: FeaturedProperty['status'][] = ['for-sale', 'to-let', 'sold', 'let-agreed', 'under-offer', 'sold-stc'];

  if (status && validStatuses.includes(status as any)) {
    return status as FeaturedProperty['status'];
  }

  // Default to 'for-sale' if status is invalid or not provided
  return 'for-sale';
};

/**
 * Fetches featured properties from the database
 * @returns A promise that resolves to an array of featured properties
 */
export const fetchFeaturedProperties = async (): Promise<FeaturedProperty[]> => {
  try {
    const xata = getXataClient();

    if (!xata?.db?.properties) {
      console.error('Xata client or properties table not initialized properly');
      return [];
    }

    // Get properties that are featured or have a good price/location
    const results = await xata.db.properties
      .select([
        'id',
        'title',
        'location',
        'price',
        'imageUrl',
        'bedrooms',
        'bathrooms',
        'squareFeet',
        'propertyType',
        'status',
        'xata.createdAt',
        'listingAgent'
      ])
      .filter({
        status: { $any: ['for-sale', 'to-let'] }
      })
      .sort('price', 'desc')    // Sort by price
      .getMany({ pagination: { size: 6 } }); // Get more properties to show

    return results.map((property) => {
      // Instead of using mapPropertyRecord which expects a full PropertiesRecord,
      // we'll map the selected properties directly
      return {
        id: property.id,
        title: property.title ?? 'Untitled Property',
        location: property.location ?? 'Unknown Location',
        price: property.price ?? 0,
        imageUrl: property.imageUrl ?? '/placeholder-property.jpg',
        bedrooms: property.bedrooms ?? 0,
        bathrooms: property.bathrooms ?? 0,
        squareFeet: property.squareFeet ?? 0,
        propertyType: property.propertyType ?? 'Residential',
        listingType: property.status === 'for-rent' || property.status === 'to-let' ? 'rent' : 'sale',
        status: validatePropertyStatus(property.status),
        createdAt: property.xata?.createdAt ?? new Date(),
        listingAgent: property.listingAgent ?? 'Estate Agent',
        featured: false // Since 'featured' is not in the schema
      } as FeaturedProperty;
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};
