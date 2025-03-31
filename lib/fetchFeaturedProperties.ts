import { getXataClient } from './xata';
import type { FeaturedProperty } from '@/types/FeaturedProperty';
import type { SelectedPick } from '@xata.io/client';
import type { PropertiesRecord } from './xata';

export const fetchFeaturedProperties = async (): Promise<FeaturedProperty[]> => {
  try {
    const xata = getXataClient();
    
    if (!xata?.db?.properties) {
      console.error('Xata client or properties table not initialized properly');
      return [];
    }

    const results = await xata.db.properties
      .select(['id', 'title', 'location', 'price', 'imageUrl'])
      .sort('price', 'desc')
      .getMany({ pagination: { size: 3 } });

    return results.map((property: SelectedPick<PropertiesRecord, ['id', 'title', 'location', 'price', 'imageUrl']>) => ({
      id: property.id,
      title: property.title ?? 'Untitled Property',
      location: property.location ?? 'Unknown Location',
      price: property.price ?? 0,
      imageUrl: property.imageUrl ?? '/placeholder-property.jpg'
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};
