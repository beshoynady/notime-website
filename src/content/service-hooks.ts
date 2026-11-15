import type { Localized } from "./types";

/**
 * A hook per service section: one outcome-first line between the H2 and the approved promise
 * ("final push" §3). Keyed by service slug; a service without one shows its promise alone, so the
 * other categories can add theirs without touching the template. Each line rests on the profile or
 * the copy deck (sources noted); no figure, no time promise.
 */
export const SERVICE_HOOKS: Record<string, Localized<string>> = {
  // Events & Hospitality (batch 2). Sources: docs/content/category-copy-events.md, profile-copy.md.
  "conferences-summits": {
    // p.4 (concept to guest experience), p.6 (ceremonies and award nights)
    en: "The whole day on one running order, from the first badge to the closing ceremony.",
    ar: "اليوم كله على برنامج واحد، من أول بطاقة تسجيل حتى حفل الختام.",
  },
  "exhibitions-booths": {
    // p.19, p.21 (design, fabrication, installation, on-site PR); D56 (staffed)
    en: "A stand people step into, drawn, built and staffed by the same team.",
    ar: "جناح يدخله الزوّار، يرسمه ويبنيه ويديره فريق واحد.",
  },
  "product-launches-activations": {
    // p.4 (concept), p.7 (technology and robotics), p.8 (malls, venues, exhibitions)
    en: "The reveal lasts a few seconds. We build everything that leads up to it.",
    ar: "لحظة الكشف ثوانٍ معدودة، ونحن نبني كل ما يسبقها.",
  },
  "galas-private-celebrations": {
    // p.9–p.11 (décor, florals, keepsakes, full on-day production)
    en: "An evening guests remember, from the first flower to the last keepsake.",
    ar: "أمسية تبقى في ذاكرة ضيوفك، من أول زهرة حتى آخر تذكار.",
  },
  "catering-heritage-hospitality": {
    // p.31–p.32 (majlis, tents, Arabic coffee, welcome ceremonies, heritage carts)
    en: "Coffee poured the way your guests expect, in a majlis set before they arrive.",
    ar: "قهوة تُصبّ كما يعرفها ضيوفك، في مجلس جاهز قبل وصولهم.",
  },
  "stage-technical-production": {
    // p.33 (stage, rigging, live sound); D56 ("rigged and run by one crew")
    en: "Sound, light and screens on one cue sheet, run by the crew that rigged them.",
    ar: "الصوت والإضاءة والشاشات على جدول إشارات واحد، يديره الفريق الذي ركّبها.",
  },
};

export function serviceHook(slug: string): Localized<string> | undefined {
  return SERVICE_HOOKS[slug];
}
