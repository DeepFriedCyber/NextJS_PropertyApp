import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { validateSearchFilters } from '@/utils/searchValidation';
import { SearchFilters } from '@/types/search';
import { Property } from '@/types/property';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

const DEFAULT_FILTERS: SearchFilters = {
  propertyTypes: [],
  status: 'for-sale',
  features: [],
  sortBy: 'price-asc'
};

export const usePropertySearch = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Property[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

  const debouncedLocation = useDebounce(location, 500);
  const debouncedFilters = useDebounce(filters, 500);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setLocation('');
  }, []);

  const loadMore = async () => {
    if (!hasMore || isSearching) return;
    
    setPage(prev => prev + 1);
    await performSearch(false);
  };

  const performSearch = useCallback(async (resetResults = true) => {
    const validation = validateSearchFilters(filters);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSearching(true);
    setErrors([]);

    try {
      let q = query(collection(db, 'properties'));

      // Add filters
      if (filters.propertyTypes.length > 0) {
        q = query(q, where('type', 'in', filters.propertyTypes));
      }
      
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      // Add sorting
      const [sortField, sortDirection] = filters.sortBy.split('-');
      q = query(q, orderBy(sortField, sortDirection as 'asc' | 'desc'));

      // Add pagination
      q = query(q, limit(ITEMS_PER_PAGE * page));

      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];

      setHasMore(properties.length === ITEMS_PER_PAGE * page);
      setResults(prev => resetResults ? properties : [...prev, ...properties]);
    } catch (error) {
      console.error('Search error:', error);
      setErrors(['Search failed. Please try again.']);
    } finally {
      setIsSearching(false);
    }
  }, [filters, debouncedLocation, page]);

  useEffect(() => {
    performSearch();
  }, [debouncedFilters, debouncedLocation, performSearch]);

  return {
    filters,
    location,
    results,
    errors,
    isSearching,
    updateFilter,
    setLocation,
    resetFilters,
    performSearch,
    hasMore,
    loadMore
  };
};



