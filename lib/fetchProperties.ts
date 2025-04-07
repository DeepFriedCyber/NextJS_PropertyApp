import { getCachedData } from './cache';
import { getXataClient } from './xata';

export async function fetchFeaturedProperties() {
  return getCachedData(
    'featured-properties',
    async () => {
      const xata = getXataClient();
      return xata.db.properties
        .filter({ featured: true })
        .sort('xata.createdAt', 'desc')
        .getMany({ pagination: { size: 6 } });
    },
    1800 // 30 minutes cache
  );
}