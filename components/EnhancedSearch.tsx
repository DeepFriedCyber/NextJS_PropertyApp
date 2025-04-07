'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
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

      const data = await response.json();

      if (!response.ok) {
        console.error('Search failed:', data.error || 'Unknown error');
        setSearchState(prev => ({
          ...prev,
          isLoading: false,
          results: []
        }));
        return;
      }

      setSearchState(prev => ({
        ...prev,
        results: data.results || [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        results: []
      }));
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
    } else if (e.key === 'Enter' && selectedSuggestion >= 0 && selectedSuggestion < suggestions.length) {
      e.preventDefault();
      const selectedQuery = suggestions[selectedSuggestion];
      if (selectedQuery) {
        handleSearch(selectedQuery);
      }
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
          <form onSubmit={(e) => {
            e.preventDefault();
            if (inputValue.trim()) {
              semanticSearch(inputValue);
            }
          }}>
            <div className="relative mb-4">
              <input
                type="text"
                value={inputValue}
                placeholder="Describe your ideal property... (e.g. 'modern flat near parks with good transport links')"
                className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // Only search if there's at least 3 characters to avoid excessive API calls
                  if (e.target.value.trim().length >= 3) {
                    semanticSearch(e.target.value);
                  } else if (e.target.value.trim().length === 0) {
                    // Clear results if input is empty
                    setSearchState(prev => ({ ...prev, results: [], isLoading: false }));
                  }
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

            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              disabled={searchState.isLoading}
            >
              {searchState.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Search Properties
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <form onSubmit={(e) => {
            e.preventDefault();
            // Implement filter search logic here
            console.log('Filter search submitted');
          }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  id="location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Location</option>
                  <option value="London">London</option>
                  <option value="Manchester">Manchester</option>
                  <option value="Birmingham">Birmingham</option>
                  <option value="Edinburgh">Edinburgh</option>
                  <option value="Glasgow">Glasgow</option>
                  <option value="Liverpool">Liverpool</option>
                  <option value="Bristol">Bristol</option>
                  <option value="Leeds">Leeds</option>
                  <option value="Sheffield">Sheffield</option>
                  <option value="Cardiff">Cardiff</option>
                  <option value="Belfast">Belfast</option>
                  <option value="Newcastle">Newcastle</option>
                  <option value="Oxford">Oxford</option>
                  <option value="Cambridge">Cambridge</option>
                </select>
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  id="propertyType"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Type</option>
                  <option value="Detached">Detached</option>
                  <option value="Semi-Detached">Semi-Detached</option>
                  <option value="Terraced">Terraced</option>
                  <option value="Flat">Flat</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Cottage">Cottage</option>
                  <option value="New Build">New Build</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  id="bedrooms"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <select
                  id="minPrice"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">No Min</option>
                  <option value="100000">£100,000</option>
                  <option value="200000">£200,000</option>
                  <option value="300000">£300,000</option>
                  <option value="400000">£400,000</option>
                  <option value="500000">£500,000</option>
                  <option value="750000">£750,000</option>
                  <option value="1000000">£1,000,000</option>
                  <option value="2000000">£2,000,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <select
                  id="maxPrice"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">No Max</option>
                  <option value="200000">£200,000</option>
                  <option value="300000">£300,000</option>
                  <option value="400000">£400,000</option>
                  <option value="500000">£500,000</option>
                  <option value="750000">£750,000</option>
                  <option value="1000000">£1,000,000</option>
                  <option value="2000000">£2,000,000</option>
                  <option value="5000000">£5,000,000</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Search Properties
            </button>
          </form>
        </div>
      )}

      <SearchResults
        results={searchState.results}
        isLoading={searchState.isLoading}
      />
    </div>
  );
}




