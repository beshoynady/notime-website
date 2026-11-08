/** The public origin (no trailing slash), from NEXT_PUBLIC_SITE_URL; localhost in development. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
