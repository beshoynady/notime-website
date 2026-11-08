import type { MetadataRoute } from "next";
import { SITE_URL as siteUrl } from "@/config/site";

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
