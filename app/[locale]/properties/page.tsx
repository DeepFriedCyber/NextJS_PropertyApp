'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PropertySearch from '@/components/PropertySearch';
import AdvancedFilters from '@/components/PropertyAdvancedFilters';
import PropertyGrid from '@/components/PropertyGrid';
import { useQuery } from '@tanstack/react-query';
import type { PropertiesRecord } from '@/lib/xata';

// Dynamically import heavy components
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  loading: () => <LoadingSpinner />,
  ssr: false // If it uses browser APIs
});

export default function PropertiesPage() {
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties');
      if (!res.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await res.json();
      return data.properties as PropertiesRecord[];
    },
  });

  return (
    <main className="container mx-auto p-6">
      <h1 className="sr-only">Property Search</h1>
      <PropertySearch />
      <AdvancedFilters />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        <PropertyGrid />
        <PropertyMap properties={properties} />
      </div>
    </main>
  );
}
