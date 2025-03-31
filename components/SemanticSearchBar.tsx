'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SemanticResult {
  id: string;
  title?: string;
  location?: string;
  price?: number;
}

export default function SemanticSearchBar() {
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
