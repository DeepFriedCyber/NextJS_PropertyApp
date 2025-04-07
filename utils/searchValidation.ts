import { SearchFilters } from '@/types/search';
import { PropertyStatus } from '@/types/uk-property';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateSearchFilters = (filters: SearchFilters): ValidationResult => {
  const errors: string[] = [];

  // Price range validation
  if (filters.priceRange && filters.priceRange.length === 2) {
    const [minPrice, maxPrice] = filters.priceRange;

    if (minPrice > maxPrice) {
      errors.push('Minimum price cannot be greater than maximum price');
    }

    // Different validation rules for rent vs sale
    // We need to check the status from somewhere else as it's not in SearchFilters
    const isRental = false; // This should be determined from context or passed as a parameter

    if (isRental) {
      if (minPrice < 50 || maxPrice > 100000) {
        errors.push('Rental prices should be between £50 and £100,000 per month');
      }
    } else {
      if (minPrice < 1000 || maxPrice > 100000000) {
        errors.push('Property prices should be between £1,000 and £100,000,000');
      }
    }
  }

  // Bedroom range validation
  if (filters.bedrooms && filters.bedrooms.length >= 2) {
    const minBedrooms = Math.min(...filters.bedrooms);
    const maxBedrooms = Math.max(...filters.bedrooms);

    if (minBedrooms > maxBedrooms) {
      errors.push('Minimum bedrooms cannot be greater than maximum bedrooms');
    }
    if (minBedrooms < 0 || maxBedrooms > 20) {
      errors.push('Number of bedrooms should be between 0 and 20');
    }
  }

  // Search radius validation
  if (filters.radius) {
    if (filters.radius < 0 || filters.radius > 50) {
      errors.push('Search radius should be between 0 and 50 miles');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};