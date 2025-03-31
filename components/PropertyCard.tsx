'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/priceUtils';
import type { PropertiesRecord } from '@/lib/xata';

interface PropertyCardProps {
  property: PropertiesRecord;
}

const getStatusBadgeColor = (status: string | undefined) => {
  switch (status) {
    case 'for-rent':
      return 'bg-blue-500';
    case 'for-sale':
      return 'bg-green-500';
    case 'under-offer':
      return 'bg-orange-500';
    case 'sold':
      return 'bg-red-500';
    case 'let-agreed':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Add your property card JSX here */}
    </div>
  );
}



