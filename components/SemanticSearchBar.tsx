'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SemanticResult {
  id: string;
  title?: string;
  location?: string;
  price?: number;
}

export default function EnhancedSearchBar() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SemanticResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'semantic' | 'filter'>('semantic');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const res = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setSearchMode('semantic')}
          className={`px-4 py-2 rounded ${
            searchMode === 'semantic' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Natural Language
        </button>
        <button 
          onClick={() => setSearchMode('filter')}
          className={`px-4 py-2 rounded ${
            searchMode === 'filter' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Advanced Filters
        </button>
      </div>
      
      {searchMode === 'semantic' ? (
        <SemanticSearch />
      ) : (
        <FilterSearch />
      )}
      
      <div className="mt-4">
        <SearchResults results={results} />
      </div>
    </div>
  );
}

function SemanticSearch() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SemanticResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const res = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Flats near parks under 500k"
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Matches:</h2>
          <ul className="space-y-4">
            {results.map((prop) => (
              <li key={prop.id} className="border p-4 rounded-lg">
                <Link href={`/property/${prop.id}`} className="block">
                  <div className="font-bold text-lg">{prop.title || 'Untitled Property'}</div>
                  <div className="text-gray-500">{prop.location}</div>
                  <div className="text-blue-700 font-semibold">
                    £{prop.price?.toLocaleString() ?? 'N/A'}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterSearch() {
  // Implement filter search logic here
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Advanced Filters</h2>
      <form className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Location"
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <input
          type="number"
          placeholder="Min Price"
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <input
          type="number"
          placeholder="Max Price"
          className="p-3 border border-gray-300 rounded-lg w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </form>
    </div>
  );
}

function SearchResults({ results }: { results: SemanticResult[] }) {
  if (results.length === 0) {
    return <p className="text-gray-500 mt-4">No results found</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Matches:</h2>
      <ul className="space-y-4">
        {results.map((prop) => (
          <li key={prop.id} className="border p-4 rounded-lg">
            <Link href={`/property/${prop.id}`} className="block">
              <div className="font-bold text-lg">{prop.title || 'Untitled Property'}</div>
              <div className="text-gray-500">{prop.location}</div>
              <div className="text-blue-700 font-semibold">
                £{prop.price?.toLocaleString() ?? 'N/A'}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
