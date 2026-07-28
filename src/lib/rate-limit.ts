const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= config.maxRequests) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count++;
  return { allowed: true, retryAfterMs: 0 };
}

const SYMPTOM_LIMIT: RateLimitConfig = { windowMs: 60_000, maxRequests: 5 };
const CHAT_LIMIT: RateLimitConfig = { windowMs: 60_000, maxRequests: 20 };

export function checkSymptomRateLimit(userId: string) {
  return checkRateLimit(`symptom:${userId}`, SYMPTOM_LIMIT);
}

export function checkChatRateLimit(userId: string) {
  return checkRateLimit(`chat:${userId}`, CHAT_LIMIT);
}
