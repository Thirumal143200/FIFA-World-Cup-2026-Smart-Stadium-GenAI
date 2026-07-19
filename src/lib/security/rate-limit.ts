// src/lib/security/rate-limit.ts
// Rate limiting using in-memory store (Upstash Redis when configured)

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RATE_LIMITS } from '@/lib/constants';
import { NextResponse, type NextRequest } from 'next/server';

type RateLimitWindow = `${number}${'s' | 'm' | 'h' | 'd'}`;

// In-memory rate limiter fallback when Upstash is not configured
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function isUpstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

let upstashLimiters: Record<string, Ratelimit> | null = null;

function getUpstashLimiters(): Record<string, Ratelimit> {
  if (upstashLimiters) return upstashLimiters;

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  upstashLimiters = {
    ai: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMITS.ai.requests, RATE_LIMITS.ai.window as RateLimitWindow),
      prefix: 'stadiumos:ai',
    }),
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMITS.api.requests, RATE_LIMITS.api.window as RateLimitWindow),
      prefix: 'stadiumos:api',
    }),
    auth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMITS.auth.requests, RATE_LIMITS.auth.window as RateLimitWindow),
      prefix: 'stadiumos:auth',
    }),
  };

  return upstashLimiters;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier and tier.
 */
export async function checkRateLimit(
  identifier: string,
  tier: 'ai' | 'api' | 'auth' = 'api'
): Promise<RateLimitResult> {
  if (isUpstashConfigured()) {
    try {
      return await checkUpstashRateLimit(identifier, tier);
    } catch (error) {
      console.error('[Rate Limit] Upstash error, falling back to local memory:', error);
    }
  }
  return checkMemoryRateLimit(identifier, tier);
}

/**
 * Standard Next.js route helper to check rate limit and return 429 response if blocked.
 */
export async function handleApiRateLimit(
  request: NextRequest,
  tier: 'ai' | 'api' | 'auth' = 'api'
): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous';
  const rateLimit = await checkRateLimit(ip, tier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before retrying.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.reset),
          'Retry-After': '60',
        },
      }
    );
  }
  return null;
}

async function checkUpstashRateLimit(
  identifier: string,
  tier: 'ai' | 'api' | 'auth'
): Promise<RateLimitResult> {
  const limiters = getUpstashLimiters();
  const result = await limiters[tier].limit(identifier);
  return {
    allowed: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

function checkMemoryRateLimit(
  identifier: string,
  tier: 'ai' | 'api' | 'auth'
): RateLimitResult {
  const key = `${tier}:${identifier}`;
  const limits = RATE_LIMITS[tier];
  const now = Date.now();
  const windowMs = 60_000; // 1 minute

  const record = memoryStore.get(key);

  if (!record || now >= record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limits.requests - 1, reset: now + windowMs };
  }

  record.count++;
  const remaining = Math.max(0, limits.requests - record.count);
  return {
    allowed: record.count <= limits.requests,
    remaining,
    reset: record.resetAt,
  };
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now >= record.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 300_000);
}
