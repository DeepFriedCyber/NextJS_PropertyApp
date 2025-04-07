'use client';

import React, { useState, useCallback } from 'react';
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
  initialMode = 'semantic', // Changed default to semantic
  initialQuery = '',
  initialFilters = {}
}: PropertySearchProps) {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'semantic' | 'filter'>(initialMode);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [showSemanticFilters, setShowSemanticFilters] = useState(false);

  const handleSearch = useCallback(
    debounce(async (query: string, mode: 'semantic' | 'filter', searchFilters: SearchFilters) => {
      setIsLoading(true);
      try {
        // Update URL with search params
        const searchParams = new URLSearchParams();

        // Always set mode
        searchParams.set('mode', mode);

        // Add query for semantic search
        if (query) searchParams.set('q', query);

        // Add all filters regardless of search mode
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

  // Define the semanticSearch function
  const semanticSearch = useCallback((query: string) => {
    handleSearch(query, 'semantic', filters);
  }, [handleSearch, filters]);

  // Add debouncing to search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      semanticSearch(query);
    }, 300),
    [semanticSearch]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          onClick={() => setSearchMode('semantic')}
          className={`px-4 py-2 rounded-lg flex-1 ${
            searchMode === 'semantic' ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}
        >
          AI-powered Search
        </button>
        <button
          onClick={() => setSearchMode('filter')}
          className={`px-4 py-2 rounded-lg flex-1 ${
            searchMode === 'filter' ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}
        >
          Filter Search
        </button>
      </div>

      {searchMode === 'semantic' && (
        <p className="text-sm text-gray-500 mb-4">
          Our AI-powered search understands natural language. Try describing what you want!
        </p>
      )}

      {searchMode === 'semantic' ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
            handleSearch(searchQuery, 'semantic', filters);
          }
        }}>
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Describe your ideal property (e.g., 'modern house with garden near schools')"
                className="w-full p-4 pl-10 border border-dark-600 bg-dark-800 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                style={{ paddingRight: "50px" }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Our AI-powered search understands natural language. Try describing what you want!
            </p>
          </div>

          {/* Example search queries */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSearchQuery("Modern apartment with balcony")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
              >
                Modern apartment with balcony
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("Family home near good schools")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
              >
                Family home near good schools
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("Properties with garden and parking")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
              >
                Garden and parking
              </button>
            </div>
          </div>

          {/* Optional filters toggle */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowSemanticFilters(!showSemanticFilters)}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
            >
              {showSemanticFilters ? 'Hide Filters' : 'Add Filters'}
              <svg className={`w-4 h-4 ml-1 transition-transform ${showSemanticFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          {/* Optional filters */}
          {showSemanticFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Refine your semantic search with these filters:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    id="location"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.location || ''}
                    onChange={(e) => {
                      setFilters({...filters, location: e.target.value});
                    }}
                  >
                    <option value="">Any Location</option>
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="Glasgow">Glasgow</option>
                    <option value="Liverpool">Liverpool</option>
                    <option value="Bristol">Bristol</option>
                    <option value="Leeds">Leeds</option>
                    <option value="Sheffield">Sheffield</option>
                    <option value="Cardiff">Cardiff</option>
                    <option value="Belfast">Belfast</option>
                    <option value="Newcastle">Newcastle</option>
                    <option value="Oxford">Oxford</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    id="propertyType"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.propertyType || ''}
                    onChange={(e) => {
                      setFilters({...filters, propertyType: e.target.value});
                    }}
                  >
                    <option value="">Any Type</option>
                    <option value="Detached">Detached</option>
                    <option value="Semi-Detached">Semi-Detached</option>
                    <option value="Terraced">Terraced</option>
                    <option value="Flat">Flat</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Cottage">Cottage</option>
                    <option value="New Build">New Build</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <select
                    id="bedrooms"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.bedrooms || ''}
                    onChange={(e) => {
                      setFilters({...filters, bedrooms: e.target.value ? parseInt(e.target.value) : undefined});
                    }}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <select
                    id="priceMin"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.priceMin || ''}
                    onChange={(e) => {
                      setFilters({...filters, priceMin: e.target.value ? parseInt(e.target.value) : undefined});
                    }}
                  >
                    <option value="">No Min</option>
                    <option value="100000">£100,000</option>
                    <option value="200000">£200,000</option>
                    <option value="300000">£300,000</option>
                    <option value="400000">£400,000</option>
                    <option value="500000">£500,000</option>
                    <option value="750000">£750,000</option>
                    <option value="1000000">£1,000,000</option>
                    <option value="2000000">£2,000,000</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <select
                    id="priceMax"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.priceMax || ''}
                    onChange={(e) => {
                      setFilters({...filters, priceMax: e.target.value ? parseInt(e.target.value) : undefined});
                    }}
                  >
                    <option value="">No Max</option>
                    <option value="200000">£200,000</option>
                    <option value="300000">£300,000</option>
                    <option value="400000">£400,000</option>
                    <option value="500000">£500,000</option>
                    <option value="750000">£750,000</option>
                    <option value="1000000">£1,000,000</option>
                    <option value="2000000">£2,000,000</option>
                    <option value="5000000">£5,000,000</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Search Properties
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch('', 'filter', filters);
        }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                id="location"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.location || ''}
                onChange={(e) => {
                  setFilters({...filters, location: e.target.value});
                }}
              >
                <option value="">Any Location</option>
                <option value="London">London</option>
                <option value="Manchester">Manchester</option>
                <option value="Birmingham">Birmingham</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Glasgow">Glasgow</option>
                <option value="Liverpool">Liverpool</option>
                <option value="Bristol">Bristol</option>
                <option value="Leeds">Leeds</option>
                <option value="Sheffield">Sheffield</option>
                <option value="Cardiff">Cardiff</option>
                <option value="Belfast">Belfast</option>
                <option value="Newcastle">Newcastle</option>
                <option value="Oxford">Oxford</option>
                <option value="Cambridge">Cambridge</option>
              </select>
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                id="propertyType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.propertyType || ''}
                onChange={(e) => {
                  setFilters({...filters, propertyType: e.target.value});
                }}
              >
                <option value="">Any Type</option>
                <option value="Detached">Detached</option>
                <option value="Semi-Detached">Semi-Detached</option>
                <option value="Terraced">Terraced</option>
                <option value="Flat">Flat</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Cottage">Cottage</option>
                <option value="New Build">New Build</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                id="bedrooms"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.bedrooms || ''}
                onChange={(e) => {
                  setFilters({...filters, bedrooms: e.target.value ? parseInt(e.target.value) : undefined});
                }}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <select
                id="priceMin"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.priceMin || ''}
                onChange={(e) => {
                  setFilters({...filters, priceMin: e.target.value ? parseInt(e.target.value) : undefined});
                }}
              >
                <option value="">No Min</option>
                <option value="100000">£100,000</option>
                <option value="200000">£200,000</option>
                <option value="300000">£300,000</option>
                <option value="400000">£400,000</option>
                <option value="500000">£500,000</option>
                <option value="750000">£750,000</option>
                <option value="1000000">£1,000,000</option>
                <option value="2000000">£2,000,000</option>
              </select>
            </div>

            <div>
              <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <select
                id="priceMax"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.priceMax || ''}
                onChange={(e) => {
                  setFilters({...filters, priceMax: e.target.value ? parseInt(e.target.value) : undefined});
                }}
              >
                <option value="">No Max</option>
                <option value="200000">£200,000</option>
                <option value="300000">£300,000</option>
                <option value="400000">£400,000</option>
                <option value="500000">£500,000</option>
                <option value="750000">£750,000</option>
                <option value="1000000">£1,000,000</option>
                <option value="2000000">£2,000,000</option>
                <option value="5000000">£5,000,000</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Search Properties
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// Add error boundary
export class PropertySearchErrorBoundary extends React.Component {
  // ... error boundary implementation
}
