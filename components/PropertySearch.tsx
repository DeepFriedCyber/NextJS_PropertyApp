'use client';

import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';

interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  propertyType?: string;
  bedrooms?: number;
  location?: string;
}

interface PropertySearchProps {
  initialMode?: 'semantic' | 'filter';
  initialQuery?: string;
  initialFilters?: SearchFilters;
}

export default function PropertySearch({ 
  initialMode = 'filter',
  initialQuery = '',
  initialFilters = {}
}: PropertySearchProps) {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'semantic' | 'filter'>(initialMode);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    debounce(async (query: string, mode: 'semantic' | 'filter', searchFilters: SearchFilters) => {
      setIsLoading(true);
      try {
        // Update URL with search params
        const searchParams = new URLSearchParams();
        if (query) searchParams.set('q', query);
        if (mode) searchParams.set('mode', mode);
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value) searchParams.set(key, value.toString());
        });

        // Navigate to the search results page
        router.push(`/properties/search?${searchParams.toString()}`);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [router]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSearchMode('semantic')}
          className={`px-4 py-2 rounded-lg ${
            searchMode === 'semantic' ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}
        >
          Semantic Search
        </button>
        <button
          onClick={() => setSearchMode('filter')}
          className={`px-4 py-2 rounded-lg ${
            searchMode === 'filter' ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}
        >
          Filter Search
        </button>
      </div>

      {searchMode === 'semantic' ? (
        <div className="relative">
          <input
            type="text"
            placeholder="Describe your ideal property..."
            className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value, 'semantic', {});
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Filter fields */}
          <input
            type="text"
            placeholder="Location"
            className="p-2 border rounded"
            value={filters.location || ''}
            onChange={(e) => {
              const newFilters = { ...filters, location: e.target.value };
              setFilters(newFilters);
              handleSearch('', 'filter', newFilters);
            }}
          />
          {/* Add other filter fields as needed */}
        </div>
      )}
    </div>
  );
}
