'use client';

import { useState, useRef } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { PropertiesRecord } from '@/lib/xata';
import { useRouter } from 'next/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: PropertiesRecord[];
  onCompare: (id: string) => void;
  onViewDetails: (property: PropertiesRecord) => void;
}

function PropertyGridContent({ properties, onCompare, onViewDetails }: PropertyGridProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('price-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  const sortedAndFilteredProperties = properties
    .filter(property => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        property.title?.toLowerCase().includes(query) ||
        property.location?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query) ||
        property.property_type?.toLowerCase().includes(query) ||
        property.property_age?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'bedrooms-asc':
          return (a.bedrooms || 0) - (b.bedrooms || 0);
        case 'bedrooms-desc':
          return (b.bedrooms || 0) - (a.bedrooms || 0);
        default:
          return 0;
      }
    });

  const rowVirtualizer = useVirtualizer({
    count: sortedAndFilteredProperties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimated height of each property card
    overscan: 5, // Number of items to render outside the visible area
  });

  if (sortedAndFilteredProperties.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        No properties found matching your criteria
      </div>
    );
  }

  const handleViewDetails = (property: PropertiesRecord) => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <div className="space-y-4" data-testid="property-grid">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded-md border-[var(--border-color)] bg-[var(--bg-primary)]"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded-md border-[var(--border-color)] bg-[var(--bg-primary)]"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="bedrooms-asc">Bedrooms: Few to Many</option>
          <option value="bedrooms-desc">Bedrooms: Many to Few</option>
        </select>
      </div>

      <div 
        ref={parentRef} 
        className="h-[calc(100vh-200px)] overflow-auto"
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const property = sortedAndFilteredProperties[virtualRow.index];
            if (!property) return null;
            
            const xataProperty = {
              ...property,
              _type: 'xata' as const
            };
            
            return (
              <div
                key={property.id}
                data-testid={`property-card-${property.id}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <PropertyCard
                  property={xataProperty}
                  onSelect={() => handleViewDetails(property)}
                  layout="list"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PropertyGrid(props: PropertyGridProps) {
  return (
    <ErrorBoundary>
      <PropertyGridContent {...props} />
    </ErrorBoundary>
  );
}





