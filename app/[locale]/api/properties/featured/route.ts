// app/api/properties/featured/route.ts
import { NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';

export async function GET() {
  try {
    const xata = getXataClient();

    // Fetch properties to be used as featured properties
    // Since 'featured' is not in the Xata schema, we'll get the most recent properties instead
    const featuredProperties = await xata.db.properties
      .sort('xata_createdat', 'desc')
      .select([
        'id',
        'title',
        'description',
        'price',
        'location',
        'imageUrl',
        'bedrooms',
        'bathrooms',
        'squareFeet',
        'propertyType',
        'status',
        'xata_createdat', // Use xata_createdat instead of createdAt
        'listingAgent'
      ])
      .getMany();

    // Limit to 6 properties for the featured section
    const limitedProperties = featuredProperties.slice(0, 6);

    // Map the properties to include the featured field for the frontend
    const mappedProperties = limitedProperties.map(property => ({
      ...property,
      featured: true, // Add the featured field for frontend compatibility
      createdAt: property.xata_createdat // Map xata_createdat to createdAt for frontend compatibility
    }));

    return NextResponse.json(mappedProperties);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}