/**
 * Review mode (v1 plan, Task A1): a build flag for Rand's review build only. With
 * NEXT_PUBLIC_REVIEW_MODE=1 the site shows a review banner, a reference number on every section
 * ("EV-05") and the hidden trust blocks filled with badged example content. A production build
 * (flag unset) renders none of it (D78), and `scripts/check-no-review-leak.mjs` proves it.
 *
 * Components test the flag with the literal `process.env.NEXT_PUBLIC_REVIEW_MODE === "1"` in their
 * own module (`REVIEW_MODE` below), so the build inlines it and drops the review branch.
 */
import { getCategories, getServices, type CategorySlug, type Service } from "@/content";

export const REVIEW_MODE = process.env.NEXT_PUBLIC_REVIEW_MODE === "1";

/** The flag's rule: on only for exactly "1". */
export const reviewFlag = (v: string | undefined) => v === "1";

type Prefix = "H" | "EV" | "SW" | "PG" | "MB" | "CP" | "WK" | "AB" | "PR" | "CT" | "LG" | "ER";
export type SectionRefId = `${Prefix}-${string}`;

export const REF_PREFIX: Record<CategorySlug, Prefix> = {
  "events-hospitality": "EV",
  "software-digital": "SW",
  "production-print-gifts": "PG",
  "marketing-brand": "MB",
  "creative-production": "CP",
};

const two = (n: number) => String(n).padStart(2, "0");

/**
 * Stable numbers, never computed from position, so a new section doesn't renumber Rand's notes.
 * The homepage follows the brief's section order (PROJECT_BRIEF §4); trust blocks start at 12.
 */
export const HOME_REF = {
  hero: "H-01",
  about: "H-02",
  categories: "H-03",
  work: "H-04",
  marquee: "H-05",
  digital: "H-06",
  process: "H-07",
  markets: "H-08",
  reel: "H-09",
  cta: "H-10",
  footer: "H-11",
  logos: "H-12",
  testimonials: "H-13",
  stats: "H-14",
} as const satisfies Record<string, SectionRefId>;

const CATEGORY_PART = { opening: 1, related: 9, faq: 10, quote: 11 } as const;

export const categoryRef = (slug: CategorySlug, part: keyof typeof CATEGORY_PART): SectionRefId =>
  `${REF_PREFIX[slug]}-${two(CATEGORY_PART[part])}`;

/** A service section: 01 + its order in the approved list (orders 1–6 give 02–07). */
export const serviceRef = (s: Pick<Service, "category" | "order">): SectionRefId => `${REF_PREFIX[s.category]}-${two(s.order + 1)}`;

/** Every reference the site uses; the unit test keeps them unique. */
export function allSectionRefs(): SectionRefId[] {
  const refs: SectionRefId[] = Object.values(HOME_REF);
  for (const c of getCategories()) {
    for (const part of Object.keys(CATEGORY_PART) as (keyof typeof CATEGORY_PART)[]) refs.push(categoryRef(c.slug, part));
    for (const s of getServices(c.slug)) refs.push(serviceRef(s));
  }
  return refs;
}
