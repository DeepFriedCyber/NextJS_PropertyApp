'use client';

import { useState } from 'react';
import { PropertiesRecord } from '@/lib/xata';

export function CompareProperties() {
  const [selectedProperties, setSelectedProperties] = useState<PropertiesRecord[]>([]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg transform transition-transform">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-medium">Compare Properties ({selectedProperties.length})</h3>
            <div className="flex gap-2">
              {selectedProperties.map(property => (
                <div key={property.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm">{property.title}</span>
                  <button
                    onClick={() => {/* Remove property */}}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedProperties([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
            <button
              disabled={selectedProperties.length < 2}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}