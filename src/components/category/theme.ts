import type { CategoryTheme } from "@/content";

/**
 * The tone each theme starts in (docs/design/category-pages.md §5): ToneController reads
 * `data-tone` to set the page ground and keep the header readable. The Evening is dark until
 * its ivory FAQ/quote band; the Studio is dark; the other three are light.
 */
export const THEME_TONE: Record<CategoryTheme, "dark" | "light"> = {
  evening: "dark",
  studio: "dark",
  editorial: "light",
  workshop: "light",
  interface: "light",
};
