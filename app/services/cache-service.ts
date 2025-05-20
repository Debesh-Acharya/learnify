// app/services/cache-service.ts
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheItem<unknown>> = {};

export function getCachedData<T>(key: string): T | null {
  const item = cache[key] as CacheItem<T> | undefined;
  if (!item) return null;
  
  const now = Date.now();
  if (now - item.timestamp > CACHE_DURATION) {
    // Cache expired
    delete cache[key];
    return null;
  }
  
  return item.data;
}

export function setCachedData<T>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now()
  } as CacheItem<unknown>;
}
