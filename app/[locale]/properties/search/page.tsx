// First part - SearchPage component
import PropertySearch from '@/components/PropertySearch';
import PropertyGrid from '@/components/PropertyGrid';
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
      // Use vector search for semantic queries
      try {
        const embedding = await getEmbedding(searchParams.q);

        if (embedding) {
          // Vector search with additional filters if provided
          const additionalFilters: any = {};
          if (searchParams.location) additionalFilters.location = { $contains: searchParams.location };
          if (searchParams.propertyType) additionalFilters.propertyType = searchParams.propertyType;
          if (searchParams.bedrooms) additionalFilters.bedrooms = parseInt(searchParams.bedrooms);

          // Price range filters
          if (searchParams.priceMin || searchParams.priceMax) {
            additionalFilters.price = {};
            if (searchParams.priceMin) additionalFilters.price.$gte = parseInt(searchParams.priceMin);
            if (searchParams.priceMax) additionalFilters.price.$lte = parseInt(searchParams.priceMax);
          }

          // Attempt vector search with combined filters
          try {
            const vectorResults = await xata.db.properties
              .vectorSearch('embedding', embedding, {
                filter: Object.keys(additionalFilters).length > 0 ? additionalFilters : undefined,
                size: 20
              });

            // Extract the records from the vector search results
            initialResults = vectorResults.records;
          } catch (error) {
            console.error('Vector search error:', error);

            // Fallback to regular filtering if vector search fails
            const query = searchParams.q;
            const textSearchFilter: any = {
              $any: [
                { title: { $contains: query } },
                { description: { $contains: query } },
                { location: { $contains: query } },
                { propertyType: { $contains: query } }
              ]
            };

            // Combine with additional filters
            if (Object.keys(additionalFilters).length > 0) {
              Object.assign(textSearchFilter, additionalFilters);
            }

            // Perform regular search
            initialResults = await xata.db.properties
              .filter(textSearchFilter)
              .getMany({ pagination: { size: 20 } });
          }
        } else {
          // Fallback to text search if embedding fails
          const query = searchParams.q;
          const textSearchFilter = {
            $any: [
              { title: { $contains: query } },
              { description: { $contains: query } },
              { location: { $contains: query } },
              { propertyType: { $contains: query } }
            ]
          };

          initialResults = await xata.db.properties
            .filter(textSearchFilter)
            .sort('xata.createdAt', 'desc')
            .getMany({
              pagination: { size: 20 }
            });
        }
      } catch (error) {
        console.error('Vector search error:', error);
        // Fallback to text search
        const query = searchParams.q;
        const textSearchFilter = {
          $any: [
            { title: { $contains: query } },
            { description: { $contains: query } },
            { location: { $contains: query } },
            { propertyType: { $contains: query } }
          ]
        };

        initialResults = await xata.db.properties
          .filter(textSearchFilter)
          .sort('xata.createdAt', 'desc')
          .getMany({
            pagination: { size: 20 }
          });
      }
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
    <div className="min-h-screen bg-dark-500 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
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
              <p className="text-gray-300">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}