import { usePropertySearch } from '../hooks/usePropertySearch';
import { PropertySort } from './PropertySort';
import PropertyCard from './PropertyCard';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function PropertySearch() {
  // Configure intersection observer with options
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const {
    filters,
    location,
    results,
    errors,
    isSearching,
    updateFilter,
    setLocation,
    resetFilters,
    hasMore,
    loadMore
  } = usePropertySearch();

  useEffect(() => {
    if (inView && hasMore && !isSearching) {
      loadMore();
    }
  }, [inView, hasMore, isSearching]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-heading font-bold mb-6 text-gray-900">Find Your Perfect Property</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value as 'for-sale' | 'for-rent' | 'under-offer' | 'sold' | 'let-agreed')}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
              <option value="under-offer">Under Offer</option>
              <option value="sold">Sold</option>
              <option value="let-agreed">Let Agreed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <PropertySort
              currentSort={filters.sortBy}
              onSort={(option) => updateFilter('sortBy', option)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min price"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Display validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          {errors.map((error, index) => (
            <p key={index} className="text-red-600 font-medium">{error}</p>
          ))}
        </div>
      )}

      {/* Results section */}
      <div className="space-y-6">
        {/* Initial loading state */}
        {isSearching && results.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
                <div className="p-6 space-y-3">
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Search results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* No results message */}
            {!isSearching && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Loading more indicator */}
            {isSearching && results.length > 0 && (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasMore && <div ref={ref} className="h-10" />}
          </>
        )}
      </div>
    </div>
  );
}




