// app/services/youtube-service.ts
import { getCachedData, setCachedData } from './cache-service';

interface YouTubeItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: {
        url: string;
      };
      default?: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

interface YouTubeVideoStatistics {
  viewCount?: string;
  likeCount?: string;
}

interface YouTubeVideoSnippet {
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    high?: {
      url: string;
    };
    default?: {
      url: string;
    };
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: YouTubeVideoSnippet;
  statistics?: YouTubeVideoStatistics;
}

// Define the Resource type
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

export async function searchYouTubeVideos(query: string, maxResults: number = 10): Promise<Resource[]> {
  // Create a cache key based on the query and maxResults
  const cacheKey = `youtube_search_${query}_${maxResults}`;
  
  // Check if we have cached results
  const cachedResults = getCachedData<Resource[]>(cacheKey);
  if (cachedResults) {
    console.log("Using cached YouTube results for:", query);
    return cachedResults;
  }
  
  const API_KEY = process.env.YOUTUBE_API_KEY!;
  
  // Use fields parameter to request only the data we need
  // This significantly reduces the response size and saves quota
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&fields=items(id/videoId,snippet(title,description,publishedAt,thumbnails/high/url,thumbnails/default/url))`;
  
  try {
    console.log("Fetching fresh YouTube data for:", query);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API error:", response.status, errorText);
      
      // If we hit quota limit, try to return empty results gracefully
      if (response.status === 403 && errorText.includes("quota")) {
        console.warn("YouTube API quota exceeded. Using empty results.");
        return [];
      }
      
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log("No YouTube results found for query:", query);
      return [];
    }
    
    // Transform the YouTube response to match our Resource model
    const results = data.items.map((item: YouTubeItem) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      platform: "YouTube",
      type: "video",
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || "",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      ratings: { average: 0, count: 0 },
      dateIndexed: item.snippet.publishedAt || new Date().toISOString()
    }));
    
    // Cache the results
    setCachedData(cacheKey, results);
    
    return results;
  } catch (error: unknown) {
    console.error("Error fetching YouTube videos:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

// Function to fetch multiple videos in a single request
export async function fetchYouTubeVideosById(videoIds: string[]): Promise<Resource[]> {
  if (videoIds.length === 0) return [];
  
  // Limit to 50 IDs per request as per API limits
  const batchSize = 50;
  const batches = [];
  
  for (let i = 0; i < videoIds.length; i += batchSize) {
    batches.push(videoIds.slice(i, i + batchSize));
  }
  
  const results: Resource[] = [];
  
  for (const batch of batches) {
    const cacheKey = `youtube_videos_${batch.join(',')}`;
    
    // Check cache first
    const cachedResults = getCachedData<Resource[]>(cacheKey);
    if (cachedResults) {
      results.push(...cachedResults);
      continue;
    }
    
    const API_KEY = process.env.YOUTUBE_API_KEY!;
    const ids = batch.join(',');
    
    // Only request the fields we need
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${API_KEY}&fields=items(id,snippet(title,description,publishedAt,thumbnails/high/url),statistics(viewCount,likeCount))`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`YouTube API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const batchResults = data.items.map((item: YouTubeVideoItem) => ({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          platform: "YouTube",
          type: "video",
          thumbnailUrl: item.snippet.thumbnails.high?.url || "",
          url: `https://www.youtube.com/watch?v=${item.id}`,
          ratings: { 
            average: 0, 
            count: parseInt(item.statistics?.viewCount || "0", 10)
          },
          dateIndexed: item.snippet.publishedAt
        }));
        
        setCachedData(cacheKey, batchResults);
        results.push(...batchResults);
      }
    } catch (error: unknown) {
      console.error("Error fetching YouTube videos batch:", error instanceof Error ? error.message : String(error));
    }
  }
  
  return results;
}
