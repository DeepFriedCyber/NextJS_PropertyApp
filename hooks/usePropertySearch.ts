'use client';

import { useState, useEffect } from 'react';
import { getXataClient } from '@/lib/xata';
import type { PropertiesRecord } from '@/lib/xata';
import { SearchOptions, BaseData } from '@xata.io/client';

// Define the return type for our hook
interface UsePropertySearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: PropertiesRecord[];
  loading: boolean;
}

// Configuration constants
const DEBOUNCE_DELAY = 400;

const SEARCH_CONFIG: SearchOptions<Record<string, BaseData>, string> = {
  fuzziness: 1,
  highlight: {
    enabled: true
  }
};

/**
 * Custom hook for property search functionality
 * Provides debounced search against Xata database
 */
export function usePropertySearch(): UsePropertySearchReturn {
  // State management
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<PropertiesRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Effect for debounced search
  useEffect(() => {
    // Don't search if query is empty
    if (!query.trim()) {
      setResults([]);
      return () => {}; // Empty cleanup function
    }

    // Set loading state
    setLoading(true);

    // Create timeout for debounce
    const timeoutId = setTimeout(async () => {
      try {
        // Get Xata client and perform search
        const xata = getXataClient();
        const searchResults = await xata.db.properties.search(
          query.trim(),
          SEARCH_CONFIG
        );

        // Update results
        setResults(searchResults.records);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup function to clear timeout
    return () => clearTimeout(timeoutId);
  }, [query]); // Only re-run when query changes

  // Return the hook interface
  return {
    query,
    setQuery,
    results,
    loading
  };
}
