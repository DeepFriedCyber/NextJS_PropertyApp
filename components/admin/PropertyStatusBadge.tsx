'use client';

import { PropertyStatus } from '@/types/uk-property';

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
}

export default function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  // Define colors for each status
  const statusConfig: Record<PropertyStatus, { bg: string; text: string; label: string }> = {
    'for-sale': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'For Sale'
    },
    'for-rent': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'For Rent'
    },
    'under-offer': {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      label: 'Under Offer'
    },
    'sold': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Sold'
    },
    'let-agreed': {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      label: 'Let Agreed'
    }
  };
  
  const config = statusConfig[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status.replace(/-/g, ' ')
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}