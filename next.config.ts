import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const review = process.env.NEXT_PUBLIC_REVIEW_MODE === "1";
/** The canonical host is the apex (D90); a request on `www.` gets a permanent redirect to it. */
const APEX = "notimehub.com";

const nextConfig: NextConfig = {
  // The review build (v1 plan, Task A1) lives in its own folder, so it never overwrites the
  // production build that e2e and Lighthouse use.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Kept on with next-intl via next/root-params (DECISIONS D13, OPEN_QUESTIONS #9).
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Defaults plus Canva's native widths (944, 1136, 1680), so the capped srcset ends exactly
    // at the file's own width (D51, src/lib/srcset.ts).
    deviceSizes: [640, 750, 828, 944, 1080, 1136, 1200, 1680, 1920, 2048, 3840],
  },
  // A second guard behind the host-level redirect (docs/launch/hostinger-deploy.md): path and query kept.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: `www.${APEX}` }], destination: `https://${APEX}/:path*`, permanent: true }];
  },
  // Self-hosted brand fonts (D45): versioned file names, so they can be cached for good.
  async headers() {
    return [
      { source: "/fonts/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      // The review build is never indexed, wherever it is reachable (the review tunnel).
      ...(review ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
