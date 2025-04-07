'use client';

import { useEffect, useState } from 'react';
import { useCompare } from '@/contexts/CompareContext';
import { PropertiesRecord } from '@/lib/xata';
import PropertyCompare from './PropertyCompare';
import ErrorBoundary from './ErrorBoundary';

function CompareButtonContent() {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    showCompare, 
    setShowCompare,
    compareProperties,
    setCompareProperties
  } = useCompare();

  const [error, setError] = useState<string | null>(null);

  // Fetch property details when compareList changes
  useEffect(() => {
    const fetchProperties = async () => {
      if (compareList.length === 0) {
        setCompareProperties([]);
        return;
      }

      try {
        const response = await fetch('/api/properties/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: compareList }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const properties = await response.json();
        const sortedProperties = compareList
          .map(id => properties.find((property: PropertiesRecord) => property.id === id))
          .filter((property): property is PropertiesRecord => property !== undefined);

        setCompareProperties(sortedProperties);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties for comparison:', err);
        setError('Failed to load comparison data');
      }
    };

    fetchProperties();
  }, [compareList, setCompareProperties]);

  // Show compare drawer when properties are added
  useEffect(() => {
    if (compareList.length > 0 && !showCompare) {
      setShowCompare(true);
    }
  }, [compareList, showCompare, setShowCompare]);

  if (error) {
    throw new Error(error);
  }

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-in-out ${showCompare ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        <button
          data-testid="compare-button"
          onClick={() => setShowCompare(true)}
          disabled={compareList.length === 0}
          className={`bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2 ${compareList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Compare ({compareList.length})</span>
        </button>
      </div>

      {showCompare && compareProperties.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300" data-testid="compare-drawer">
          <PropertyCompare
            properties={compareProperties}
            onRemove={removeFromCompare}
            onClose={() => setShowCompare(false)}
          />
        </div>
      )}
    </>
  );
}

export default function CompareButton() {
  return (
    <ErrorBoundary>
      <CompareButtonContent />
    </ErrorBoundary>
  );
}