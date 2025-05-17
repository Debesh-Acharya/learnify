// app/services/rate-limiter.ts
const requestTimestamps: Record<string, number[]> = {};

export function canMakeRequest(endpoint: string, maxRequests: number, timeWindowMs: number): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps[endpoint] || [];
  
  // Filter out timestamps outside the time window
  const recentTimestamps = timestamps.filter(timestamp => now - timestamp < timeWindowMs);
  
  // Update the timestamps list
  requestTimestamps[endpoint] = recentTimestamps;
  
  // Check if we can make a new request
  if (recentTimestamps.length < maxRequests) {
    requestTimestamps[endpoint].push(now);
    return true;
  }
  
  return false;
}
