// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { searchAllResources } from '@/app/services/resource-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const types = searchParams.getAll('type');
  const platforms = searchParams.getAll('platform');
  const sortBy = searchParams.get('sortBy') as 'relevance' | 'newest' | 'rating' || 'relevance';
  
  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get all resources
    let results = await searchAllResources(query);
    
    // Log the initial results for debugging
    console.log(`Initial results: ${results.length} total, ` + 
      `YouTube: ${results.filter(r => r.platform === "YouTube").length}, ` +
      `Reddit: ${results.filter(r => r.platform === "Reddit").length}`);
    
    // Apply type filter if specified
    if (types.length > 0) {
      results = results.filter(resource => types.includes(resource.type));
    }
    
    // Apply platform filter if specified
    if (platforms.length > 0) {
      results = results.filter(resource => platforms.includes(resource.platform));
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      results = results.sort((a, b) => 
        new Date(b.dateIndexed).getTime() - new Date(a.dateIndexed).getTime()
      );
    } else if (sortBy === 'rating') {
      results = results.sort((a, b) => 
        b.ratings.average - a.ratings.average || b.ratings.count - a.ratings.count
      );
    }
    
    // Log the filtered results for debugging
    console.log(`After filtering: ${results.length} total, ` + 
      `YouTube: ${results.filter(r => r.platform === "YouTube").length}, ` +
      `Reddit: ${results.filter(r => r.platform === "Reddit").length}`);

    return NextResponse.json({ 
      results,
      meta: {
        total: results.length,
        sources: {
          YouTube: results.filter(r => r.platform === "YouTube").length,
          Reddit: results.filter(r => r.platform === "Reddit").length
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
