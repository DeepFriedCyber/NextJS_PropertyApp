import { getXataClient } from "@/lib/xata";
import { PropertyType, TenureType, PropertyStatus } from "@/types/uk-property";
import { getEmbedding } from "@/lib/embedding";
import Papa from 'papaparse';
import xlsx from 'xlsx';

// Interface for flexible property data
export interface FlexiblePropertyData {
  [key: string]: any;
}

// Common field mappings for different formats
export interface FieldMapping {
  title?: string;
  address?: string;
  postcode?: string;
  price?: string;
  description?: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  tenure?: string;
  status?: string;
  location?: string;
  features?: string;
  imageUrl?: string;
  listingAgent?: string;
  town?: string;
  county?: string;
  saleDate?: string;
}

// Standard field names in our system
const standardFields = [
  'title',
  'address',
  'postcode',
  'price',
  'description',
  'propertyType',
  'bedrooms',
  'bathrooms',
  'squareFeet',
  'tenure',
  'status',
  'location',
  'features',
  'imageUrl',
  'listingAgent',
];

// Common property type mappings
const propertyTypeMap: Record<string, PropertyType> = {
  'detached': 'detached',
  'semi-detached': 'semi-detached',
  'semi': 'semi-detached',
  'terraced': 'terraced',
  'terrace': 'terraced',
  'flat': 'flat',
  'apartment': 'flat',
  'bungalow': 'bungalow',
  'cottage': 'cottage',
  'maisonette': 'maisonette',
  'commercial': 'commercial',
  'house': 'detached',
  'property': 'detached',
  'det': 'detached',
  'semi det': 'semi-detached',
  'end terrace': 'terraced',
  'mid terrace': 'terraced',
  'end of terrace': 'terraced',
  'mid-terrace': 'terraced',
  'end-terrace': 'terraced',
  'studio': 'flat',
  'studio flat': 'flat',
  'duplex': 'maisonette',
  'penthouse': 'flat',
};

// Common tenure mappings
const tenureMap: Record<string, TenureType> = {
  'freehold': 'freehold',
  'leasehold': 'leasehold',
  'share of freehold': 'share-of-freehold',
  'share-of-freehold': 'share-of-freehold',
  'shared freehold': 'share-of-freehold',
  'f/h': 'freehold',
  'l/h': 'leasehold',
  's/f': 'share-of-freehold',
};

// Common status mappings
const statusMap: Record<string, PropertyStatus> = {
  'for sale': 'for-sale',
  'for-sale': 'for-sale',
  'for rent': 'for-rent',
  'for-rent': 'for-rent',
  'to let': 'for-rent',
  'to-let': 'for-rent',
  'under offer': 'under-offer',
  'under-offer': 'under-offer',
  'sold': 'sold',
  'sold stc': 'sold',
  'sold subject to contract': 'sold',
  'let': 'let-agreed',
  'let agreed': 'let-agreed',
  'let-agreed': 'let-agreed',
  'rented': 'let-agreed',
};

// Auto-detect field mappings based on headers
export function detectFieldMappings(headers: string[]): FieldMapping {
  const mapping: FieldMapping = {};
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

  // Map for common alternative field names
  const fieldAlternatives: Record<string, string[]> = {
    'title': ['title', 'property title', 'property name', 'listing title', 'name'],
    'address': ['address', 'property address', 'street address', 'full address', 'addr'],
    'postcode': ['postcode', 'post code', 'postal code', 'zip', 'zip code'],
    'price': ['price', 'asking price', 'listing price', 'sale price', 'value', 'amount'],
    'description': ['description', 'property description', 'details', 'full description', 'desc'],
    'propertyType': ['property type', 'propertytype', 'type', 'building type', 'house type'],
    'bedrooms': ['bedrooms', 'beds', 'bed', 'number of bedrooms', 'bedroom count', 'bedroom'],
    'bathrooms': ['bathrooms', 'baths', 'bath', 'number of bathrooms', 'bathroom count', 'bathroom'],
    'squareFeet': ['square feet', 'squarefeet', 'sq ft', 'sqft', 'square footage', 'area', 'size'],
    'tenure': ['tenure', 'ownership type', 'ownership'],
    'status': ['status', 'listing status', 'property status', 'sale status'],
    'location': ['location', 'area', 'neighborhood', 'district', 'locality'],
    'features': ['features', 'property features', 'amenities', 'key features'],
    'imageUrl': ['image url', 'imageurl', 'image', 'photo url', 'picture', 'main image', 'primary image'],
    'listingAgent': ['listing agent', 'agent', 'estate agent', 'realtor', 'agent name'],
    'town': ['town', 'city', 'village'],
    'county': ['county', 'region', 'state', 'province'],
    'saleDate': ['sale date', 'sold date', 'date of sale', 'completion date', 'transaction date'],
  };

  // Try to match each standard field with headers
  Object.entries(fieldAlternatives).forEach(([standardField, alternatives]) => {
    // Find the first matching alternative in the headers
    const matchIndex = normalizedHeaders.findIndex(header =>
      alternatives.includes(header) ||
      alternatives.some(alt => header.includes(alt))
    );

    if (matchIndex !== -1) {
      // Use type assertion to tell TypeScript that standardField is a key of FieldMapping
      mapping[standardField as keyof FieldMapping] = headers[matchIndex];
    }
  });

  return mapping;
}

// Parse CSV data with flexible column mappings
export function parseCSV(csvText: string): { data: FlexiblePropertyData[], mapping: FieldMapping } {
  // Parse CSV using PapaParse
  const parseResult = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });
  
  if (parseResult.errors.length > 0) {
    console.warn('CSV parsing warnings:', parseResult.errors);
  }
  
  const headers = parseResult.meta.fields || [];
  const mapping = detectFieldMappings(headers);
  
  return {
    data: parseResult.data as FlexiblePropertyData[],
    mapping
  };
}

// Parse Excel data with flexible column mappings
export function parseExcel(buffer: ArrayBuffer): { data: FlexiblePropertyData[], mapping: FieldMapping } {
  // Parse Excel using xlsx
  const workbook = xlsx.read(buffer, { type: 'array' });

  // Check if the workbook has any sheets
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Excel file does not contain any sheets');
  }

  const firstSheetName = workbook.SheetNames[0];
  // Ensure firstSheetName is not undefined before using it as an index
  if (!firstSheetName) {
    throw new Error('Could not determine the first sheet name');
  }

  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error(`Could not find worksheet named "${firstSheetName}"`);
  }

  // Convert to JSON
  const data = xlsx.utils.sheet_to_json(worksheet) as FlexiblePropertyData[];

  // Check if we have any data
  if (!data || data.length === 0) {
    throw new Error('No data found in the Excel file');
  }

  // Get headers from the first row
  const headers = Object.keys(data[0] || {});
  const mapping = detectFieldMappings(headers);

  return { data, mapping };
}

// Clean and normalize property data
export function normalizePropertyData(
  rawData: FlexiblePropertyData,
  mapping: FieldMapping
): FlexiblePropertyData {
  const normalized: FlexiblePropertyData = {};
  
  // Helper function to get value using mapping
  const getValue = (field: keyof FieldMapping): any => {
    const mappedField = mapping[field];
    return mappedField ? rawData[mappedField] : undefined;
  };
  
  // Process standard fields
  normalized.title = getValue('title') || '';
  normalized.address = getValue('address') || '';
  normalized.postcode = getValue('postcode') || '';
  normalized.description = getValue('description') || '';
  
  // Process price - handle currency symbols and commas
  const rawPrice = getValue('price');
  if (rawPrice) {
    const priceString = String(rawPrice).replace(/[£$€,]/g, '').trim();
    normalized.price = parseFloat(priceString) || 0;
  } else {
    normalized.price = 0;
  }
  
  // Process numeric fields
  const rawBedrooms = getValue('bedrooms');
  normalized.bedrooms = rawBedrooms ? parseInt(String(rawBedrooms)) || 0 : 0;
  
  const rawBathrooms = getValue('bathrooms');
  normalized.bathrooms = rawBathrooms ? parseInt(String(rawBathrooms)) || 0 : 0;
  
  const rawSquareFeet = getValue('squareFeet');
  normalized.squareFeet = rawSquareFeet ? parseInt(String(rawSquareFeet)) || 0 : 0;
  
  // Process property type
  const rawPropertyType = getValue('propertyType');
  if (rawPropertyType) {
    const typeKey = String(rawPropertyType).toLowerCase().trim();
    normalized.propertyType = propertyTypeMap[typeKey] || 'detached';
  } else {
    normalized.propertyType = 'detached';
  }
  
  // Process tenure
  const rawTenure = getValue('tenure');
  if (rawTenure) {
    const tenureKey = String(rawTenure).toLowerCase().trim();
    normalized.tenure = tenureMap[tenureKey] || 'freehold';
  } else {
    normalized.tenure = 'freehold';
  }
  
  // Process status
  const rawStatus = getValue('status');
  if (rawStatus) {
    const statusKey = String(rawStatus).toLowerCase().trim();
    normalized.status = statusMap[statusKey] || 'for-sale';
  } else {
    normalized.status = 'for-sale';
  }
  
  // Process location
  normalized.location = getValue('location') || getValue('town') || getValue('postcode') || '';
  
  // Process features
  const rawFeatures = getValue('features');
  if (rawFeatures) {
    if (Array.isArray(rawFeatures)) {
      normalized.features = rawFeatures;
    } else if (typeof rawFeatures === 'string') {
      // Split by commas or semicolons
      normalized.features = rawFeatures.split(/[,;]/).map(f => f.trim()).filter(Boolean);
    } else {
      normalized.features = [];
    }
  } else {
    normalized.features = [];
  }
  
  // Process image URL
  normalized.imageUrl = getValue('imageUrl') || null;
  
  // Process listing agent
  normalized.listingAgent = getValue('listingAgent') || 'Unknown Agent';
  
  return normalized;
}

// Generate a title if one isn't provided
export function generateTitle(data: FlexiblePropertyData): string {
  if (data.title) return data.title;
  
  const propertyType = typeof data.propertyType === 'string' 
    ? data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1) 
    : 'Property';
  
  const bedrooms = data.bedrooms ? `${data.bedrooms} bedroom ` : '';
  const location = data.location || data.postcode || data.address?.split(',')[0] || 'Unknown location';
  
  return `${bedrooms}${propertyType} in ${location}`;
}

// Generate a description if one isn't provided
export function generateDescription(data: FlexiblePropertyData): string {
  if (data.description) return data.description;
  
  const propertyType = typeof data.propertyType === 'string'
    ? data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)
    : 'property';
  
  const bedrooms = data.bedrooms ? `${data.bedrooms} bedroom` : '';
  const bathrooms = data.bathrooms ? `${data.bathrooms} bathroom` : '';
  const size = data.squareFeet ? `${data.squareFeet} sq ft` : '';
  
  let description = `This ${bedrooms} ${propertyType}`;
  
  if (bathrooms) {
    description += ` with ${bathrooms}`;
  }
  
  if (size) {
    description += ` offers approximately ${size} of living space`;
  }
  
  description += `. Located in ${data.location || data.postcode || 'a desirable area'}`;
  
  if (data.tenure) {
    description += `, this ${data.tenure} property`;
  } else {
    description += `, this property`;
  }
  
  if (data.status === 'for-sale') {
    description += ` is available for purchase at £${data.price?.toLocaleString()}.`;
  } else if (data.status === 'for-rent') {
    description += ` is available to rent at £${data.price?.toLocaleString()} per month.`;
  } else if (data.status === 'sold') {
    description += ` was sold for £${data.price?.toLocaleString()}.`;
  } else {
    description += ` is listed at £${data.price?.toLocaleString()}.`;
  }
  
  return description;
}

// Process and import a single property
export async function importProperty(data: FlexiblePropertyData): Promise<any> {
  const xata = getXataClient();
  
  try {
    // Ensure required fields
    const processedData: FlexiblePropertyData = {
      ...data,
      title: data.title || generateTitle(data),
      description: data.description || generateDescription(data),
    };

    // Generate embedding for semantic search
    try {
      const embeddingText = `${processedData.title} ${processedData.description} ${processedData.propertyType} ${processedData.location} ${processedData.price}`;
      const embedding = await getEmbedding(embeddingText);

      if (embedding) {
        processedData.embedding = embedding;
      }
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Continue without embedding if there's an error
    }
    
    // Create the property in the database
    const result = await xata.db.properties.create(processedData);
    return result;
    
  } catch (error) {
    console.error('Error importing property:', error);
    throw error;
  }
}

// Process and import multiple properties
export async function importProperties(dataArray: FlexiblePropertyData[]): Promise<any> {
  const results = {
    total: dataArray.length,
    successful: 0,
    failed: 0,
    errors: [] as { index: number; error: string }[]
  };
  
  for (let i = 0; i < dataArray.length; i++) {
    const propertyData = dataArray[i];
    // Skip undefined items
    if (!propertyData) {
      results.failed++;
      results.errors.push({
        index: i,
        error: "Property data is undefined"
      });
      continue;
    }

    try {
      await importProperty(propertyData);
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        index: i,
        error: (error as Error).message
      });
    }
  }
  
  return results;
}

// Process file data based on file type
export async function processFileData(
  file: File
): Promise<{ data: FlexiblePropertyData[], mapping: FieldMapping }> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === 'csv') {
    const text = await file.text();
    return parseCSV(text);
  } else if (fileType === 'xlsx' || fileType === 'xls') {
    const buffer = await file.arrayBuffer();
    return parseExcel(buffer);
  } else {
    throw new Error(`Unsupported file type: ${fileType}. Please upload a CSV or Excel file.`);
  }
}