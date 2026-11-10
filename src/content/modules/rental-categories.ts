import type { Localized } from "../types";

/**
 * Equipment & camera rental · `rental-categories` (category-pages.md §6 II.12; plan task A7).
 * Categories only (D81): cameras, lenses, lighting and audio. No models, brands, quantities or
 * prices until a real inventory exists (OQ #22); each line says what the category is for, not
 * what is in stock. EN first, then native Arabic.
 */
export type RentalCategoryId = "cameras" | "lenses" | "lighting" | "audio";

export interface RentalCategory {
  id: RentalCategoryId;
  name: Localized<string>;
  line: Localized<string>;
}

export const RENTAL_CATEGORIES = {
  hint: { en: "Choose what your production needs.", ar: "اختر ما يحتاجه إنتاجك." },
  selected: { en: "Selected:", ar: "اخترت:" },
  /** Joins the selected names in the summary. */
  separator: { en: ", ", ar: "، " },
  cta: { en: "Ask for availability", ar: "اسأل عن التوفّر" },
  categories: [
    {
      id: "cameras",
      name: { en: "Cameras", ar: "الكاميرات" },
      line: { en: "Camera bodies for photo and video.", ar: "كاميرات للتصوير الفوتوغرافي والفيديو." },
    },
    {
      id: "lenses",
      name: { en: "Lenses", ar: "العدسات" },
      line: { en: "Glass to match the shot, from wide to close.", ar: "عدسات تناسب كل لقطة، من الواسعة إلى القريبة." },
    },
    {
      id: "lighting",
      name: { en: "Lighting", ar: "الإضاءة" },
      line: { en: "Light to shape every scene.", ar: "إضاءة تصنع ملامح كل مشهد." },
    },
    {
      id: "audio",
      name: { en: "Audio", ar: "الصوت" },
      line: { en: "Clean sound, on set or at the event.", ar: "تسجيل صوت نقي، أثناء التصوير أو في الفعالية." },
    },
  ] satisfies RentalCategory[],
} as const;
