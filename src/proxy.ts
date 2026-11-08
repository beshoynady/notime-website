import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getCategories } from "./content";
import { LAB_IDS } from "./content/scenes";
import { routing } from "./i18n/routing";
import { closedLabLocale, unknownCategoryLocale } from "./lib/services-route";

// Next 16 renamed `middleware` to `proxy`. next-intl handles locale
// detection and the `/` → `/en` redirect.
const intl = createMiddleware(routing);
const CATEGORY_SLUGS = getCategories().map((c) => c.slug);
const LAB_PAGES = Object.keys(LAB_IDS).map((id) => `${id}-animatic`);
const LAB_ENABLED = process.env.NEXT_PUBLIC_ENABLE_LAB === "1";

export default function proxy(request: NextRequest) {
  // An unknown category, or a lab page that is off or unknown, answers 404 before rendering:
  // rewritten to a path no route matches, so the locale catch-all renders the not-found page
  // with a real 404 status.
  const { pathname } = request.nextUrl;
  const locale = unknownCategoryLocale(pathname, CATEGORY_SLUGS) ?? closedLabLocale(pathname, LAB_PAGES, LAB_ENABLED);
  if (locale) return NextResponse.rewrite(new URL(`/${locale}/not-found`, request.url));
  return intl(request);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and any file with an extension.
  matcher: "/((?!api|_next|_vercel|.*\..*).*)",
};
