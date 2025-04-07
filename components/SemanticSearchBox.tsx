'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SemanticSearchBoxProps {
  initialQuery?: string;
}

export default function SemanticSearchBox({ initialQuery = '' }: SemanticSearchBoxProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties/search?q=${encodeURIComponent(searchQuery)}&mode=semantic`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Describe what you're looking for..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Search
        </button>
      </form>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Try searching for:</p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSearchQuery("Modern apartment with balcony")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
          >
            Modern apartment with balcony
          </button>
          <button 
            onClick={() => setSearchQuery("Family home near good schools")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
          >
            Family home near good schools
          </button>
          <button 
            onClick={() => setSearchQuery("Properties with garden and parking")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
          >
            Garden and parking
          </button>
        </div>
      </div>
    </div>
  );
}