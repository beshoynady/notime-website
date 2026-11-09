/**
 * Server-side Turnstile check (D66). Any failure (no token, no secret, a network error, a non-200
 * reply, success: false) counts as not verified. Nothing here logs the token or the secret.
 */
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  ip: string,
  { secret = process.env.TURNSTILE_SECRET_KEY ?? "", fetcher = fetch }: { secret?: string; fetcher?: typeof fetch } = {},
): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const res = await fetcher(SITEVERIFY, { method: "POST", body: new URLSearchParams({ secret, response: token, remoteip: ip }) });
    if (!res.ok) return false;
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}
