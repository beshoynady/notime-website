/**
 * Turnstile keys (D66, D102). Development, tests and the review build fall back to Cloudflare's
 * published always-pass test keys; a production build without real keys gets none, so the widget
 * doesn't render and the server refuses every token (fail closed: the visitor sees the email
 * fallback). The real keys are a launch item (docs/review/launch-blockers-ar.md).
 */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

const allowTestKeys = () => process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_REVIEW_MODE === "1";

/** Public: inlined into the client bundle. */
export const turnstileSiteKey: string = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (allowTestKeys() ? TURNSTILE_TEST_SITE_KEY : "");

/** Server only. */
export function turnstileSecret(): string {
  return process.env.TURNSTILE_SECRET_KEY || (allowTestKeys() ? TURNSTILE_TEST_SECRET : "");
}
