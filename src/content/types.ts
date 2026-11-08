/**
 * Content types. Data files in this folder are the single source for services,
 * categories, products and image slots. A future CMS (Sanity) replaces the data
 * files behind the getters in `./index.ts`; components never import data files.
 */

export type Locale = "en" | "ar";
export type Localized<T> = { en: T; ar: T };

export type CategorySlug =
  | "events-hospitality"
  | "creative-production"
  | "marketing-brand"
  | "production-print-gifts"
  | "software-digital";

/** Designed-placeholder treatments, ported from the reference prototype. */
export type Paint = "event" | "table" | "studio" | "print" | "code" | "brand";

export type Aspect = "4:5" | "16:9" | "9:16" | "1:1";

export interface ImageSlot {
  /** Stable id used by `docs/content/image-prompts.md`, e.g. "cat-events-hospitality-4x5". */
  id: string;
  /** "ai" lives in /images/ai/, "real" in /images/work/ or /images/brand/. */
  kind: "ai" | "real";
  aspect: Aspect;
  /** null renders the designed placeholder. TODO: replace placeholder when null. */
  src: string | null;
  /** Optional blur placeholder (base64) once a real file exists. */
  blurDataURL?: string;
  /** Pixel size of the file at `src` (required with `src`, tested). Caps the srcset (D51). */
  width?: number;
  height?: number;
  paint: Paint;
  alt: Localized<string>;
  /** True when an AI image stands in for a real past project → visible "Illustrative" label. */
  illustrative: boolean;
}

export interface Category {
  slug: CategorySlug;
  order: 1 | 2 | 3 | 4 | 5;
  title: Localized<string>;
  summary: Localized<string>;
  /** 4:5 image slot id (mega menu, cards). */
  image: string;
  /** Category page design (D57, docs/design/category-pages.md §5). */
  theme: CategoryTheme;
  /** Page intro under the H1 (2–3 sentences). */
  intro: Localized<string>;
  /** FAQ (4–6) for the page and its FAQPage JSON-LD. Answers state process, never unconfirmed numbers. */
  faq: { q: Localized<string>; a: Localized<string> }[];
}

export type CategoryTheme = "evening" | "studio" | "editorial" | "workshop" | "interface";

/** One signature module per service (docs/design/category-pages.md §6). */
export type ModuleKey =
  | "agenda-timeline"
  | "stand-assembly"
  | "launch-reveal"
  | "candle-moodboard"
  | "menu-majlis"
  | "stage-lights"
  | "aperture-gallery"
  | "scrub-reel"
  | "motion-playground"
  | "idea-to-image"
  | "set-model"
  | "rental-categories"
  | "mark-build"
  | "phone-feed"
  | "example-dashboard"
  | "content-calendar"
  | "press-release"
  | "flighting-chart"
  | "human-scale"
  | "build-layers"
  | "unboxing"
  | "gift-configurator"
  | "print-order"
  | "merch-placement"
  | "responsive-frames"
  | "app-screens"
  | "data-flow"
  | "checkout-flow"
  | "fidelity-slider"
  | "ai-sorter";

/** Drives the quote form's field set. */
export type QuoteType = "event" | "production" | "marketing" | "print" | "digital";

export type ServiceStatus = "draft" | "approved";

export interface Service {
  slug: string;
  category: CategorySlug;
  /** 1-based position within its category. */
  order: number;
  title: Localized<string>;
  summary: Localized<string>;
  image: string;
  imageAlt: Localized<string>;
  status: ServiceStatus;
  /**
   * Section id on the category page (`/services/<category>#<anchor>`): the same in EN and AR,
   * never renamed after launch. `slug` stays the permanent id and the path of a future
   * standalone page (D57).
   */
  anchor: string;
  signatureModule: ModuleKey;
  /** "What we deliver": 4–6 points, the same count in both locales. */
  points: Localized<string[]>;
  /** Slugs of real, client-approved work items. Empty until OQ #17 is answered. */
  relatedWork: string[];
  quoteType: QuoteType;
}

export type ProductStatus = "comingSoon" | "live";

export interface Product {
  slug: "qr-check-in" | "restaurant-system";
  status: ProductStatus;
  /** Working name; the final product names are TBD (OPEN_QUESTIONS #5). */
  name: Localized<string>;
  summary: Localized<string>;
  image: string;
}
