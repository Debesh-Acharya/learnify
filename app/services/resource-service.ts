import { searchYouTubeVideos } from './youtube-service';
import { searchRedditPosts } from './reddit-service';

export interface Resource {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
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
    console.log("Searching all resources for query:", query);
    
    // Fetch resources from YouTube and Reddit in parallel
    const [youtubeResults, redditResults] = await Promise.allSettled([
      searchYouTubeVideos(query),
      searchRedditPosts(query)
    ]);
    
    // Handle results, even if one API fails
    const allResults: Resource[] = [
      ...(youtubeResults.status === 'fulfilled' ? youtubeResults.value : []),
      ...(redditResults.status === 'fulfilled' ? redditResults.value : [])
    ];
    
    console.log("Total combined results:", allResults.length);
    return allResults;
  } catch (error: unknown) {
    console.error("Error searching resources:", error instanceof Error ? error.message : String(error));
    return [];
  }
}
