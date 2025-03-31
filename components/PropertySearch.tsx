'use client';

import { usePropertySearch } from '@/hooks/usePropertySearch';
import Link from 'next/link';

export default function PropertySearch() {
  const { query, setQuery, results, loading } = usePropertySearch();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <input
        type="text"
        placeholder="e.g. Brighton 2 bed flat under 700k"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded text-lg"
      />

      {loading && <p className="mt-4 text-gray-600">Searching...</p>}

      <ul className="mt-6 space-y-4">
        {results.map((property) => (
          <li key={property.id} className="p-4 border rounded bg-white shadow">
            <Link href={`/property/${property.id}`}>
              <div>
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p>{property.location}</p>
                <p className="text-blue-600 font-bold">
                  £{property.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
