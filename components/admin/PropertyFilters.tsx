'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PROPERTY_TYPES } from '@/types/uk-property';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PropertyFiltersProps {
  currentFilters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    search?: string;
  };
}

export default function PropertyFilters({ currentFilters }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // State for filters
  const [filters, setFilters] = useState({
    type: currentFilters.type || '',
    minPrice: currentFilters.minPrice?.toString() || '',
    maxPrice: currentFilters.maxPrice?.toString() || '',
    minBeds: currentFilters.minBeds?.toString() || '',
    search: currentFilters.search || '',
  });
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Add status from current URL if it exists
    const currentUrl = new URL(window.location.href);
    const statusParam = currentUrl.searchParams.get('status');
    if (statusParam) {
      params.set('status', statusParam);
    }
    
    // Add other filters
    if (filters.type) params.set('type', filters.type);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minBeds) params.set('minBeds', filters.minBeds);
    if (filters.search) params.set('search', filters.search);
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    // Keep only status parameter if it exists
    const params = new URLSearchParams();
    const currentUrl = new URL(window.location.href);
    const statusParam = currentUrl.searchParams.get('status');
    
    if (statusParam) {
      params.set('status', statusParam);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(pathname);
    }
    
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      minBeds: '',
      search: '',
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-600 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Filters
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-gray-400 hover:text-white flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search properties..."
            className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        {/* Property Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
            Property Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        
        {/* Bedrooms */}
        <div>
          <label htmlFor="minBeds" className="block text-sm font-medium text-gray-300 mb-1">
            Minimum Bedrooms
          </label>
          <select
            id="minBeds"
            name="minBeds"
            value={filters.minBeds}
            onChange={handleFilterChange}
            className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>
                {num}+
              </option>
            ))}
          </select>
        </div>
        
        {/* Apply Filters Button */}
        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
}