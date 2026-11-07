import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Everything is crawlable. The styleguide is kept out of search with a `noindex` robots
 * meta tag instead of a Disallow rule: a crawler has to fetch a page to see its noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
