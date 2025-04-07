import { XataRecord } from '@xata.io/client';
import { PropertiesRecord } from './xata';

/**
 * Helper function to safely access Xata system fields
 * @param record The Xata record
 * @returns An object with safely typed system fields
 */
export const getXataSystemFields = <T extends XataRecord>(record: T) => {
  return {
    id: record.id,
    createdAt: record.xata?.createdAt ?? new Date(),
    updatedAt: record.xata?.updatedAt ?? new Date(),
    version: record.xata?.version ?? 0
  };
};

/**
 * Type-safe property mapper for Xata records
 * @param property The property record from Xata
 * @returns A mapped property with default values
 */
export const mapPropertyRecord = (property: PropertiesRecord) => {
  const { createdAt } = getXataSystemFields(property);
  
  // Ensure image_url is a valid URL
  const imageUrl = property.image_url 
    ? property.image_url.startsWith('http') 
      ? property.image_url 
      : `https://${property.image_url}`
    : 'https://picsum.photos/800/600?random=1';
  
  return {
    id: property.id,
    title: property.title ?? 'Untitled Property',
    location: property.location ?? 'Unknown Location',
    price: property.price ?? 0,
    imageUrl,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    propertyType: property.property_type ?? 'Residential',
    status: property.status ?? 'for-sale',
    createdAt
  };
};