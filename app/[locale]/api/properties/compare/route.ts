import { NextResponse } from 'next/server';

const testProperties = [
  {
    id: '1',
    title: 'Test Property 1',
    price: 500000,
    location: 'London',
    bedrooms: 2,
    bathrooms: 1,
    image_url: '/placeholder.jpg'
  },
  {
    id: '2',
    title: 'Test Property 2',
    price: 300000,
    location: 'Manchester',
    bedrooms: 3,
    bathrooms: 2,
    image_url: '/placeholder.jpg'
  }
];

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    
    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request: ids must be an array' },
        { status: 400 }
      );
    }

    const properties = testProperties.filter(property => ids.includes(property.id));
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error in properties/compare API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties for comparison' },
      { status: 500 }
    );
  }
} 