// app/components/FeaturedPropertiesSection.tsx
'use client';

import Link from 'next/link';
import { FeaturedProperty } from '@/types/FeaturedProperty';

interface Props {
  properties: FeaturedProperty[];
}

export default function FeaturedPropertiesSection({ properties }: Props) {
  // Enhance properties directly without state
  const featuredProperties = properties.map(property => ({
    ...property,
    featured: property.featured || false,
    listingType: property.listingType || 'sale'
  }));
  
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        
        {featuredProperties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300 relative">
                  {property.imageUrl && (
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-sm">
                    {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-primary-600 font-bold text-lg">
                    {property.listingType === 'rent' 
                      ? `£${property.price.toLocaleString()} /month` 
                      : `£${property.price.toLocaleString()}`
                    }
                  </p>
                  <div className="flex justify-between mt-4 text-sm text-gray-500">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.squareFeet} sq ft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link 
            href="/properties" 
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}