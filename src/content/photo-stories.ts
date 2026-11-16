import type { Localized } from "./types";

/**
 * Photo-driven scroll stories (§5 of the final pass, D109): real NO TIME photos from the 2026
 * profile (profile-inventory.md: no identifiable person, no client name or branding), graded with
 * the Evening grade at native size (scripts/grade-stories.mjs → public/images/stories/). They show
 * the company's own work in general, never a named project: Work cards and case studies keep
 * their own rules (CaseMedia, D106).
 *
 * Three stories:
 * - `ROOM_STORY` (About): split screen, the line pinned beside its photo, four beats of one evening;
 * - `STRIP` (home, Our work): a pinned horizontal strip, mirrored in Arabic;
 * - `PRIVATE_STACK` (Events, Galas & private celebrations): photo cards that stack as you scroll.
 */
export interface StoryPhoto {
  /** File stem in public/images/stories/ (webp + avif). */
  id: string;
  /** Curated source (profile-inventory.md) and its raw file in the profile extract. */
  from: string;
  width: number;
  height: number;
  alt: Localized<string>;
}

const p = (id: string, from: string, width: number, height: number, alt: Localized<string>): StoryPhoto => ({ id, from, width, height, alt });

export const STORY_PHOTOS = {
  rig: p("st-rig", "private-celebrations-8", 953, 715, {
    en: "A ballroom stage with its truss going up before an event.",
    ar: "مسرح قاعة احتفالات وهيكله المعدني قيد التركيب قبل الفعالية.",
  }),
  hall: p("st-hall", "private-celebrations-1", 1600, 1066, {
    en: "A glass-roofed hall set with long candlelit tables under woven lanterns.",
    ar: "قاعة بسقف زجاجي، بطاولات طويلة على ضوء الشموع تحت فوانيس منسوجة.",
  }),
  table: p("st-table", "catering-2", 1247, 703, {
    en: "A long dining table laid with crystal, candles and low florals.",
    ar: "طاولة عشاء طويلة بالكريستال والشموع وتنسيقات زهور منخفضة.",
  }),
  cart: p("st-cart", "heritage-4", 956, 1275, {
    en: "A carved heritage cart with brass coffee pots and dates.",
    ar: "عربة ضيافة تراثية منقوشة، عليها دلال نحاسية وتمر.",
  }),
  florals: p("st-florals", "private-celebrations-2", 859, 1290, {
    en: "White roses and blue hydrangeas on a dressed table, lit by candles.",
    ar: "ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع.",
  }),
  buffet: p("st-buffet", "catering-1", 1408, 794, {
    en: "A buffet styled with crystal and gold service.",
    ar: "بوفيه منسّق بأوانٍ من الكريستال والذهبي.",
  }),
  tent: p("st-tent", "heritage-5", 891, 668, {
    en: "A desert tent at night, its floor laid with carpets.",
    ar: "خيمة في الصحراء ليلًا، أرضها مفروشة بالسجاد.",
  }),
  terrace: p("st-terrace", "private-celebrations-7", 850, 638, {
    en: "A terrace with a white floral installation among palms.",
    ar: "شرفة يتوسّطها تنسيق زهور أبيض بين أشجار النخيل.",
  }),
  dessert: p("st-dessert", "private-celebrations-5", 949, 534, {
    en: "A reception dessert table with a silver candelabra.",
    ar: "طاولة حلويات لحفل استقبال، يتوسّطها شمعدان فضي.",
  }),
  runner: p("st-runner", "private-celebrations-4", 811, 541, {
    en: "Candles and hydrangeas along a table runner.",
    ar: "شموع وزهور كوبية على امتداد مفرش الطاولة.",
  }),
  keepsake: p("st-keepsake", "private-celebrations-6", 859, 1290, {
    en: "A bouquet wrapped as a keepsake for guests.",
    ar: "باقة زهور مغلّفة تذكارًا للضيوف.",
  }),
} as const satisfies Record<string, StoryPhoto>;

export type StoryPhotoKey = keyof typeof STORY_PHOTOS;

export interface StoryBeat {
  photo: StoryPhotoKey;
  title: Localized<string>;
  body: Localized<string>;
}

/** About: one evening, four beats, one team (strategy → creative → production → delivery, p3). */
export const ROOM_STORY = {
  eyebrow: { en: "From our events", ar: "من فعالياتنا" },
  title: { en: "Every detail passes through the same team.", ar: "كل تفصيلة تمرّ على الفريق نفسه." },
  beats: [
    {
      photo: "rig",
      title: { en: "The rig goes up.", ar: "يُنصب المسرح." },
      body: {
        en: "Truss, sound and light, built and tested by our crew before anything else enters the room.",
        ar: "الهياكل والصوت والإضاءة، يركّبها طاقمنا ويختبرها قبل أن يدخل القاعة أي شيء آخر.",
      },
    },
    {
      photo: "hall",
      title: { en: "The room is dressed.", ar: "تكتمل القاعة." },
      body: {
        en: "Tables, lanterns, florals and candlelight, set to one plan and one colour story.",
        ar: "الطاولات والفوانيس والزهور وضوء الشموع، على مخطّط واحد وألوان متناغمة.",
      },
    },
    {
      photo: "cart",
      title: { en: "The welcome is ready.", ar: "الضيافة جاهزة." },
      body: {
        en: "Arabic coffee, heritage carts and the menu, served in front of the guests.",
        ar: "القهوة العربية وعربات الضيافة التراثية وقائمة الطعام، تُقدَّم أمام الضيوف.",
      },
    },
    {
      photo: "buffet",
      title: { en: "The doors open.", ar: "تُفتح الأبواب." },
      body: {
        en: "The team that planned the evening runs it, until the last guest leaves.",
        ar: "الفريق الذي خطّط للأمسية يديرها بنفسه، حتى يغادر آخر ضيف.",
      },
    },
  ] satisfies StoryBeat[],
} as const;

/** Home, Our work: the strip after the three cases (a mix of wide and tall keeps the rhythm). */
export const STRIP = {
  eyebrow: { en: "From our events", ar: "من فعالياتنا" },
  title: { en: "Rooms we dressed, tables we set.", ar: "قاعات جهّزناها، وطاولات نسّقناها." },
  frames: [
    { photo: "hall", caption: { en: "Gala dinner", ar: "عشاء احتفالي" } },
    { photo: "cart", caption: { en: "Heritage hospitality", ar: "ضيافة تراثية" } },
    { photo: "table", caption: { en: "Table styling", ar: "تنسيق الطاولات" } },
    { photo: "rig", caption: { en: "Stage and technical", ar: "المسرح والتجهيزات الفنية" } },
    { photo: "florals", caption: { en: "Florals and décor", ar: "الزهور والديكور" } },
    { photo: "tent", caption: { en: "Desert majlis", ar: "مجلس في الصحراء" } },
  ] satisfies { photo: StoryPhotoKey; caption: Localized<string> }[],
} as const;

/** Events › Galas & private celebrations (#celebrations): the private client's own entry (§6.3,
 * mostly from Instagram, on a phone). Warm and direct; the brief opens preset to this service. */
export const PRIVATE_STACK = {
  label: { en: "Private celebrations", ar: "المناسبات الخاصة" },
  lead: {
    en: "A wedding, an engagement, a family evening? Tell us the date and the guest count, and we'll carry it from the first sketch to the last candle.",
    ar: "زفاف أو خطوبة أو أمسية عائلية؟ أخبرنا بالموعد وعدد الضيوف، ونتولّى كل شيء من أول تصوّر حتى آخر شمعة.",
  },
  cta: { en: "Plan your celebration", ar: "خطّط لمناسبتك معنا" },
  whatsapp: { en: "Message us on WhatsApp", ar: "راسلنا على واتساب" },
  prefill: {
    en: "Hello NO TIME, I'm planning a private celebration and would like to talk it through.",
    ar: "مرحبًا NO TIME، أخطّط لمناسبة خاصة وأودّ أن نتحدّث عنها.",
  },
  cards: [
    { photo: "florals", caption: { en: "The table, in your colours", ar: "طاولتك، بألوانك" } },
    { photo: "dessert", caption: { en: "A reception to remember", ar: "استقبال يبقى في الذاكرة" } },
    { photo: "terrace", caption: { en: "Outdoors, after sunset", ar: "في الهواء الطلق، بعد الغروب" } },
    { photo: "keepsake", caption: { en: "A keepsake for every guest", ar: "تذكار لكل ضيف" } },
  ] satisfies { photo: StoryPhotoKey; caption: Localized<string> }[],
} as const;

export const storyPhoto = (key: StoryPhotoKey): StoryPhoto => STORY_PHOTOS[key];
export const storySrc = (photo: StoryPhoto) => `/images/stories/${photo.id}.webp`;
