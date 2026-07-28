import { headers } from "next/headers";

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

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

const SYMPTOM_LIMIT: RateLimitConfig = { windowMs: 60_000, maxRequests: 5 };
const CHAT_LIMIT: RateLimitConfig = { windowMs: 60_000, maxRequests: 20 };

export async function checkSymptomRateLimit() {
  const ip = await getClientIp();
  return checkRateLimit(`symptom:${ip}`, SYMPTOM_LIMIT);
}

export async function checkChatRateLimit() {
  const ip = await getClientIp();
  return checkRateLimit(`chat:${ip}`, CHAT_LIMIT);
}
