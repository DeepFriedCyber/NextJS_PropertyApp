import { useState } from 'react';

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'beds-asc'
  | 'beds-desc'
  | 'size-asc'
  | 'size-desc';

interface PropertySortProps {
  onSort: (option: SortOption) => void;
  currentSort: SortOption;
}

export const SORT_OPTIONS: Record<SortOption, string> = {
  'price-asc': 'Price (Low to High)',
  'price-desc': 'Price (High to Low)',
  'date-newest': 'Newest First',
  'date-oldest': 'Oldest First',
  'beds-asc': 'Bedrooms (Fewest First)',
  'beds-desc': 'Bedrooms (Most First)',
  'size-asc': 'Size (Smallest First)',
  'size-desc': 'Size (Largest First)'
};

export const PropertySort: React.FC<PropertySortProps> = ({ onSort, currentSort }) => {
  return (
    <select
      value={currentSort}
      onChange={(e) => onSort(e.target.value as SortOption)}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
    >
      {Object.entries(SORT_OPTIONS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
