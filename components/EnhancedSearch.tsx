'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import type { PropertiesRecord } from '@/lib/xata';
import type { SearchMode } from '@/types/search';

export default function EnhancedSearch() {
  const [searchState, setSearchState] = useState({
    mode: 'semantic' as SearchMode,
    results: [] as PropertiesRecord[],
    isLoading: false,
  });
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // Example suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const baseSuggestions = [
        `${inputValue} with garden`,
        `${inputValue} near transport`,
        `${inputValue} with parking`,
        `modern ${inputValue}`,
        `spacious ${inputValue}`,
      ];
      setSuggestions(baseSuggestions);
    } else {
      setSuggestions([]);
    }
    setSelectedSuggestion(-1);
  }, [inputValue]);

  const setSearchMode = (mode: SearchMode) => {
    setSearchState(prev => ({ ...prev, mode }));
  };

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

  const handleSearch = (query: string) => {
    semanticSearch(query);
    setInputValue(query);
    setSuggestions([]);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((prev) => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
      e.preventDefault();
      handleSearch(suggestions[selectedSuggestion]);
    }
  };

  const SearchResults = ({ 
    results, 
    isLoading 
  }: { 
    results: PropertiesRecord[]; 
    isLoading: boolean;
  }) => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

    if (isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {results.length} properties found
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              List
            </button>
          </div>
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
          {results.map(property => (
            <div
              key={property.id}
              className={`relative ${
                selectedProperties.includes(property.id) ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <PropertyCard 
                property={property}
                layout={view}
                onSelect={() => {
                  setSelectedProperties(prev =>
                    prev.includes(property.id)
                      ? prev.filter(id => id !== property.id)
                      : [...prev, property.id]
                  );
                }}
              />
            </div>
          ))}
        </div>

        {selectedProperties.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>{selectedProperties.length} properties selected</div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">
                  Compare
                </button>
                <button 
                  onClick={() => setSelectedProperties([])}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSearchMode('semantic')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${
            searchState.mode === 'semantic' 
              ? 'bg-primary-500 text-white shadow-lg scale-105' 
              : 'bg-white hover:bg-gray-50 shadow-sm'
          }`}
        >
          Natural Language Search
        </button>
        <button
          onClick={() => setSearchMode('filter')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${
            searchState.mode === 'filter'
              ? 'bg-primary-500 text-white shadow-lg scale-105'
              : 'bg-white hover:bg-gray-50 shadow-sm'
          }`}
        >
          Filter Search
        </button>
      </div>

      {searchState.mode === 'semantic' ? (
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              placeholder="Describe your ideal property... (e.g. 'modern flat near parks with good transport links')"
              className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              onChange={(e) => {
                setInputValue(e.target.value);
                semanticSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`px-4 py-2 cursor-pointer ${
                      index === selectedSuggestion ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSearch(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {/* Filter content */}
        </div>
      )}

      <SearchResults
        results={searchState.results}
        isLoading={searchState.isLoading}
      />
    </div>
  );
}




