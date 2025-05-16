
interface YouTubeItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

export async function searchYouTubeVideos(query: string, maxResults: number = 10) {
  const API_KEY = process.env.YOUTUBE_API_KEY!;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return data.items.map((item: YouTubeItem) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      platform: "YouTube",
      type: "video",
      isPaid: false,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      ratings: { average: 0, count: 0 },
      dateIndexed: new Date()
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}
