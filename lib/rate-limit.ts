import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback map for local development only
const memoryStore = new Map<string, { count: number; resetTime: number }>();

const isProduction = process.env.NODE_ENV === "production";
const hasUpstashConfig =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

let upstashRatelimit: Ratelimit | null = null;

if (hasUpstashConfig) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // 5 requests per 1 hour sliding window
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "ratelimit:contact",
    });
  } catch (error) {
    console.warn("Failed to initialize Upstash Redis client:", error);
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  // If Upstash is configured, use distributed Redis rate limiter
  if (upstashRatelimit) {
    const result = await upstashRatelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // In production, warn if Upstash is missing
  if (isProduction) {
    console.warn(
      "[Security Warning] UPSTASH credentials missing in production environment. Falling back to local memory limiter."
    );
  }

  // Fallback: In-memory window rate limiter (Development / Fallback)
  const now = Date.now();
  const windowDurationMs = 60 * 60 * 1000; // 1 hour
  const limit = isProduction ? 15 : 50;

  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    memoryStore.set(identifier, {
      count: 1,
      resetTime: now + windowDurationMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowDurationMs,
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  entry.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}
