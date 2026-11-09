import { describe, expect, it } from "vitest";
import { verifyTurnstile } from "./turnstile";

type Call = { url: string; body: URLSearchParams };
const fake = (reply: () => Promise<Response>) => {
  const calls: Call[] = [];
  const fetcher = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: init.body as URLSearchParams });
    return reply();
  }) as typeof fetch;
  return { calls, fetcher };
};
const json = (body: unknown, status = 200) => async () => new Response(JSON.stringify(body), { status });

describe("verifyTurnstile (server-side siteverify, D66)", () => {
  it("is true when Cloudflare answers success, and sends the secret, token and IP", async () => {
    const { calls, fetcher } = fake(json({ success: true }));
    expect(await verifyTurnstile("tok", "1.2.3.4", { secret: "s3cret", fetcher })).toBe(true);
    expect(calls[0].url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(Object.fromEntries(calls[0].body)).toEqual({ secret: "s3cret", response: "tok", remoteip: "1.2.3.4" });
  });

  it("is false when Cloudflare answers failure", async () => {
    const { fetcher } = fake(json({ success: false, "error-codes": ["invalid-input-response"] }));
    expect(await verifyTurnstile("tok", "1.2.3.4", { secret: "s", fetcher })).toBe(false);
  });

  it("is false on a network error or a non-200 reply", async () => {
    expect(await verifyTurnstile("tok", "ip", { secret: "s", fetcher: fake(() => Promise.reject(new Error("down"))).fetcher })).toBe(false);
    expect(await verifyTurnstile("tok", "ip", { secret: "s", fetcher: fake(json({ success: true }, 500)).fetcher })).toBe(false);
  });

  it("is false without a token or a secret, and never calls Cloudflare then", async () => {
    const { calls, fetcher } = fake(json({ success: true }));
    expect(await verifyTurnstile("", "ip", { secret: "s", fetcher })).toBe(false);
    expect(await verifyTurnstile("tok", "ip", { secret: "", fetcher })).toBe(false);
    expect(calls).toHaveLength(0);
  });
});
