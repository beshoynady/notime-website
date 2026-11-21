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
}

/** `hidden`: the line stays in the data but doesn't render (fill or hide, D78), e.g. a claim the site can't back yet (D123). */
export type FaqItem = { q: Localized<string>; a: Localized<string>; hidden?: true };

export interface Category {
  slug: CategorySlug;
  order: 1 | 2 | 3 | 4 | 5;
  title: Localized<string>;
  summary: Localized<string>;
  /** The search title and description, when they should say more than the card's title and summary. */
  metaTitle?: Localized<string>;
  metaDescription?: Localized<string>;
  /** 4:5 image slot id (mega menu; the home card when it has no `photo`). */
  image: string;
  /** The home card's photograph, a registry id (media.ts; visual-stories.md "Five crafts"). Hidden or unset: `image`. */
  photo?: string;
  /** Category page design (D57, docs/design/category-pages.md §5). */
  theme: CategoryTheme;
  /** Page intro under the H1 (2–3 sentences). */
  intro: Localized<string>;
  /** FAQ (4–6) for the page and its FAQPage JSON-LD. Answers state process, never unconfirmed numbers. */
  faq: FaqItem[];
  /** The closing line (the storyboard's bookend): the quote block's H2, echoing the opening. */
  closing: Localized<string>;
}

export type CategoryTheme = "evening" | "studio" | "editorial" | "workshop" | "interface";

/** One signature module per service (docs/design/category-pages.md §6). */
export type ModuleKey =
  | "aperture-gallery"
  | "scrub-reel"
  | "idea-to-image"
  | "set-model"
  | "mark-build"
  | "phone-feed"
  | "example-dashboard"
  | "content-calendar"
  | "press-release"
  | "campaign-funnel"
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
  /** None when the section tells its story as a photo scene instead (Events I–III, D153). */
  signatureModule?: ModuleKey;
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
  /** The short name (D78), used inside the pages. */
  name: Localized<string>;
  /** What it does, shown with the name in the lockup (titles, metadata, schema, menus). */
  descriptor: Localized<string>;
  summary: Localized<string>;
  image: string;
}
