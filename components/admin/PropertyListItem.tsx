'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PropertiesRecord } from '@/lib/xata';
import PropertyStatusBadge from './PropertyStatusBadge';
import DeletePropertyButton from './DeletePropertyButton';
import { PropertyStatus } from '@/types/uk-property';
import {
  PencilIcon,
  EyeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface PropertyListItemProps {
  property: PropertiesRecord;
}

export default function PropertyListItem({ property }: PropertyListItemProps) {
  return (
    <div className="p-4 hover:bg-dark-700 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Property Image */}
        <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4 bg-dark-600 flex items-center justify-center">
          {property.imageUrl ? (
            <Image
              src={property.imageUrl}
              alt={property.title || 'Property'}
              fill
              className="object-cover"
            />
          ) : (
            <HomeIcon className="h-12 w-12 text-dark-400" />
          )}
        </div>
        
        {/* Property Details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">
                {property.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">{property.location}</p>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <PropertyStatusBadge status={property.status as PropertyStatus} />
                
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-600 text-gray-300">
                  {property.propertyType}
                </span>
                
                {property.bedrooms && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-600 text-gray-300">
                    {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                  </span>
                )}
                
                {property.bathrooms && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-600 text-gray-300">
                    {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-2 md:mt-0 md:ml-4 md:text-right">
              <p className="text-xl font-bold text-primary-300">
                £{property.price?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                Added {new Date(property.xata_createdat).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Link
              href={`/property/${property.id}`}
              className="inline-flex items-center px-3 py-1.5 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View
            </Link>
            
            <Link
              href={`/admin/properties/${property.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Link>
            
            <DeletePropertyButton
              propertyId={property.id}
              className="inline-flex items-center px-3 py-1.5 text-white text-sm rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}