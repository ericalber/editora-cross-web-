const BUCKETS = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = BUCKETS.get(key);

  if (!bucket || bucket.expiresAt < now) {
    BUCKETS.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: bucket.expiresAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export function rateLimitRequest(request: Request, namespace: string, limit = 60, windowMs = 60_000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const key = `${namespace}:${ip}`;
  return rateLimit(key, limit, windowMs);
}
