import { NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';

export async function GET() {
  try {
    const xata = getXataClient();
    const properties = await xata.db.properties.getMany();
    console.log('Test endpoint properties:', properties);
    return NextResponse.json({ count: properties.length, properties });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}