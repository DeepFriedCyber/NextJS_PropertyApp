import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const xata = getXataClient();
    
    const { records, meta } = await xata.db.properties
      .sort('xata.createdAt', 'desc')
      .getPaginated({
        pagination: {
          size: limit,
          after: cursor || undefined,
        },
      });

    return NextResponse.json({
      properties: records,
      meta: {
        cursor: meta.cursor,
        remaining: meta.remaining,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
