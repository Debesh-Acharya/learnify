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

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  url: string;
  permalink: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  thumbnail: string;
}

interface RedditResponse {
  data: {
    children: {
      data: RedditPost;
    }[];
  };
}

export async function searchRedditPosts(query: string, maxResults: number = 10): Promise<Resource[]> {
  try {
    // Using api.reddit.com instead of www.reddit.com to avoid CORS issues
    const url = `https://api.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=${maxResults}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Learnify/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API responded with status: ${response.status}`);
    }
    
    const data: RedditResponse = await response.json();
    
    // Transform Reddit response to match our Resource model
    return data.data.children.map(item => {
      const post = item.data;
      
      return {
        id: post.id,
        title: post.title,
        description: post.selftext.substring(0, 200) + (post.selftext.length > 200 ? '...' : ''),
        platform: "Reddit",
        type: "article",
        thumbnailUrl: post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' 
          ? post.thumbnail 
          : 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
        url: `https://www.reddit.com${post.permalink}`,
        ratings: { 
          average: post.score > 0 ? 5 : 3, // Convert score to a rating
          count: post.num_comments 
        },
        dateIndexed: new Date(post.created_utc * 1000).toISOString() // Convert Date to ISO string
      };
    });
  } catch (error: unknown) {
    console.error("Error fetching Reddit posts:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

// List of educational subreddits
const educationalSubreddits = [
  'learnprogramming',
  'education',
  'science',
  'history',
  'math',
  'philosophy',
  'AskHistorians',
  'askscience',
  'explainlikeimfive'
];

// Function to get the list of educational subreddits
export function getEducationalSubreddits(): string[] {
  return educationalSubreddits;
}

// Optional: Function to fetch posts from specific educational subreddits
export async function fetchEducationalSubreddits(topic: string, maxResults: number = 10): Promise<Resource[]> {
  try {
    // Choose a relevant subreddit based on the topic or use a default one
    const subreddit = 'learnprogramming'; // You could implement logic to choose based on topic
    
    // Using api.reddit.com instead of www.reddit.com to avoid CORS issues
    const url = `https://api.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(topic)}&sort=top&limit=${maxResults}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Learnify/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API responded with status: ${response.status}`);
    }
    
    const data: RedditResponse = await response.json();
    
    return data.data.children.map(item => {
      const post = item.data;
      
      return {
        id: post.id,
        title: post.title,
        description: post.selftext.substring(0, 200) + (post.selftext.length > 200 ? '...' : ''),
        platform: "Reddit",
        type: "article",
        thumbnailUrl: post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' 
          ? post.thumbnail 
          : 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
        url: `https://www.reddit.com${post.permalink}`,
        ratings: { 
          average: post.score > 0 ? 5 : 3,
          count: post.num_comments 
        },
        dateIndexed: new Date(post.created_utc * 1000).toISOString() // Convert Date to ISO string
      };
    });
  } catch (error: unknown) {
    console.error("Error fetching subreddit posts:", error instanceof Error ? error.message : String(error));
    return [];
  }
}
