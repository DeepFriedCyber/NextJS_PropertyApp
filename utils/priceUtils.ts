import { PropertyStatus } from '@/types/uk-property';

export const formatPrice = (price: number | null | undefined, status: PropertyStatus): string => {
  if (!price) return '£0';

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedPrice = formatter.format(price);
  
  switch (status) {
    case 'for-rent':
      return `${formattedPrice} pcm`;
    case 'for-sale':
      return formattedPrice;
    case 'under-offer':
      return `${formattedPrice} (Under Offer)`;
    case 'sold':
      return `${formattedPrice} (Sold)`;
    case 'let-agreed':
      return `${formattedPrice} pcm (Let Agreed)`;
    default:
      return formattedPrice;
  }
};

export const validatePrice = (price: number, status: PropertyStatus): boolean => {
  if (price <= 0) return false;
  
  // Rental prices typically between £50 and £100,000 per month
  if (status === 'for-rent' || status === 'let-agreed') {
    return price >= 50 && price <= 100000;
  }
  
  // Sale prices typically between £1,000 and £100,000,000
  return price >= 1000 && price <= 100000000;
};
