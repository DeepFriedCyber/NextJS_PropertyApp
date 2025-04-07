// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PropertyGrid from '@/components/PropertyGrid';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useCompare } from '@/contexts/CompareContext';
import CompareButton from '@/components/CompareButton';
import { PropertiesRecord } from '@/lib/xata';

export default function Home() {
  const [properties, setProperties] = useState<PropertiesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertiesRecord | null>(null);
  const { addToCompare } = useCompare();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleViewDetails = (property: PropertiesRecord) => {
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
        <PropertyGrid
          properties={properties}
          onCompare={addToCompare}
          onViewDetails={handleViewDetails}
        />
        <CompareButton />
      </main>
    </ErrorBoundary>
  );
}

