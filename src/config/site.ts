/**
 * The public origin (no trailing slash): NEXT_PUBLIC_SITE_URL when set (local e2e, the review
 * tunnel), else the primary domain in a production build and localhost in development. The
 * canonical host is the apex, `notimehub.com`; `www` redirects to it (D90, next.config.ts).
 */
export const PRIMARY_ORIGIN = "https://notimehub.com";
const fallback = process.env.NODE_ENV === "production" ? PRIMARY_ORIGIN : "http://localhost:3000";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/+$/, "");
