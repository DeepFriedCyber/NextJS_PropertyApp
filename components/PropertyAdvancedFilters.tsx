'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PROPERTY_TYPES, PROPERTY_STATUS, TENURE_TYPES } from '@/types/uk-property';

export default function PropertyAdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL search params
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBeds: searchParams.get('minBeds') || '',
    location: searchParams.get('location') || '',
    status: searchParams.get('status') || '',
    tenure: searchParams.get('tenure') || '',
  });

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Add filters to URL params
    if (filters.type) params.set('type', filters.type);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minBeds) params.set('minBeds', filters.minBeds);
    if (filters.location) params.set('location', filters.location);
    if (filters.status) params.set('status', filters.status);
    if (filters.tenure) params.set('tenure', filters.tenure);
    
    // Navigate to properties search page with filters
    router.push(`/properties/search?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      minBeds: '',
      location: '',
      status: '',
      tenure: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
      
      <form onSubmit={applyFilters}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Property Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              {PROPERTY_STATUS.map(status => (
                <option key={status} value={status}>
                  {status === 'for-sale' ? 'For Sale' :
                   status === 'for-rent' ? 'To Let' :
                   status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
          
          {/* Tenure */}
          <div>
            <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
              Tenure
            </label>
            <select
              id="tenure"
              name="tenure"
              value={filters.tenure}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Tenures</option>
              {TENURE_TYPES.map(tenure => (
                <option key={tenure} value={tenure}>
                  {tenure === 'share-of-freehold' ? 'Share of Freehold' :
                   tenure.charAt(0).toUpperCase() + tenure.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Min Price */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price (£)
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              min="0"
            />
          </div>
          
          {/* Max Price */}
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price (£)
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              min="0"
            />
          </div>
          
          {/* Min Bedrooms */}
          <div>
            <label htmlFor="minBeds" className="block text-sm font-medium text-gray-700 mb-1">
              Min Bedrooms
            </label>
            <input
              type="number"
              id="minBeds"
              name="minBeds"
              value={filters.minBeds}
              onChange={handleFilterChange}
              placeholder="Min Bedrooms"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              min="0"
            />
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}