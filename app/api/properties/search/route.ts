import { NextResponse } from 'next/server';
import { getXataClient } from '@/lib/xata';
import { getEmbedding } from '@/lib/embedding';
import type { PropertiesRecord } from '@/lib/xata';

export async function POST(req: Request) {
  try {
    const { query, mode, filters } = await req.json();
    const xata = getXataClient();
    
    let results: PropertiesRecord[];
    
    if (mode === 'semantic' && query) {
      // Get embedding for semantic search
      const embedding = await getEmbedding(query);
      
      // Perform vector search
      const searchResults = await xata.db.properties.vectorSearch('embedding', embedding, {
        size: 20,
        filter: buildFilterExpression(filters)
      });
      
      results = searchResults.records;
    } else {
      // Handle filter-based search
      const filterExpression = buildFilterExpression(filters);
      
      results = await xata.db.properties
        .filter(filterExpression)
        .sort('xata.createdAt', 'desc') // Fixed: Using correct system column name
        .getMany({
          pagination: { size: 20 }
        });
    }

    return NextResponse.json({ 
      results,
      total: results.length,
      mode 
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' }, 
      { status: 500 }
    );
  }
}

function buildFilterExpression(filters: any) {
  const expressions: any[] = [];

  if (filters.location) {
    expressions.push({
      location: { $contains: filters.location }
    });
  }

  if (filters.priceMin) {
    expressions.push({
      price: { $ge: filters.priceMin }
    });
  }

  if (filters.priceMax) {
    expressions.push({
      price: { $le: filters.priceMax }
    });
  }

  if (filters.propertyType) {
    expressions.push({
      propertyType: filters.propertyType
    });
  }

  if (filters.bedrooms) {
    expressions.push({
      bedrooms: { $ge: filters.bedrooms }
    });
  }

  return expressions.length > 0 
    ? { $all: expressions }
    : {};
}


