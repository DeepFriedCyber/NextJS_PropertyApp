// app/components/FeaturedPropertiesClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { FeaturedProperty } from '@/types/FeaturedProperty';

export default function FeaturedPropertiesClient() {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties/featured');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
          <p>Loading properties...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        
        {properties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300 relative">
                  {property.imageUrl && (
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-primary-600 font-bold text-lg">
                    £{property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}