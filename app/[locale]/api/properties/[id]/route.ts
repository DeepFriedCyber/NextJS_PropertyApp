import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// GET /api/properties/[id] - Get a property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const xata = getXataClient();
    const property = await xata.db.properties.read(params.id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update a property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    if (!body.price) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }
    
    if (!body.location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }
    
    if (!body.propertyType) {
      return NextResponse.json({ error: 'Property type is required' }, { status: 400 });
    }
    
    if (!body.tenure) {
      return NextResponse.json({ error: 'Tenure is required' }, { status: 400 });
    }
    
    if (!body.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    
    // Update property
    const xata = getXataClient();
    const property = await xata.db.properties.update(id, body);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }
    
    const xata = getXataClient();
    await xata.db.properties.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}