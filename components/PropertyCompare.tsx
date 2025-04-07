'use client';

import { useState } from 'react';
import { PropertiesRecord } from '@/lib/xata';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { SVGProps } from 'react';
import PropertyImage from './PropertyImage';

interface PropertyCompareProps {
  properties: PropertiesRecord[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export default function PropertyCompare({ properties, onRemove, onClose }: PropertyCompareProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Match the transition duration
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold" data-testid="compare-title">Compare Properties</h2>
          <button
            data-testid="close-compare"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 min-w-max">
            {properties.map((property) => (
              <div
                key={property.id}
                className="w-80 flex-shrink-0 border rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-lg"
                data-testid={`property-card-${property.id}`}
              >
                <div className="relative h-48">
                  <PropertyImage
                    src={property.image_url}
                    alt={property.title}
                    className="transition-transform duration-200 hover:scale-105"
                  />
                  <button
                    data-testid={`remove-property-${property.id}`}
                    onClick={() => onRemove(property.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold" data-testid={`property-address-${property.id}`}>
                    {property.title}
                  </h3>
                  <p className="text-gray-600" data-testid={`property-price-${property.id}`}>
                    £{property.price.toLocaleString()}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <p data-testid={`property-beds-${property.id}`}>{property.bedrooms}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Bathrooms</span>
                      <p data-testid={`property-baths-${property.id}`}>{property.bathrooms}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}