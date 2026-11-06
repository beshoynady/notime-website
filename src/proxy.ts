import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 renamed `middleware` to `proxy`. next-intl handles locale
// detection and the `/` → `/en` redirect.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, Vercel internals and any file with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
