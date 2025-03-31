'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';

export function RecentSearches({ onSearchSelect }: { onSearchSelect: (search: string) => void }) {
  const [recentSearches] = useLocalStorage<string[]>('recent-searches', []);

  if (recentSearches.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {recentSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchSelect(search)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-2"
          >
            <span>🕒</span> {search}
          </button>
        ))}
      </div>
    </div>
  );
}