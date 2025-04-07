import { getXataClient } from "@/lib/xata";
import { PropertyType, TenureType, PropertyStatus } from "@/types/uk-property";
import { getEmbedding } from "@/lib/embedding";
import { parse } from 'papaparse';
import { propertyTypeMap, tenureMap, defaultPropertyType, defaultTenureType } from '@/config/propertyMappings';
import logger from '@/utils/logger';
import { DatabaseError, ValidationError, EmbeddingError, CSVParsingError } from '@/utils/errors';

// Interface for UK sold property data from CSV
export interface UKSoldPropertyData {
  address: string;
  postcode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  squareFeet: number;
  tenure: string;
  saleDate: string;
  description?: string | null;
  location?: string | null;
  town?: string | null;
  district?: string | null;
  county?: string | null;
}

// Validate UKSoldPropertyData
function validatePropertyData(data: UKSoldPropertyData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.address) errors.push('Address is required');
  if (!data.postcode) errors.push('Postcode is required');
  if (typeof data.price !== 'number' || isNaN(data.price) || data.price <= 0) {
    errors.push('Price must be a positive number');
  }
  if (!data.saleDate) errors.push('Sale date is required');
  if (!data.propertyType) errors.push('Property type is required');
  if (!data.tenure) errors.push('Tenure is required');

  // Optional numeric fields should be numbers if present
  if (data.bedrooms !== null && (typeof data.bedrooms !== 'number' || isNaN(data.bedrooms))) {
    errors.push('Bedrooms must be a number');
  }
  if (data.bathrooms !== null && (typeof data.bathrooms !== 'number' || isNaN(data.bathrooms))) {
    errors.push('Bathrooms must be a number');
  }
  if (data.squareFeet !== null && (typeof data.squareFeet !== 'number' || isNaN(data.squareFeet))) {
    errors.push('Square feet must be a number');
  }

  return { valid: errors.length === 0, errors };
}

// Map CSV property types to our application's property types
const mapPropertyType = (csvType: string): PropertyType => {
  // Default to the configured default if no match is found
  return propertyTypeMap[csvType.toLowerCase()] || defaultPropertyType;
};

// Map CSV tenure types to our application's tenure types
const mapTenure = (csvTenure: string): TenureType => {
  // Default to the configured default if no match is found
  return tenureMap[csvTenure.toLowerCase()] || defaultTenureType;
};

// Generate a title from the address
export function generateTitle(address: string | null | undefined, propertyType: string): string {
  if (!address) return `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} for sale on `;
  
  const addressParts = address.split(',');
  const firstPart = addressParts[0]?.trim() || '';
  
  return `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} for sale on ${firstPart}`;
}

// Generate a description from the property data
const generateDescription = (data: UKSoldPropertyData): string => {
  const formattedType = data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1);
  const bedroomText = data.bedrooms !== null ? `${data.bedrooms} bedroom` : '';
  const bathroomText = data.bathrooms !== null ? `${data.bathrooms} bathroom` : '';
  const sizeText = data.squareFeet !== null ? `approximately ${data.squareFeet} sq ft` : '';

  let description = `This ${formattedType} property`;

  if (bedroomText || bathroomText) {
    description += ` features ${bedroomText}${bedroomText && bathroomText ? ' and ' : ''}${bathroomText}`;
  }

  if (sizeText) {
    description += ` with ${sizeText} of living space`;
  }

  const location = data.town || data.district || data.postcode;
  description += `. Located in ${location}, this property was previously sold for £${data.price.toLocaleString()} on ${new Date(data.saleDate).toLocaleDateString()}.`;

  if (data.description !== null) {
    description += ` ${data.description}`;
  }

  return description;
};

// Process and import a single property record
export const importSoldProperty = async (data: UKSoldPropertyData) => {
  const propertyLogger = logger.withContext('PropertyImport');

  // Validate the property data
  const validation = validatePropertyData(data);
  if (!validation.valid) {
    const errorMessage = `Invalid property data: ${validation.errors.join(', ')}`;
    propertyLogger.error(errorMessage);
    throw new ValidationError(errorMessage);
  }

  const xata = getXataClient();

  try {
    // Map property type and tenure
    const propertyType = mapPropertyType(data.propertyType);
    const tenure = mapTenure(data.tenure);

    // Generate title and description if not provided
    const title = generateTitle(data.address, data.propertyType);
    const description = data.description !== null ? data.description : generateDescription(data);

    // Combine location information
    const location = data.location !== null ? data.location :
      [data.postcode, data.town, data.district, data.county]
        .filter(item => item !== null)
        .join(', ');

    // Create property record
    const propertyData: {
      title: string;
      price: number;
      location: string;
      description: string;
      propertyType: PropertyType;
      tenure: TenureType;
      status: PropertyStatus;
      bedrooms: number;
      bathrooms: number;
      squareFeet: number;
      imageUrl: null;
      embedding?: number[]; // Add embedding field as optional
    } = {
      title,
      price: data.price,
      location: location || '',
      description: description || '',
      propertyType,
      tenure,
      status: 'sold' as PropertyStatus,
      bedrooms: data.bedrooms !== null ? data.bedrooms : 0,
      bathrooms: data.bathrooms !== null ? data.bathrooms : 0,
      squareFeet: data.squareFeet !== null ? data.squareFeet : 0,
      // Add default image URL if needed
      imageUrl: null,
      // Add any other required fields
    };

    // Generate embedding for semantic search
    try {
      const embedding = await getEmbedding(
        `${title} ${description} ${propertyType} ${location} ${data.price}`
      );

      if (embedding) {
        propertyData.embedding = embedding;
      }
    } catch (error) {
      propertyLogger.warn('Error generating embedding, continuing without it:', error);
      // Continue without embedding instead of throwing
      // throw new EmbeddingError('Failed to generate embedding for property', error as Error);
    }

    // Create the property in the database
    try {
      const result = await xata.db.properties.create(propertyData);
      propertyLogger.info(`Successfully imported property: ${title}`);
      return result;
    } catch (error) {
      propertyLogger.error('Database error while importing property:', error);
      throw new DatabaseError('Failed to create property in database', error as Error);
    }

  } catch (error) {
    // If it's already one of our custom errors, just rethrow it
    if (error instanceof ValidationError ||
        error instanceof DatabaseError ||
        error instanceof EmbeddingError) {
      throw error;
    }

    // Otherwise wrap it in a generic error
    propertyLogger.error('Error importing property:', error);
    throw new Error(`Failed to import property: ${(error as Error).message}`);
  }
};

// Process and import multiple property records
export const importSoldProperties = async (dataArray: UKSoldPropertyData[]) => {
  const batchLogger = logger.withContext('BatchImport');
  batchLogger.info(`Starting import of ${dataArray.length} properties`);

  const results = {
    total: dataArray.length,
    successful: 0,
    failed: 0,
    errors: [] as { index: number; error: string }[]
  };

  // Process in batches for better performance
  const batchSize = 50;
  for (let i = 0; i < dataArray.length; i += batchSize) {
    batchLogger.info(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(dataArray.length/batchSize)}`);

    const batch = dataArray.slice(i, i + batchSize);
    const batchPromises = batch.map((data, batchIndex) => {
      const index = i + batchIndex;
      return importSoldProperty(data)
        .then(() => ({ success: true, index }))
        .catch(error => ({
          success: false,
          index,
          error: error instanceof Error ? error.message : String(error)
        }));
    });

    const batchResults = await Promise.all(batchPromises);

    // Update results
    const successfulInBatch = batchResults.filter(r => r.success).length;
    const failedInBatch = batchResults.filter(r => !r.success).length;

    results.successful += successfulInBatch;
    results.failed += failedInBatch;

    // Add errors
    batchResults
      .filter((r): r is { success: false; index: number; error: string } => !r.success)
      .forEach(r => {
        results.errors.push({
          index: r.index,
          error: r.error || 'Unknown error'
        });
      });

    batchLogger.info(`Batch completed: ${successfulInBatch} successful, ${failedInBatch} failed`);
  }

  batchLogger.info(`Import completed: ${results.successful} successful, ${results.failed} failed`);
  return results;
};

// Parse CSV data into property records
export const parseCSV = (csvText: string): UKSoldPropertyData[] => {
  const csvLogger = logger.withContext('CSVParser');

  try {
    // Use PapaParse for more robust CSV parsing
    const parseResult = parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, field) => {
        // Check for null or undefined first
        if (value === null || value === undefined) {
          return null;
        }

        // Ensure value is treated as string for initial checks
        const strValue = String(value);

        // Convert numeric fields
        if (['price', 'bedrooms', 'bathrooms', 'squareFeet'].includes(field as string)) {
          if (strValue === '') {
            return null;
          }
          const num = Number(strValue);
          return isNaN(num) ? null : num;
        }
        // Return empty strings as null for string fields
        return strValue === '' ? null : strValue;
      }
    });

    if (parseResult.errors && parseResult.errors.length > 0) {
      csvLogger.warn('CSV parsing had errors:', parseResult.errors);
    }

    csvLogger.info(`Successfully parsed ${parseResult.data.length} records from CSV`);
    return parseResult.data as UKSoldPropertyData[];
  } catch (error) {
    csvLogger.error('Failed to parse CSV:', error);
    throw new CSVParsingError('Failed to parse CSV data', error as Error);
  }
};