'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/contexts/CompareContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ErrorBoundary } from 'react-error-boundary';
import { PropertyUnion, isXataProperty } from '@/types/property';
import PropertyCardError from './PropertyCardError';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import { trackEvent } from '@/utils/tracking';
import clsx from 'clsx';
import '@/styles/theme.css';

// Helper function to determine price tier
const getPriceTier = (price: number): string => {
  if (price < 200000) return 'budget';
  if (price < 400000) return 'mid-range';
  if (price < 600000) return 'premium';
  return 'luxury';
};

interface PropertyCardProps {
  property: PropertyUnion;
  onSelect?: () => void;
  layout?: 'grid' | 'list';
  currencyCode?: string;
}

const normalizeProperty = (property: PropertyUnion) => {
  if (isXataProperty(property)) {
    const xataSystemFields = property.xata || { createdAt: new Date().toISOString() };
    return {
      id: property.id,
      title: property.title,
      price: property.price,
      location: property.location,
      description: property.description,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      propertyType: property.property_type,
      status: property.status,
      imageUrl: property.image_url,
      squareFeet: property.square_feet || 0,
      listingAgent: property.listing_agent || '',
      createdAt: xataSystemFields.createdAt,
      isFeatured: property.is_featured || false,
      isForSale: property.status === 'for_sale'
    };
  }
  return property;
};

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onSelect, 
  layout = 'grid',
  currencyCode = 'GBP'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { addToCompare, removeFromCompare, compareList } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const normalizedProperty = normalizeProperty(property);
  const isInCompareList = compareList.includes(normalizedProperty.id);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDetailsClick = () => {
    trackEvent({
      name: 'PropertyCard_ViewDetails',
      properties: {
        propertyId: normalizedProperty.id,
        price: normalizedProperty.price,
        propertyType: normalizedProperty.propertyType,
        location: normalizedProperty.location
      }
    });
    onSelect?.();
  };

  const handleCompareToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (compareList.length >= 4 && !isInCompareList) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-error text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = 'You can only compare up to 4 properties at a time';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      return;
    }

    trackEvent({
      name: 'PropertyCard_CompareToggle',
      properties: {
        propertyId: normalizedProperty.id,
        action: isInCompareList ? 'remove' : 'add',
        currentCompareCount: compareList.length
      }
    });

    if (isInCompareList) {
      removeFromCompare(normalizedProperty.id);
    } else {
      addToCompare(normalizedProperty.id);
    }
  }, [isInCompareList, normalizedProperty.id, addToCompare, removeFromCompare, compareList.length]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent({
      name: 'PropertyCard_FavoriteToggle',
      properties: {
        propertyId: normalizedProperty.id,
        action: isFavorite(normalizedProperty.id) ? 'remove' : 'add'
      }
    });
    toggleFavorite(normalizedProperty.id);
  };

  if (isLoading) {
    return <PropertyCardSkeleton layout={layout} />;
  }

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(normalizedProperty.price);

  return (
    <ErrorBoundary FallbackComponent={PropertyCardError}>
      <div
        className={clsx(
          'group relative overflow-hidden rounded-xl border',
          'border-[var(--border-color)] bg-[var(--bg-primary)]',
          'shadow-[var(--card-shadow)] transition-all duration-[var(--transition-normal)]',
          'hover:shadow-[var(--card-shadow-hover)]',
          layout === 'grid' ? 'w-full' : 'flex'
        )}
        role="article"
        aria-labelledby={`property-${normalizedProperty.id}-title`}
        data-bedrooms={normalizedProperty.bedrooms}
        data-price-tier={getPriceTier(normalizedProperty.price)}
        data-property-type={normalizedProperty.propertyType}
        data-location={normalizedProperty.location}
        data-square-feet={normalizedProperty.squareFeet}
        data-bathrooms={normalizedProperty.bathrooms}
        data-status={normalizedProperty.status}
        data-featured={normalizedProperty.isFeatured}
      >
        <Link
          href={`/properties/${normalizedProperty.id}`}
          onClick={handleDetailsClick}
          className={clsx(
            'block',
            layout === 'grid' ? 'h-full' : 'flex-1'
          )}
        >
          <div className={clsx(
            'relative',
            layout === 'grid' ? 'aspect-[4/3]' : 'w-64'
          )}>
            <Image
              src={normalizedProperty.imageUrl || '/placeholder.jpg'}
              alt={normalizedProperty.title}
              fill
              className="object-cover transition-transform duration-[var(--transition-normal)] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
            {isInCompareList && (
              <div className="absolute top-2 left-2 bg-[var(--primary-500)] text-white px-2 py-1 rounded-full text-xs font-medium">
                {compareList.indexOf(normalizedProperty.id) + 1}
              </div>
            )}
          </div>

          <div className={clsx(
            'p-4',
            layout === 'list' && 'flex-1'
          )}>
            <h3
              id={`property-${normalizedProperty.id}-title`}
              className="text-lg font-semibold text-[var(--text-primary)] mb-1"
            >
              {normalizedProperty.title}
            </h3>
            <p className="text-[var(--primary-600)] font-medium mb-2">{formattedPrice}</p>
            <p className="text-[var(--text-secondary)] text-sm mb-4">{normalizedProperty.location}</p>

            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span>{normalizedProperty.bedrooms} {normalizedProperty.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
              <span>{normalizedProperty.bathrooms} {normalizedProperty.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
              {normalizedProperty.squareFeet > 0 && (
                <span>{normalizedProperty.squareFeet} sq ft</span>
              )}
            </div>
          </div>
        </Link>

        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleFavoriteToggle}
            className={clsx(
              "w-9 h-9 rounded-full shadow-[var(--card-shadow)] flex items-center justify-center transition-colors duration-[var(--transition-normal)]",
              isFavorite(normalizedProperty.id)
                ? "bg-[var(--error)] text-white hover:bg-[var(--error)]"
                : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            )}
            aria-label={isFavorite(normalizedProperty.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <svg
              className="w-5 h-5"
              fill={isFavorite(normalizedProperty.id) ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <button
            onClick={handleCompareToggle}
            className={clsx(
              "w-9 h-9 rounded-full shadow-[var(--card-shadow)] flex items-center justify-center transition-colors duration-[var(--transition-normal)]",
              isInCompareList
                ? "bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]"
                : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            )}
            aria-label={isInCompareList ? 'Remove from Compare' : 'Add to Compare'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PropertyCard;