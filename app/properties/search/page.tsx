import PropertySearch from '@/components/PropertySearch';
import { PropertyGrid } from '@/components/PropertyGrid';
import { getXataClient } from '@/lib/xata';
import { getEmbedding } from '@/lib/embedding';
import type { PropertiesRecord } from '@/lib/xata';

interface SearchPageProps {
  searchParams: {
    q?: string;
    mode?: string;
    location?: string;
    priceMin?: string;
    priceMax?: string;
    propertyType?: string;
    bedrooms?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const xata = getXataClient();
  let initialResults: PropertiesRecord[] = [];
  
  try {
    if (searchParams.mode === 'semantic' && searchParams.q) {
      // Handle semantic search
      const embedding = await getEmbedding(searchParams.q);
      const searchResults = await xata.db.properties.vectorSearch('embedding', embedding, {
        size: 20
      });
      initialResults = searchResults.records;
    } else {
      // Handle filter-based search
      const filters: any = {};
      if (searchParams.location) filters.location = { $contains: searchParams.location };
      if (searchParams.priceMin) filters.price = { $gte: parseInt(searchParams.priceMin) };
      if (searchParams.priceMax) filters.price = { ...filters.price, $lte: parseInt(searchParams.priceMax) };
      if (searchParams.propertyType) filters.propertyType = searchParams.propertyType;
      if (searchParams.bedrooms) filters.bedrooms = parseInt(searchParams.bedrooms);

      initialResults = await xata.db.properties
        .filter(filters)
        .sort('xata.createdAt', 'desc')
        .getMany({
          pagination: { size: 20 }
        });
    }
  } catch (error) {
    console.error('Search error:', error);
    // Handle error gracefully - could add an error state to the UI
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Property Search
        </h1>

        <PropertySearch 
          initialMode={searchParams.mode as 'semantic' | 'filter' | undefined}
          initialQuery={searchParams.q}
          initialFilters={{
            location: searchParams.location,
            priceMin: searchParams.priceMin ? parseInt(searchParams.priceMin) : undefined,
            priceMax: searchParams.priceMax ? parseInt(searchParams.priceMax) : undefined,
            propertyType: searchParams.propertyType,
            bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : undefined,
          }}
        />

        <div className="mt-8">
          {initialResults.length > 0 ? (
            <PropertyGrid properties={initialResults} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

