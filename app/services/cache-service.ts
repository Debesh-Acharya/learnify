// app/services/cache-service.ts
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheItem> = {};

export function getCachedData(key: string) {
  const item = cache[key];
  if (!item) return null;
  
  const now = Date.now();
  if (now - item.timestamp > CACHE_DURATION) {
    // Cache expired
    delete cache[key];
    return null;
  }
  
  return item.data;
}

export function setCachedData(key: string, data: any) {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
}
