import { SearchFilters } from '@/types/search';
import { PropertyStatus } from '@/types/uk-property';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateSearchFilters = (filters: SearchFilters): ValidationResult => {
  const errors: string[] = [];

  // Price range validation
  if (filters.minPrice && filters.maxPrice) {
    if (filters.minPrice > filters.maxPrice) {
      errors.push('Minimum price cannot be greater than maximum price');
    }

    // Different validation rules for rent vs sale
    if (filters.status === 'for-rent' || filters.status === 'let-agreed') {
      if (filters.minPrice < 50 || filters.maxPrice > 100000) {
        errors.push('Rental prices should be between £50 and £100,000 per month');
      }
    } else {
      if (filters.minPrice < 1000 || filters.maxPrice > 100000000) {
        errors.push('Property prices should be between £1,000 and £100,000,000');
      }
    }
  }

  // Bedroom range validation
  if (filters.minBedrooms && filters.maxBedrooms) {
    if (filters.minBedrooms > filters.maxBedrooms) {
      errors.push('Minimum bedrooms cannot be greater than maximum bedrooms');
    }
    if (filters.minBedrooms < 0 || filters.maxBedrooms > 20) {
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