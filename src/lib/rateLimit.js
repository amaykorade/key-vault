import { createClient } from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: true // for compatibility with rate-limiter-flexible
});
redisClient.connect().catch(console.error);

// Configure rate limiter (e.g., 100 requests per 15 minutes per IP)
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rlflx',
  points: 100, // Number of points
  duration: 900, // Per 15 minutes
});

/**
 * Middleware-like function to enforce rate limiting in API routes.
 * Throws an error if rate limit is exceeded.
 * @param {string} key - Unique key per user/IP (e.g., IP address or user ID)
 */
export async function checkRateLimit(key) {
  try {
    await rateLimiter.consume(key);
    // Allowed
    return { allowed: true };
  } catch (rejRes) {
    // Rate limit exceeded
    return {
      allowed: false,
      retryAfter: Math.round(rejRes.msBeforeNext / 1000),
      message: 'Too many requests, please try again later.'
    };
  }
} 