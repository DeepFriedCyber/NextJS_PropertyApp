import { NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';

export async function GET() {
  try {
    const xata = getXataClient();
    const data = await xata.db.properties.getMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
