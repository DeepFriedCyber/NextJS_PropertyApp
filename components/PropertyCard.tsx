import { useState } from 'react';
import Image from 'next/image';
import { PropertiesRecord } from '@/lib/xata';
import { formatPrice } from '@/utils/priceUtils';
import { PropertyStatus } from '@/types/uk-property';

interface PropertyCardProps {
  property: PropertiesRecord;
  onCompareToggle?: (id: string) => void;
  isInComparison?: boolean;
  layout?: 'grid' | 'list';
  onSelect?: () => void;
}

export function PropertyCard({ 
  property, 
  onCompareToggle, 
  isInComparison,
  layout = 'grid',
  onSelect 
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Ensure status is a valid PropertyStatus
  const status: PropertyStatus = property.status as PropertyStatus || 'for-sale';

  const cardClasses = layout === 'list'
    ? 'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex'
    : 'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl';

  const imageContainerClasses = layout === 'list'
    ? 'relative h-64 w-64 flex-shrink-0'
    : 'relative h-64';

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className={imageContainerClasses}>
        <Image
          src={property.imageUrl ?? '/placeholder-property.jpg'}
          alt={property.title ?? 'Property'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">
                View Details
              </span>
              {onCompareToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompareToggle(property.id);
                  }}
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${isInComparison 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white text-gray-800'}
                  `}
                >
                  {isInComparison ? 'Remove Compare' : 'Compare'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4">
          <span className={`
            px-2 py-1 rounded-full text-sm font-medium
            ${status === 'for-sale' ? 'bg-green-500' : 'bg-blue-500'}
            text-white
          `}>
            {status === 'for-sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
      </div>

      <div className={layout === 'list' ? 'p-4 flex-grow' : 'p-4'}>
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-1">
          {property.location}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-500">
            {formatPrice(property.price ?? undefined, status)}
          </span>
          
          <div className="flex gap-3 text-gray-600">
            <span>{property.bedrooms ?? 0} beds</span>
            <span>{property.bathrooms ?? 0} baths</span>
          </div>
        </div>
      </div>
    </div>
  );
}
