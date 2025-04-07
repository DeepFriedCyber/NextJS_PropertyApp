import { NextRequest, NextResponse } from 'next/server';
import { importSoldProperties } from '@/utils/propertyDataImport';

// Function to fetch data from Land Registry API
async function fetchLandRegistryData(postcode: string, limit: number = 10) {
  try {
    // Encode the postcode for URL
    const encodedPostcode = encodeURIComponent(postcode);

    // Fetch data from Land Registry API
    const response = await fetch(
      `http://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=${encodedPostcode}&_limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        // Use next.js cache: 'no-store' to avoid caching issues
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Land Registry API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // The API might return data in different formats, handle both possibilities
    const result = data.result || data.items || [];

    if (!result || result.length === 0) {
      throw new Error('No properties found for this postcode');
    }

    return result;
  } catch (error) {
    console.error('Error fetching Land Registry data:', error);
    throw error;
  }
}

// Function to transform Land Registry data to our format
function transformLandRegistryData(data: any[]) {
  return data.map(item => {
    // Extract the property address - handle different API response formats
    let address: any = {};
    if (item.propertyAddress) {
      // Direct property address
      address = item.propertyAddress;
    } else if (item['propertyAddress.postcode']) {
      // Flattened property address
      address = {
        postcode: item['propertyAddress.postcode'],
        saon: item['propertyAddress.saon'],
        paon: item['propertyAddress.paon'],
        street: item['propertyAddress.street'],
        locality: item['propertyAddress.locality'],
        town: item['propertyAddress.town'],
        district: item['propertyAddress.district'],
        county: item['propertyAddress.county']
      };
    }

    // Extract transaction details
    const transaction = item.hasTransaction || {};

    // Map property type
    let propertyType = 'detached'; // Default
    if (item.propertyType) {
      const typeStr = item.propertyType.toString().toLowerCase();
      if (typeStr.includes('flat') || typeStr.includes('maisonette')) {
        propertyType = 'flat';
      } else if (typeStr.includes('terraced')) {
        propertyType = 'terraced';
      } else if (typeStr.includes('semi')) {
        propertyType = 'semi-detached';
      } else if (typeStr.includes('detached')) {
        propertyType = 'detached';
      }
    }

    // Map tenure type
    let tenure = 'freehold'; // Default
    if (item.estateType) {
      const estateTypeStr = item.estateType.toString().toLowerCase();
      if (estateTypeStr.includes('leasehold')) {
        tenure = 'leasehold';
      }
    }

    // Format the address components, handling both string and object values
    const getAddressComponent = (component: any): string => {
      if (!component) return '';
      if (typeof component === 'string') return component;
      if (component.value) return component.value;
      return component.toString();
    };

    // Format the address
    const addressComponents = [
      getAddressComponent(address.saon),
      getAddressComponent(address.paon),
      getAddressComponent(address.street),
      getAddressComponent(address.locality),
      getAddressComponent(address.town),
      getAddressComponent(address.district),
      getAddressComponent(address.county)
    ].filter(Boolean);

    const formattedAddress = addressComponents.join(', ');

    // Format the location
    const location = [
      getAddressComponent(address.town),
      getAddressComponent(address.district),
      getAddressComponent(address.county)
    ].filter(Boolean).join(', ');

    // Get the transaction date
    let transactionDate = new Date().toISOString().split('T')[0]; // Default to today
    if (item.transactionDate) {
      if (typeof item.transactionDate === 'string') {
        transactionDate = item.transactionDate;
      } else if (item.transactionDate.value) {
        transactionDate = item.transactionDate.value;
      }
    }

    // Get the price
    let price = 0;
    if (item.pricePaid) {
      if (typeof item.pricePaid === 'number') {
        price = item.pricePaid;
      } else if (typeof item.pricePaid === 'string') {
        price = parseInt(item.pricePaid, 10) || 0;
      } else if (item.pricePaid.value) {
        price = parseInt(item.pricePaid.value, 10) || 0;
      }
    }

    // Get the postcode
    let postcode = '';
    if (address.postcode) {
      if (typeof address.postcode === 'string') {
        postcode = address.postcode;
      } else if (address.postcode.value) {
        postcode = address.postcode.value;
      }
    }

    // Generate a title for the property
    const propertyTitle = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} property in ${getAddressComponent(address.town) || getAddressComponent(address.district) || postcode}`;

    return {
      title: propertyTitle,
      address: formattedAddress,
      postcode: postcode,
      price: price,
      saleDate: transactionDate,
      propertyType: propertyType,
      tenure: tenure,
      bedrooms: Math.floor(Math.random() * 4) + 1, // Random 1-5 bedrooms (not in Land Registry data)
      bathrooms: Math.floor(Math.random() * 2) + 1, // Random 1-3 bathrooms (not in Land Registry data)
      squareFeet: Math.floor(Math.random() * 1000) + 500, // Random square feet (not in Land Registry data)
      description: `This ${propertyType} property was sold for £${price.toLocaleString()} on ${transactionDate ? new Date(transactionDate).toLocaleDateString() : 'unknown date'}. Located in ${location || postcode}, this is a great example of local property values.`,
      location: location || postcode,
      town: getAddressComponent(address.town) || '',
      district: getAddressComponent(address.district) || '',
      county: getAddressComponent(address.county) || '',
      status: 'sold' // Ensure status is set to sold
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postcode = searchParams.get('postcode');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode is required' },
        { status: 400 }
      );
    }
    
    // Fetch data from Land Registry
    const landRegistryData = await fetchLandRegistryData(postcode, limit);
    
    // Transform data to our format
    const transformedData = transformLandRegistryData(landRegistryData);
    
    return NextResponse.json({ properties: transformedData });
  } catch (error) {
    console.error('Error in Land Registry API route:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { properties } = body;
    
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json(
        { error: 'No properties provided for import' },
        { status: 400 }
      );
    }
    
    // Import the properties
    const results = await importSoldProperties(properties);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error importing Land Registry properties:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}