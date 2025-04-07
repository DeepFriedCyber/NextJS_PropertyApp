// components/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePropertySearch } from '@/hooks/usePropertySearch';
import Link from 'next/link';

export default function SearchBar() {
  const { searchState, semanticSearch } = usePropertySearch();
  const [query, setQuery] = useState('');
  const { results, isLoading } = searchState;

  // Perform search when query changes
  useEffect(() => {
    if (query.trim()) {
      const delaySearch = setTimeout(() => {
        semanticSearch(query);
      }, 300);

      return () => clearTimeout(delaySearch);
    }
  }, [query, semanticSearch]);

  return (
    <div className="relative max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
        placeholder="Search properties by title, location, or type..."
      />

      {isLoading && (
        <div className="absolute left-0 right-0 mt-2 px-4 text-sm text-gray-500">Searching...</div>
      )}

      {results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-auto">
          {results.slice(0, 5).map((property) => (
            <li key={property.id} className="p-3 hover:bg-gray-100">
              <Link href={`/property/${property.id}`}>
                <div className="font-semibold">{property.title}</div>
                <div className="text-sm text-gray-500">{property.location}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
