import type { Localized } from "../types";

/**
 * Product launches & brand activations (category-pages.md §6 I.3): the visitor starts a reveal, a
 * 5-second countdown runs and a curtain opens on a product on its plinth; three activation formats
 * switch the setting. The product is drawn in code (no product, no brand, no date to count to), so
 * the module carries "Example", not an AI label. Formats from the copy deck (p.8: malls, venues,
 * exhibitions).
 */
export type LaunchFormatId = "mall" | "venue" | "exhibition";

export const LAUNCH_REVEAL = {
  example: true,
  title: { en: "The moment of the reveal", ar: "لحظة الكشف" },
  note: {
    en: "Start the reveal, then switch the setting. Every format leads to the same five seconds.",
    ar: "ابدأ الكشف، ثم بدّل المكان. كل صيغة تقود إلى الثواني الخمس نفسها.",
  },
  countdownFrom: 5,
  start: { en: "Start the reveal", ar: "ابدأ الكشف" },
  skip: { en: "Skip the countdown", ar: "تخطَّ العدّ التنازلي" },
  reset: { en: "Close the curtain", ar: "أسدل الستارة" },
  productLabel: { en: "Your product", ar: "منتجك" },
  formatsLabel: { en: "Setting", ar: "المكان" },
  formats: [
    {
      id: "mall",
      label: { en: "Mall", ar: "مركز تجاري" },
      line: { en: "A stage in the atrium, seen from every level.", ar: "منصة في البهو، تراها كل الطوابق." },
    },
    {
      id: "venue",
      label: { en: "Venue", ar: "قاعة" },
      line: { en: "A seated room, lights down, one spot on the plinth.", ar: "قاعة بمقاعدها، والأضواء خافتة إلا بقعة واحدة على المنصة." },
    },
    {
      id: "exhibition",
      label: { en: "Exhibition", ar: "معرض" },
      line: { en: "A stand built around the reveal, with visitors gathered at the front.", ar: "جناح مبني حول لحظة الكشف، والزوّار يتجمّعون أمامه." },
    },
  ] satisfies { id: LaunchFormatId; label: Localized<string>; line: Localized<string> }[],
  /** Live region: the start and the end of the countdown only (spec §6). */
  status: {
    start: { en: "The reveal starts in 5 seconds.", ar: "يبدأ الكشف بعد 5 ثوانٍ." },
    done: { en: "Revealed.", ar: "تمّ الكشف." },
    closed: { en: "Curtain closed.", ar: "أُسدلت الستارة." },
    format: { en: "Setting: {format}. {line}", ar: "المكان: {format}. {line}" },
  },
};
