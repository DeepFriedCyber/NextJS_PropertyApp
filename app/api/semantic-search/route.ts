// app/api/semantic-search/route.ts
import { NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';
import { getEmbedding } from '@/lib/embedding';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const embedding = await getEmbedding(question);
    const xata = getXataClient();

    const results = await xata.db.properties.vectorSearch('embedding', embedding, {
      size: 5
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Semantic search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
