import type { Localized } from "../types";

/**
 * Curated NO TIME event photos used inside the Events modules (D49; profile-inventory.md): no
 * identifiable person, no client name or branding (CONTENT_CHECKLIST #34: the branded folders are
 * never used here). Native sizes for the capped srcset (D51). They are shown as the company's own
 * work, never as a named project.
 */
export interface EventPhoto {
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
}

const photo = (group: string, n: number, width: number, height: number, alt: Localized<string>): EventPhoto => ({
  src: `/images/work/${group}/${group}-${n}.webp`,
  width,
  height,
  alt,
});

export const EVENT_PHOTOS = {
  hall: photo("private-celebrations", 1, 1600, 1066, {
    en: "A glass-roofed hall set with long candlelit tables under woven lanterns.",
    ar: "قاعة بسقف زجاجي، بطاولات طويلة على ضوء الشموع تحت فوانيس منسوجة.",
  }),
  roses: photo("private-celebrations", 2, 859, 1290, {
    en: "White roses and blue hydrangeas on a dressed table, lit by candles.",
    ar: "ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع.",
  }),
  entrance: photo("private-celebrations", 3, 537, 716, {
    en: "An entrance arrangement of white flowers and candles on a marble floor.",
    ar: "تنسيق زهور بيضاء وشموع عند المدخل، على أرضية رخامية.",
  }),
  runner: photo("private-celebrations", 4, 811, 541, {
    en: "Candles and hydrangeas along a table runner.",
    ar: "شموع وزهور كوبية على امتداد مفرش الطاولة.",
  }),
  dessertTable: photo("private-celebrations", 5, 949, 534, {
    en: "A reception dessert table with a silver candelabra.",
    ar: "طاولة حلويات لحفل استقبال، يتوسّطها شمعدان فضي.",
  }),
  keepsake: photo("private-celebrations", 6, 859, 1290, {
    en: "A bouquet wrapped as a keepsake for guests.",
    ar: "باقة زهور مغلّفة تذكارًا للضيوف.",
  }),
  terrace: photo("private-celebrations", 7, 850, 638, {
    en: "A terrace with a white floral installation among palms.",
    ar: "شرفة يتوسّطها تنسيق زهور أبيض بين أشجار النخيل.",
  }),
  buffet: photo("catering", 1, 1408, 794, {
    en: "A buffet styled with crystal and gold service.",
    ar: "بوفيه منسّق بأوانٍ من الكريستال والذهبي.",
  }),
  florals: photo("catering", 3, 1247, 702, {
    en: "A dessert table dressed with florals.",
    ar: "طاولة حلويات مزيّنة بالزهور.",
  }),
  cart: photo("heritage", 4, 956, 1275, {
    en: "A heritage cart set with brass dallahs and vessels.",
    ar: "عربة تراثية عليها دلال وأوانٍ نحاسية.",
  }),
  coffee: photo("heritage", 2, 688, 516, {
    en: "Arabic coffee service laid out on a carpet.",
    ar: "أدوات تقديم القهوة العربية مصفوفة على سجّادة.",
  }),
} satisfies Record<string, EventPhoto>;
