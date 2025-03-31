import Image from 'next/image';
import Link from 'next/link';
import type { PropertiesRecord } from '@/lib/xata';

interface PropertyGridProps {
  properties: PropertiesRecord[];
}

export function PropertyGrid({ properties }: PropertyGridProps) { // Changed to named export
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No properties found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/property/${property.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48">
            <Image
              src={property.imageUrl || '/placeholder-property.jpg'}
              alt={property.title || 'Property'}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {property.title}
            </h3>
            
            <p className="text-gray-600 mb-2">
              {property.location}
            </p>
            
            <div className="flex justify-between items-center">
              <p className="text-primary-600 font-semibold">
                £{property.price?.toLocaleString()}
              </p>
              
              <div className="flex items-center text-gray-500">
                <span className="mr-2">{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
