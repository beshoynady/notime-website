/**
 * Lead source (final pass §6.2, D110): where a visitor came from, attached to every form email so
 * the team knows which post, ad or link brought the brief. Kept for the browser session only
 * (sessionStorage, never a cookie, never sent anywhere but with a form the visitor submits).
 *
 * First touch per session: the first page records its UTM tags, the referring site's host and the
 * landing path; later untagged pages keep it, and a new tagged visit replaces it. Everything is
 * treated as untrusted text: known keys only, control characters out, values capped. Pure, so the
 * browser glue (LeadSourceCapture) and the server (the form actions) share it.
 */
export const LEAD_STORAGE_KEY = "nt-lead";
/** The FormData field the forms add on submit. */
export const LEAD_FIELD = "lead";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const KEYS = [...UTM_KEYS, "referrer", "landing"] as const;
type Key = (typeof KEYS)[number];
export type LeadSource = Partial<Record<Key, string>>;

const MAX_VALUE = 80;
const MAX_LANDING = 160;
const MAX_SERIALIZED = 2000;

function clean(value: string, max = MAX_VALUE): string {
  return value
    // Control, bidi and zero-width characters: none may reorder or hide a row in the team email.
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩﻿]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

const bareHost = (h: string) => h.toLowerCase().replace(/^www\./, "");

function referrerHost(referrer: string, host: string): string | undefined {
  try {
    const h = new URL(referrer).hostname;
    return h && bareHost(h) !== bareHost(host) ? clean(h) : undefined;
  } catch {
    return undefined;
  }
}

export function captureLeadSource({
  url,
  referrer,
  host,
  existing,
}: {
  url: string;
  referrer: string;
  host: string;
  existing: LeadSource | null;
}): LeadSource {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return existing ?? {};
  }
  const tags: LeadSource = {};
  for (const k of UTM_KEYS) {
    const v = u.searchParams.get(k);
    if (v && clean(v)) tags[k] = clean(v);
  }
  const tagged = Object.keys(tags).length > 0;
  if (existing && !tagged) return existing;
  const ref = referrerHost(referrer, host);
  return { ...tags, ...(ref ? { referrer: ref } : {}), landing: clean(u.pathname, MAX_LANDING) };
}

export const serializeLeadSource = (lead: LeadSource): string => JSON.stringify(lead);

/** Server side and storage: a lead object or null; unknown keys out, values re-cleaned. */
export function parseLeadSource(raw: string | null | undefined): LeadSource | null {
  if (!raw || raw.length > MAX_SERIALIZED) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const out: LeadSource = {};
  for (const k of KEYS) {
    const v = (data as Record<string, unknown>)[k];
    if (v === undefined) continue;
    if (typeof v !== "string") return null;
    const c = clean(v, k === "landing" ? MAX_LANDING : MAX_VALUE);
    if (c) out[k] = c;
  }
  return Object.keys(out).length ? out : null;
}

/** The team email's rows (English, like the rest of the team email). */
export function leadRows(lead: LeadSource | null): [string, string][] {
  if (!lead) return [];
  const rows: [string, string][] = [];
  const source = [lead.utm_source, lead.utm_medium].filter(Boolean).join(" / ");
  rows.push(["Source", source || (lead.referrer ? "Referral" : "Direct (no tag, no referrer)")]);
  if (lead.utm_campaign) rows.push(["Campaign", lead.utm_campaign]);
  if (lead.utm_content) rows.push(["Content", lead.utm_content]);
  if (lead.utm_term) rows.push(["Term", lead.utm_term]);
  if (lead.referrer) rows.push(["Referrer", lead.referrer]);
  if (lead.landing) rows.push(["Landing page", lead.landing]);
  return rows;
}
