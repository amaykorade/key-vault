import { createClient } from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: true // for compatibility with rate-limiter-flexible
});
redisClient.connect().catch(console.error);

// Configure rate limiters
const anonymousLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'anon',
  points: 50, // 50 requests
  duration: 900, // per 15 minutes
});

const userLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'user',
  points: 1000, // 1000 requests
  duration: 900, // per 15 minutes
});

// Admins: unlimited (no limiter)

/**
 * Role/identity-based rate limiting.
 * @param {object|null} user - User object (must have .id and .role if present)
 * @param {string} ip - IP address (for anonymous users)
 */
export async function checkUserRateLimit(user, ip) {
  let key, limiter;
  if (!user) {
    // Anonymous
    key = ip;
    limiter = anonymousLimiter;
  } else if (user.role === 'ADMIN') {
    // Admin: unlimited
    return { allowed: true };
  } else {
    // Authenticated user
    key = user.id;
    limiter = userLimiter;
  }
  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (rejRes) {
    return {
      allowed: false,
      retryAfter: Math.round(rejRes.msBeforeNext / 1000),
      message: 'Too many requests, please try again later.'
    };
  }
} 