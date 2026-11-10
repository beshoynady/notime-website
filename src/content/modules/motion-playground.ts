import type { EasingId } from "@/components/modules/motion-playground/easing";
import type { Localized } from "../types";

/**
 * Motion graphics · `motion-playground` (category-pages.md §6 II.9): a title card the visitor plays
 * with one of four easings. The card's line is the brand's own, not a sample of client work, so it
 * carries no "Example" label. EN first, then native Arabic.
 */
export interface EasingCopy {
  id: EasingId;
  name: Localized<string>;
  /** What the curve does, in words: the reduced-motion explanation too. */
  line: Localized<string>;
}

export const MOTION_PLAYGROUND = {
  title: { en: "Every second is planned.", ar: "كل ثانية محسوبة." },
  cardLabel: { en: "Title card", ar: "بطاقة العنوان" },
  legend: { en: "Choose an easing", ar: "اختر منحنى الحركة" },
  play: { en: "Play", ar: "تشغيل" },
  playing: { en: "Playing with", ar: "التشغيل بمنحنى" },
  reduced: {
    en: "Motion is reduced on this device, so the card shows its final frame. The curve shows how it would move.",
    ar: "الحركة مخفّفة على هذا الجهاز، لذا تظهر البطاقة في إطارها الأخير، ويبيّن المنحنى كيف كانت ستتحرك.",
  },
  easings: [
    {
      id: "linear",
      name: { en: "Linear", ar: "خطّي" },
      line: {
        en: "The same speed from the first frame to the last. Even, and a little mechanical.",
        ar: "السرعة نفسها من أول إطار إلى آخره. حركة منتظمة، فيها شيء من الآلية.",
      },
    },
    {
      id: "ease-out",
      name: { en: "Ease out", ar: "تباطؤ تدريجي" },
      line: {
        en: "Starts quickly, then slows into place.",
        ar: "تبدأ سريعة، ثم تهدأ حتى تستقر في مكانها.",
      },
    },
    {
      id: "spring",
      name: { en: "Spring", ar: "نابض" },
      line: {
        en: "Passes the mark, then settles back. Lively, so use it sparingly.",
        ar: "تتجاوز موضعها قليلًا ثم ترتدّ إليه. حيوية، فالأفضل أن تُستخدم باعتدال.",
      },
    },
    {
      id: "expo",
      name: { en: "Expo", ar: "أُسّي" },
      line: {
        en: "The curve this site moves on: a quick start and a long, quiet landing.",
        ar: "المنحنى الذي يتحرك به هذا الموقع: انطلاقة سريعة ووصول طويل هادئ.",
      },
    },
  ] satisfies EasingCopy[],
} as const;
