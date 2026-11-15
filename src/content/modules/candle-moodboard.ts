import type { Localized } from "../types";
import { EVENT_PHOTOS, type EventPhoto } from "./event-photos";

/**
 * Galas & private celebrations (category-pages.md §6 I.4): real NO TIME celebration photos beside
 * a mood board (a palette from the brand's own colours, a florals note, a keepsake). Three moods
 * the visitor switches. The photos are real and shown without client names (D49); they are not
 * captioned as a gala or a wedding, only as photos from NO TIME events. The moods are examples.
 */
export type MoodId = "gala" | "wedding" | "intimate";

export interface Swatch {
  hex: string;
  name: Localized<string>;
}

const SW = {
  espresso: { hex: "#2E2017", name: { en: "Espresso", ar: "بنّي داكن" } },
  cocoa: { hex: "#634731", name: { en: "Cocoa", ar: "كاكاو" } },
  taupe: { hex: "#BB9A79", name: { en: "Taupe", ar: "رملي" } },
  champagne: { hex: "#EAD4AB", name: { en: "Champagne", ar: "شمبانيا" } },
  ivory: { hex: "#F5E9D3", name: { en: "Ivory", ar: "عاجي" } },
} satisfies Record<string, Swatch>;

export interface Mood {
  id: MoodId;
  label: Localized<string>;
  line: Localized<string>;
  swatches: Swatch[];
  florals: Localized<string>;
  keepsake: Localized<string>;
  photos: EventPhoto[];
}

export const MOODBOARD = {
  example: true,
  title: { en: "Set the mood", ar: "اختر الأجواء" },
  note: {
    en: "Photos from NO TIME events. The three moods are examples of where a concept deck starts.",
    ar: "صور من فعاليات نظّمتها NO TIME، والأجواء الثلاث أمثلة على بداية ملف الفكرة.",
  },
  moodsLabel: { en: "Mood", ar: "الأجواء" },
  paletteLabel: { en: "Palette", ar: "الألوان" },
  floralsLabel: { en: "Florals", ar: "الزهور" },
  keepsakeLabel: { en: "Keepsake", ar: "التذكار" },
  /** Live region. */
  status: { en: "{mood}: {line}", ar: "{mood}: {line}" },
  moods: [
    {
      id: "gala",
      label: { en: "Gala", ar: "حفل رسمي" },
      line: { en: "Long tables, low light, a room that glows from the centre.", ar: "طاولات طويلة وإضاءة خافتة، وقاعة يشعّ نورها من وسطها." },
      swatches: [SW.espresso, SW.champagne, SW.taupe],
      florals: { en: "Low runners of hydrangea between candles", ar: "زهور كوبية منخفضة على امتداد الطاولة بين الشموع" },
      keepsake: { en: "A printed menu with each guest's name", ar: "قائمة طعام مطبوعة باسم كل ضيف" },
      photos: [EVENT_PHOTOS.hall, EVENT_PHOTOS.runner, EVENT_PHOTOS.buffet],
    },
    {
      id: "wedding",
      label: { en: "Wedding", ar: "زفاف" },
      line: { en: "White florals, candlelight and an entrance guests remember.", ar: "زهور بيضاء وضوء شموع، ومدخل يبقى في ذاكرة الضيوف." },
      swatches: [SW.ivory, SW.champagne, SW.taupe],
      florals: { en: "White roses and tall arrangements at the entrance", ar: "ورود بيضاء وتنسيقات عالية عند المدخل" },
      keepsake: { en: "A wrapped bouquet for each guest", ar: "باقة مغلّفة لكل ضيف" },
      photos: [EVENT_PHOTOS.roses, EVENT_PHOTOS.entrance, EVENT_PHOTOS.keepsake],
    },
    {
      id: "intimate",
      label: { en: "Intimate", ar: "عائلي" },
      line: { en: "A small gathering, a dessert table, a terrace at dusk.", ar: "لقاء صغير، وطاولة حلويات، وشرفة عند الغروب." },
      swatches: [SW.ivory, SW.cocoa, SW.champagne],
      florals: { en: "One white installation, open air", ar: "تنسيق أبيض واحد في الهواء الطلق" },
      keepsake: { en: "Boxed sweets to take home", ar: "علب حلوى يأخذها الضيوف معهم" },
      photos: [EVENT_PHOTOS.dessertTable, EVENT_PHOTOS.terrace, EVENT_PHOTOS.florals],
    },
  ] satisfies Mood[],
};
