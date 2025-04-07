import { NextRequest, NextResponse } from 'next/server';
import { importSoldProperties, parseCSV } from '@/utils/propertyDataImport';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.properties || !Array.isArray(body.properties)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected an array of properties.' },
        { status: 400 }
      );
    }
    
    // Import the properties
    const results = await importSoldProperties(body.properties);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error importing properties:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle CSV file upload
export async function PUT(request: NextRequest) {
  try {
    // Get the CSV text from the request
    const csvText = await request.text();
    
    if (!csvText) {
      return NextResponse.json(
        { error: 'No CSV data provided.' },
        { status: 400 }
      );
    }
    
    // Parse the CSV
    const properties = parseCSV(csvText);
    
    if (properties.length === 0) {
      return NextResponse.json(
        { error: 'No valid properties found in the CSV.' },
        { status: 400 }
      );
    }
    
    // Import the properties
    const results = await importSoldProperties(properties);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error importing properties from CSV:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}