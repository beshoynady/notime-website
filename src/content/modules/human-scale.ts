import type { Localized } from "../types";

/**
 * The human-scale module (category-pages.md §6, IV.19; section I, Commercial & large-format
 * printing). Typical formats only, labelled as such: standard or common sizes for comparison,
 * not an offer and not a statement about NO TIME's machines. The promise names business cards
 * and brochures first (D81), so the lineup starts with them. No prices.
 */
export interface ScaleFormat {
  id: "card" | "brochure" | "rollup" | "backdrop";
  /** Width × height in millimetres. */
  w: number;
  h: number;
  name: Localized<string>;
  /** Why this size: the standard it follows, or "a common size". */
  basis: Localized<string>;
}

export const SCALE_FORMATS: ScaleFormat[] = [
  {
    id: "card",
    w: 85,
    h: 55,
    name: { en: "Business card", ar: "بطاقة العمل" },
    basis: { en: "A common card size", ar: "مقاس شائع لبطاقات العمل" },
  },
  {
    id: "brochure",
    w: 210,
    h: 297,
    name: { en: "Brochure", ar: "البروشور" },
    basis: { en: "ISO A4", ar: "مقاس A4 القياسي" },
  },
  {
    id: "rollup",
    w: 850,
    h: 2000,
    name: { en: "Roll-up banner", ar: "لافتة الرول أب" },
    basis: { en: "A common roll-up size", ar: "مقاس شائع للافتات الرول أب" },
  },
  {
    id: "backdrop",
    w: 3000,
    h: 2400,
    name: { en: "Backdrop", ar: "الخلفية" },
    basis: { en: "A common event backdrop size", ar: "مقاس شائع لخلفيات الفعاليات" },
  },
];

/** The module's strings. `{…}` are filled in by the component. */
export const HUMAN_SCALE_COPY = {
  title: { en: "Typical formats, drawn to scale", ar: "مقاسات شائعة بمقياسها الحقيقي" },
  note: {
    en: "Common sizes for comparison, beside a 1.8 m figure. Each job is printed at the size it needs.",
    ar: "مقاسات شائعة للمقارنة، بجانب شخص طوله 1.8 م. ونطبع كل عمل بالمقاس الذي يحتاجه.",
  },
  choose: { en: "Choose a format", ar: "اختر مقاسًا" },
  unit: { en: "mm", ar: "مم" },
  metre: { en: "m", ar: "م" },
  figure: { en: "1.8 m", ar: "1.8 م" },
  /** The lens over a small format: its true magnification. */
  power: { en: "×{n}", ar: "×{n}" },
  /** The live region, on each choice. */
  announce: {
    en: "{name}: {size} mm, {basis}, drawn to scale beside a 1.8 m figure.",
    ar: "{name}: {size} مم، {basis}، مرسومة بمقياسها الحقيقي بجانب شخص طوله 1.8 م.",
  },
} satisfies Record<string, Localized<string>>;
