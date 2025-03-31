'use client';

interface SavedSearch {
  id: string;
  criteria: string;
  filters: Record<string, any>;
  notifyOnNew: boolean;
}

export function SavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Saved Searches</h2>
      {savedSearches.map((search) => (
        <div key={search.id} className="border-b py-3 flex justify-between items-center">
          <div>
            <p className="font-medium">{search.criteria}</p>
            <p className="text-sm text-gray-500">
              {Object.entries(search.filters)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' • ')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Run Search
            </button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={search.notifyOnNew}
                onChange={() => {/* Toggle notifications */}}
                className="rounded text-primary-600"
              />
              <span className="text-sm text-gray-600">Notify me</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}