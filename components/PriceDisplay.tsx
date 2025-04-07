import { useMemo } from 'react';

interface PriceDisplayProps {
  price: number;
  isForSale: boolean;
  className?: string;
}

export default function PriceDisplay({ price, isForSale, className = '' }: PriceDisplayProps) {
  // Format price with commas for thousands
  const formattedPrice = useMemo(() => {
    return price.toLocaleString('en-GB');
  }, [price]);

  return (
    <div className={`mb-4 ${className}`}>
      <span className="text-xl font-semibold text-primary-300">
        £{formattedPrice}
        {!isForSale && (
          <span className="text-sm text-gray-400 ml-1">pcm</span>
        )}
      </span>
      <span className="text-sm text-gray-400 block mt-1">
        {isForSale ? 'Freehold' : 'Including council tax'}
      </span>
    </div>
  );
} 