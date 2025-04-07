import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { geocodeAddress, getNearbyProperties } from '@/lib/maps';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const testProperties = [
  {
    id: '1',
    title: 'Test Property 1',
    location: 'London',
    price: 500000,
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    propertyAge: 'New Build',
    gardenSize: 0,
    parkingSpaces: 1,
    latitude: 51.5074,
    longitude: -0.1278,
    epcRating: 'B',
    councilTaxBand: 'D',
    description: 'A beautiful apartment in central London',
  },
  {
    id: '2',
    title: 'Test Property 2',
    location: 'Manchester',
    price: 300000,
    propertyType: 'House',
    bedrooms: 3,
    bathrooms: 2,
    propertyAge: 'Period property',
    gardenSize: 100,
    parkingSpaces: 2,
    latitude: 53.4808,
    longitude: -2.2426,
    epcRating: 'C',
    councilTaxBand: 'C',
    description: 'A spacious family home in Manchester',
  },
];

export async function POST(request: Request) {
  try {
    // In a real app, we would use the request body to filter properties
    // const body = await request.json();
    
    return NextResponse.json({
      properties: testProperties,
    });
  } catch (error) {
    console.error('Error in properties/location API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
} 