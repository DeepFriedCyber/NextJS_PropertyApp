'use client';

import { FC } from 'react';
import clsx from 'clsx';

interface PropertyCardSkeletonProps {
  layout?: 'grid' | 'list';
}

const PropertyCardSkeleton: FC<PropertyCardSkeletonProps> = ({ layout = 'grid' }) => {
  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm',
        layout === 'grid' ? 'w-full' : 'flex'
      )}
    >
      <div className={clsx(
        'relative bg-gray-200 animate-pulse',
        layout === 'grid' ? 'aspect-[4/3]' : 'w-64'
      )} />

      <div className={clsx(
        'p-4',
        layout === 'list' && 'flex-1'
      )}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton; 