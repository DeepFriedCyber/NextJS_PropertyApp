import { useState } from 'react';
import type { PropertiesRecord } from '@/lib/xata';

export function usePropertySearch() {
  const [searchState, setSearchState] = useState({
    mode: 'semantic' as 'semantic' | 'filter',
    results: [] as PropertiesRecord[],
    isLoading: false,
  });

  const semanticSearch = async (query: string) => {
    try {
      setSearchState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          mode: 'semantic'
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchState(prev => ({
        ...prev,
        results: data.results,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const filterSearch = async (filters: any) => {
    try {
      setSearchState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters,
          mode: 'filter'
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchState(prev => ({
        ...prev,
        results: data.results,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setSearchMode = (mode: 'semantic' | 'filter') => {
    setSearchState(prev => ({ ...prev, mode }));
  };

  return {
    searchState,
    semanticSearch,
    filterSearch,
    setSearchMode,
  };
}
