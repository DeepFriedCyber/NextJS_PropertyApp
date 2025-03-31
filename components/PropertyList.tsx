'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getXataClient } from '@/lib/xata';
import type { PropertiesRecord } from '@/lib/xata';
import PropertyCard from './PropertyCard';
import { PropertySort, type SortOption } from './PropertySort';
import { debounce } from 'lodash';
import type { Query, SelectedPick } from '@xata.io/client';

// Define our own FilterExpression type based on how it's used in the code
type FilterExpression<T> = {
  [K in keyof T]?: { $gte?: any; $lte?: any; $contains?: string } | any;
} | { $all: Array<any> };

type PropertyFilters = {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  type?: string;
  status?: string;
  tenure?: string;
  location?: string;
};

const PROPERTIES_PER_PAGE = 9;
const DEBOUNCE_DELAY = 500;

// 🔁 Sort options mapped to fields
const sortMap = {
  'price-asc': { field: 'price' as const, direction: 'asc' as const },
  'price-desc': { field: 'price' as const, direction: 'desc' as const },
  'bedrooms-asc': { field: 'bedrooms' as const, direction: 'asc' as const },
  'bedrooms-desc': { field: 'bedrooms' as const, direction: 'desc' as const },
  // Use correct Xata system field name
  'xata_createdat-asc': { field: 'xata.createdAt' as const, direction: 'asc' as const },
  'xata_createdat-desc': { field: 'xata.createdAt' as const, direction: 'desc' as const },
  // Map the date sort options to xata.createdAt field
  'date-newest': { field: 'xata.createdAt' as const, direction: 'desc' as const },
  'date-oldest': { field: 'xata.createdAt' as const, direction: 'asc' as const },
  // Map the beds sort options to bedrooms field
  'beds-asc': { field: 'bedrooms' as const, direction: 'asc' as const },
  'beds-desc': { field: 'bedrooms' as const, direction: 'desc' as const },
  // Map the size sort options to squareFeet field
  'size-asc': { field: 'squareFeet' as const, direction: 'asc' as const },
  'size-desc': { field: 'squareFeet' as const, direction: 'desc' as const }
} as const;

// Add type for the sort field
type SortField = (typeof sortMap)[keyof typeof sortMap]['field'];

export default function PropertyList() {
  const [properties, setProperties] = useState<PropertiesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('price-desc');
  const [priceError, setPriceError] = useState<string | null>(null);

  const validatePriceRange = (min?: number, max?: number): boolean => {
    if (min && max && min > max) {
      setPriceError('Minimum price cannot be greater than maximum price');
      return false;
    }
    setPriceError(null);
    return true;
  };

  const buildFilterQuery = useCallback((
    xata: ReturnType<typeof getXataClient>,
    filters: PropertyFilters,
    currentSortOption: SortOption
  ) => {
    // Create an array of filter expressions
    const filterExpressions: FilterExpression<PropertiesRecord>[] = [];

    if (filters.minPrice !== undefined) {
      filterExpressions.push({ price: { $gte: filters.minPrice } });
    }
    if (filters.maxPrice !== undefined) {
      filterExpressions.push({ price: { $lte: filters.maxPrice } });
    }
    if (filters.minBedrooms !== undefined) {
      filterExpressions.push({ bedrooms: { $gte: filters.minBedrooms } });
    }
    if (filters.type) {
      filterExpressions.push({ propertyType: filters.type });
    }
    if (filters.status) {
      filterExpressions.push({ status: filters.status });
    }
    if (filters.tenure) {
      filterExpressions.push({ tenure: filters.tenure });
    }
    if (filters.location) {
      filterExpressions.push({ location: { $contains: filters.location } });
    }

    // Apply all filters at once
    let query: Query<PropertiesRecord> = xata.db.properties;
    if (filterExpressions.length > 0) {
      query = query.filter({ $all: filterExpressions });
    }

    const sort = sortMap[currentSortOption] ?? sortMap['price-desc'];
    return query.sort(sort.field, sort.direction);
  }, []);

  const fetchProperties = useCallback(async (reset = false) => {
    try {
      if (!validatePriceRange(filters.minPrice, filters.maxPrice)) {
        setProperties([]);
        return;
      }

      setLoading(true);
      setError(null);

      const xata = getXataClient();
      const query = buildFilterQuery(xata, filters, sortOption);

      // Add console.log to debug the query
      console.log('Fetching properties with query:', query);

      const results = await query.getPaginated({
        pagination: {
          size: PROPERTIES_PER_PAGE,
          offset: reset ? 0 : properties.length
        }
      });

      // Add console.log to see the results
      console.log('Fetched properties:', results.records);

      setProperties(prev => (reset ? results.records : [...prev, ...results.records]));
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, sortOption, properties.length, buildFilterQuery, validatePriceRange]);

  const debouncedFetch = useMemo(
    () => debounce((reset: boolean) => fetchProperties(reset), DEBOUNCE_DELAY),
    [fetchProperties]
  );

  // Initial fetch on component mount
  useEffect(() => {
    fetchProperties(true);
  }, []); // Empty dependency array for initial load

  // Fetch when filters or sort change
  useEffect(() => {
    debouncedFetch(true);
    return () => debouncedFetch.cancel();
  }, [filters, sortOption, debouncedFetch]);

  const handleFilterChange = useCallback((key: keyof PropertyFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Property Types</option>
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-Detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat</option>
            <option value="bungalow">Bungalow</option>
            <option value="cottage">Cottage</option>
            <option value="maisonette">Maisonette</option>
            <option value="commercial">Commercial</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="for-sale">For Sale</option>
            <option value="for-rent">To Let</option>
            <option value="under-offer">Under Offer</option>
            <option value="sold">Sold</option>
            <option value="let-agreed">Let Agreed</option>
          </select>

          <select
            value={filters.tenure || ''}
            onChange={(e) => handleFilterChange('tenure', e.target.value || undefined)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Tenures</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
            <option value="share-of-freehold">Share of Freehold</option>
          </select>

          <PropertySort onSort={setSortOption} currentSort={sortOption} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <input
              type="number"
              placeholder="Min Price (£)"
              onChange={(e) =>
                handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className={`p-2 border rounded-lg w-full ${priceError ? 'border-red-500' : ''}`}
              min="0"
            />
            {priceError && <p className="text-red-500 text-sm mt-1">{priceError}</p>}
          </div>
          <input
            type="number"
            placeholder="Max Price (£)"
            onChange={(e) =>
              handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="p-2 border rounded-lg w-full"
            min="0"
          />
          <input
            type="number"
            placeholder="Min Bedrooms"
            onChange={(e) =>
              handleFilterChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)
            }
            className="p-2 border rounded-lg w-full"
            min="0"
          />
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
            className="p-2 border rounded-lg w-full"
          />
        </div>
      </div>

      {/* Properties Grid */}
      {loading && properties.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-72 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {properties.length >= PROPERTIES_PER_PAGE && (
            <div className="text-center mt-8">
              <button
                onClick={() => fetchProperties()}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchProperties(true)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && properties.length === 0 && !error && (
        <p className="text-center text-gray-500 py-8">
          No properties found matching your criteria.
        </p>
      )}
    </div>
  );
}









