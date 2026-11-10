import type { Localized } from "./types";

/**
 * How we work: our principles (D78 §5, approved 2026-11-09). They replace the team section until
 * real photos and bios exist. Each comes from the profile's own claims. Not a sequence, so no
 * numbers: the section shows them unnumbered.
 */
export interface Principle {
  key: string;
  title: Localized<string>;
  line: Localized<string>;
}

export const principles: Principle[] = [
  {
    key: "one-roof",
    title: { en: "Under one roof", ar: "تحت سقف واحد" },
    line: { en: "Strategy, creative, production and delivery, carried through by one team.", ar: "الاستراتيجية والإبداع والإنتاج والتنفيذ، يتولّاها فريق واحد حتى النهاية." },
  },
  {
    key: "concept-to-guest",
    title: { en: "From the concept to the guest", ar: "من الفكرة إلى الضيف" },
    line: { en: "Concept, décor, production and the guest experience, planned as one.", ar: "الفكرة والديكور والإنتاج وتجربة الضيف، في خطة واحدة." },
  },
  {
    key: "bilingual",
    title: { en: "Arabic and English, natively", ar: "بالعربية والإنجليزية، كلٌّ بأسلوبه" },
    line: { en: "Every word written in each language on its own terms, never translated word for word.", ar: "نكتب كل كلمة بلغتها وبأسلوبها، لا بترجمة حرفية." },
  },
  {
    key: "six-markets",
    title: { en: "Six markets, one standard", ar: "ستة أسواق، ومعيار واحد" },
    line: { en: "Based in Dubai, working across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt.", ar: "مقرّنا في دبي، ونعمل في الإمارات والسعودية وقطر وعُمان والكويت ومصر." },
  },
];
