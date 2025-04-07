import Image from 'next/image';
import { useState } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';

interface PropertyImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function PropertyImage({ 
  src, 
  alt, 
  className = '', 
  fill = true, 
  sizes,
  loading = 'lazy',
  decoding = 'async',
  onError
}: PropertyImageProps) {
  const [error, setError] = useState(false);

  // If no src or error, show fallback
  if (!src || error) {
    return (
      <div className={`relative bg-gradient-to-br from-dark-600 to-dark-800 flex items-center justify-center ${className}`}>
        <HomeIcon className="w-12 h-12 text-primary-300 opacity-50" />
      </div>
    );
  }

  // Ensure the URL is valid
  const imageSrc = src.startsWith('http') ? src : `https://${src}`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        className="object-cover"
        onError={handleError}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        priority={loading === 'eager'}
        quality={75}
        unoptimized={true}
      />
    </div>
  );
} 