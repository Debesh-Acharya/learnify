// app/services/resource-service.ts
import { searchYouTubeVideos } from './youtube-service';
import { searchRedditPosts } from './reddit-service';

export interface Resource {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
  // isPaid property removed
  thumbnailUrl: string;
  url: string;
  ratings: {
    average: number;
    count: number;
  };
  dateIndexed: string;
}


export async function searchAllResources(query: string): Promise<Resource[]> {
  try {
    // Fetch resources from YouTube and Reddit in parallel
    const [youtubeResults, redditResults] = await Promise.all([
      searchYouTubeVideos(query),
      searchRedditPosts(query)
    ]);
    
    // Combine all results
    const allResults = [
      ...youtubeResults,
      ...redditResults
    ];
    
    return allResults;
  } catch (error) {
    console.error("Error searching resources:", error);
    return [];
  }
}
// Add these functions to your resource-service.ts file

export function filterResources(
  resources: Resource[], 
  filters: {
    types?: string[];
    platforms?: string[];
    isPaid?: boolean | null;
  }
): Resource[] {
  return resources.filter(resource => {
    // Filter by type
    if (filters.types && filters.types.length > 0 && !filters.types.includes(resource.type)) {
      return false;
    }
    
    // Filter by platform
    if (filters.platforms && filters.platforms.length > 0 && !filters.platforms.includes(resource.platform)) {
      return false;
    }
    
    
    return true;
  });
}

export function sortResources(
  resources: Resource[],
  sortBy: 'relevance' | 'newest' | 'rating' = 'relevance'
): Resource[] {
  const sortedResources = [...resources];
  
  switch (sortBy) {
    case 'newest':
      return sortedResources.sort((a, b) => 
        new Date(b.dateIndexed).getTime() - new Date(a.dateIndexed).getTime()
      );
    case 'rating':
      return sortedResources.sort((a, b) => 
        b.ratings.average - a.ratings.average || b.ratings.count - a.ratings.count
      );
    case 'relevance':
    default:
      return sortedResources;
  }
}

