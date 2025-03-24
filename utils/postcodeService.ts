import { PostcodeLookupResult } from '@/types/uk-property';

export const validateUKPostcode = (postcode: string): boolean => {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim());
};

export const formatPostcode = (postcode: string): string => {
  const clean = postcode.trim().toUpperCase();
  const length = clean.length;
  return `${clean.slice(0, length-3)} ${clean.slice(length-3)}`;
};

export const lookupPostcode = async (postcode: string): Promise<PostcodeLookupResult> => {
  if (!validateUKPostcode(postcode)) {
    throw new Error('Invalid UK postcode format');
  }

  const formattedPostcode = formatPostcode(postcode);
  
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(formattedPostcode)}`
    );

    if (!response.ok) {
      throw new Error('Postcode not found');
    }

    const data = await response.json();
    
    return {
      postcode: formattedPostcode,
      latitude: data.result.latitude,
      longitude: data.result.longitude,
      town: data.result.admin_district,
      region: data.result.region,
      country: data.result.country
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Postcode lookup failed: ${error.message}`);
    } else {
      throw new Error('Postcode lookup failed: Unknown error');
    }
  }
};