import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getCategories } from "./content";
import { routing } from "./i18n/routing";
import { unknownCategoryLocale } from "./lib/services-route";

// Next 16 renamed `middleware` to `proxy`. next-intl handles locale
// detection and the `/` → `/en` redirect.
const intl = createMiddleware(routing);
const CATEGORY_SLUGS = getCategories().map((c) => c.slug);

export default function proxy(request: NextRequest) {
  // An unknown category answers 404 before rendering: rewritten to a path no route matches, so
  // the locale catch-all renders the not-found page with a real 404 status.
  const locale = unknownCategoryLocale(request.nextUrl.pathname, CATEGORY_SLUGS);
  if (locale) return NextResponse.rewrite(new URL(`/${locale}/not-found`, request.url));
  return intl(request);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and any file with an extension.
  matcher: "/((?!api|_next|_vercel|.*\..*).*)",
};
