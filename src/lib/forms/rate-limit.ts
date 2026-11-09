/**
 * Per-IP submission limit for the forms (D66): 5 per IP per 10 minutes. In memory, so it holds
 * per server instance only (best effort; Turnstile and the honeypot are the real filters).
 * A limited attempt isn't counted, so waiting out the window is always enough.
 */
export type RateResult = { ok: boolean; retryAfter: number };

export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
  const hits = new Map<string, number[]>();
  return (key: string, now: number): RateResult => {
    const recent = (hits.get(key) ?? []).filter((t) => t > now - windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return { ok: false, retryAfter: Math.ceil((recent[0] + windowMs - now) / 1000) };
    }
    recent.push(now);
    hits.set(key, recent);
    return { ok: true, retryAfter: 0 };
  };
}

/** The forms' shared limiter. */
export const rateLimit = createRateLimiter({ max: 5, windowMs: 10 * 60_000 });
