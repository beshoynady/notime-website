import type { CategorySlug } from "@/content/types";

const CATEGORY_SLUGS: readonly CategorySlug[] = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"];

/**
 * `?category=<slug>` → a known category slug, or "" (same guards as the service param). Its own
 * module, with no content imports, so the contact form can use it on the client.
 */
export function parseCategoryParam(value: string | null | undefined): CategorySlug | "" {
  if (!value || value.length > 60 || !/^[a-z0-9-]+$/.test(value)) return "";
  return CATEGORY_SLUGS.find((c) => c === value) ?? "";
}
