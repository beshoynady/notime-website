import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Kept on with next-intl via next/root-params (DECISIONS D13, OPEN_QUESTIONS #9).
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Defaults plus Canva's native widths (944, 1136, 1680), so the capped srcset ends exactly
    // at the file's own width (D51, src/lib/srcset.ts).
    deviceSizes: [640, 750, 828, 944, 1080, 1136, 1200, 1680, 1920, 2048, 3840],
  },
  // Self-hosted brand fonts (D45): versioned file names, so they can be cached for good.
  async headers() {
    return [{ source: "/fonts/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
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
