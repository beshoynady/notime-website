import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

const MIN = 60_000;

describe("rate limit (D66: 5 submissions per IP per 10 minutes, best effort per instance)", () => {
  it("allows five submissions in ten minutes and limits the sixth, with the wait until the oldest expires", () => {
    const limit = createRateLimiter({ max: 5, windowMs: 10 * MIN });
    for (let i = 0; i < 5; i++) expect(limit("1.2.3.4", i * MIN).ok).toBe(true);
    expect(limit("1.2.3.4", 5 * MIN)).toEqual({ ok: false, retryAfter: 5 * 60 });
  });

  it("allows the IP again once its oldest submission leaves the window", () => {
    const limit = createRateLimiter({ max: 5, windowMs: 10 * MIN });
    for (let i = 0; i < 5; i++) limit("1.2.3.4", i * MIN);
    expect(limit("1.2.3.4", 10 * MIN).ok).toBe(true);
  });

  it("counts each IP on its own", () => {
    const limit = createRateLimiter({ max: 1, windowMs: 10 * MIN });
    expect(limit("1.1.1.1", 0).ok).toBe(true);
    expect(limit("2.2.2.2", 0).ok).toBe(true);
    expect(limit("1.1.1.1", 1).ok).toBe(false);
  });

  it("does not count a limited attempt, so waiting is enough", () => {
    const limit = createRateLimiter({ max: 1, windowMs: 10 * MIN });
    limit("ip", 0);
    for (let t = 1; t < 10; t++) limit("ip", t * MIN);
    expect(limit("ip", 10 * MIN).ok).toBe(true);
  });
});
