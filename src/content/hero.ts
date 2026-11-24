import type { CategorySlug } from "./types";

/**
 * The Home hero's five objects (D173), one per service, in the categories' order. Each is shown
 * here only (D169). Events lands last, on 12, as the countdown reaches zero.
 */
export const HERO_OBJECTS: Record<CategorySlug, string> = {
  "events-hospitality": "hero-obj-events",
  "creative-production": "hero-obj-creative",
  "marketing-brand": "hero-obj-marketing",
  "production-print-gifts": "hero-obj-print",
  "software-digital": "hero-obj-software",
};
