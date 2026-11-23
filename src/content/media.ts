import type { Grade } from "@/lib/grade";
import type { Localized } from "./types";

/**
 * The image registry (D152; docs/superpowers/specs/2026-11-21-visual-portfolio-design.md §6): one
 * record per picture the site shows. Pages, scenes and galleries name an `id`; nothing else names
 * a path. To replace a picture: put the new file in place and change its line here.
 *
 * - `source`: "rand-profile" (the 2026 company profile, docs/content/profile-inventory.md),
 *   "rand" (sent by NO TIME), "stock" (credited, licence named), "ai".
 * - `replace`: a stand-in until NO TIME sends a real photo of that moment.
 * - `randApproval`: "client-visible" (a client's logo or name shows in the picture: Rand's
 *   question 4) or "faces" (identifiable people). Listed in docs/content/images-for-rand.md.
 * - `hidden: true` hides it everywhere: its scene ends a beat earlier, its gallery closes up. A file
 *   cut or graded from a registry photo names it in `base` (or a scene slot's or service photo's
 *   `from`) and hides with it, so a photo Rand turns down leaves no crop behind (`baseHidden`).
 * - `alt: null` marks a decorative layer; every other picture has an EN and an AR alt.
 * - `spec`: what the slot needs, so whoever shoots or crops a real photo knows what to make.
 *
 * Work and case pages use only "rand-profile" and "rand" (CLAUDE.md, tested in work.test.ts).
 */
export type MediaSource = "rand-profile" | "rand" | "stock" | "ai";

export interface MediaFile {
  /** Public URL of the WebP master; next/image serves AVIF and WebP widths from it. */
  file: string;
  width: number;
  height: number;
}

export interface MediaEntry extends MediaFile {
  id: string;
  /** The 9:16 crop used below 900px (a scene plate). */
  mobile?: MediaFile;
  source: MediaSource;
  credit?: { by: string; url: string; license: "Unsplash License" | "Pexels License" };
  /** The profile image (`p9-2`) or the stock id (`unsplash:…`) it was made from. */
  from?: string;
  /** The registry photo this file was cut or graded from: hidden with it. */
  base?: string;
  replace?: boolean;
  randApproval?: "client-visible" | "faces";
  hidden?: boolean;
  /** The category grade baked into the file, when it was graded. */
  grade?: Grade;
  alt: Localized<string> | null;
  spec: string;
}

/** A curated profile photo (public/images/work/<group>/<id>.webp, D49), shown at its native size. */
const profile = (
  id: string,
  from: string,
  width: number,
  height: number,
  alt: Localized<string>,
  spec: string,
  extra: Partial<MediaEntry> = {},
): MediaEntry => ({
  id,
  file: `/images/work/${id.replace(/-\d+$/, "")}/${id}.webp`,
  width,
  height,
  source: "rand-profile",
  from,
  alt,
  spec,
  ...extra,
});

const clientVisible = { randApproval: "client-visible" } as const;

export const MEDIA: MediaEntry[] = [
  // Galas and private celebrations (profile pages 8–11): no client name, no identifiable person.
  profile("private-celebrations-1", "p9-2", 1600, 1066, {
    en: "A glass-roofed hall set with long candlelit tables under woven lanterns.",
    ar: "قاعة بسقف زجاجي، بطاولات طويلة على ضوء الشموع تحت فوانيس منسوجة.",
  }, "16:9 · a dressed hall from the aisle, tables receding to a vanishing point, warm light, no people"),
  profile("private-celebrations-2", "p9-1", 859, 1290, {
    en: "White roses and blue hydrangeas on a dressed table, lit by candles.",
    ar: "ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع.",
  }, "2:3 portrait · a floral centrepiece close, candles behind, shallow depth"),
  profile("private-celebrations-3", "p10-1", 537, 716, {
    en: "An entrance arrangement of white flowers and candles on a marble floor.",
    ar: "تنسيق زهور بيضاء وشموع عند المدخل، على أرضية رخامية.",
  }, "3:4 portrait · the entrance as the first guest sees it, candles lit"),
  profile("private-celebrations-4", "p10-5", 811, 541, {
    en: "Candles and hydrangeas along a table runner.",
    ar: "شموع وزهور كوبية على امتداد مفرش الطاولة.",
  }, "3:2 · a table runner in perspective, candles and florals, evening light"),
  profile("private-celebrations-5", "p11-1", 949, 534, {
    en: "A dessert table for a baby reception, with a candelabra and pale florals.",
    ar: "طاولة حلويات لاستقبال مولود، مع شمعدان وزهور بألوان هادئة.",
  }, "16:9 · a finished dessert table, front on, no people"),
  profile("private-celebrations-6", "p9-3", 859, 1290, {
    en: "A keepsake bouquet wrapped like a tuxedo, made for the guests.",
    ar: "باقة تذكارية ملفوفة على هيئة بدلة رسمية، صُنعت هديةً للضيوف.",
  }, "2:3 portrait · one keepsake close, plain ground"),
  profile("private-celebrations-7", "p8-5", 850, 638, {
    en: "A terrace dressed with a white floral installation among palms.",
    ar: "شرفة مزيّنة بتنسيق زهور أبيض بين أشجار النخيل.",
  }, "4:3 · an outdoor setting dressed, palms, daylight or dusk"),
  profile("private-celebrations-8", "p10-2", 953, 715, {
    en: "A stage and its truss going up in a ballroom before an event.",
    ar: "مسرح وهيكله المعدني قيد التركيب في قاعة احتفالات قبل إحدى الفعاليات.",
  }, "4:3 · the rig going up in an empty hall, crew far off and unrecognisable"),
  // Profile alternates curated for D169 (one place per photo): pages 10, 4, 26, 27, 31.
  profile("private-celebrations-9", "p10-4", 811, 541, {
    en: "Keepsakes wrapped like small blue tuxedos, tied with white ribbon.",
    ar: "تذكارات مغلّفة على شكل بدلات زرقاء صغيرة، مربوطة بشريط أبيض.",
  }, "3:2 · a styled detail close, soft light"),
  profile("private-celebrations-10", "p10-3", 537, 716, {
    en: "A centrepiece of red and orange flowers in a glass vase.",
    ar: "تنسيق زهور حمراء وبرتقالية في مزهرية زجاجية، في وسط الطاولة.",
  }, "3:4 portrait · one centrepiece close"),

  // Catering (pages 4, 25–29).
  profile("catering-1", "p28-1", 1408, 794, {
    en: "A buffet styled with crystal and gold service.",
    ar: "بوفيه منسّق بأوانٍ من الكريستال والذهب.",
  }, "16:9 · a buffet line in perspective, crystal and gold, no people"),
  profile("catering-2", "p4-1", 1247, 703, {
    en: "A long dining table with crystal glasses and florals.",
    ar: "طاولة طعام طويلة بكؤوس كريستال وزهور.",
  }, "16:9 · a long table from one end, glassware catching the light"),
  profile("catering-3", "p4-3", 1247, 702, {
    en: "A table of florals and desserts set for guests.",
    ar: "طاولة زهور وحلويات مجهّزة للضيوف.",
  }, "16:9 · a dessert and floral table, front three-quarter"),
  profile("catering-4", "p25-3", 1187, 668, {
    en: "Dessert boards styled and photographed for an event.",
    ar: "ألواح حلويات منسّقة ومصوّرة لإحدى الفعاليات.",
  }, "16:9 · styled food on boards, photographed from above or three-quarter"),
  profile("catering-5", "p26-1", 718, 759, {
    en: "A tiered silver stand of sweets carried through the room.",
    ar: "حامل فضي متعدد الطبقات للحلويات يُقدَّم بين الضيوف.",
  }, "square · service in motion, the server cropped at the torso"),
  profile("catering-6", "p27-1", 1188, 1196, {
    en: "Chilled drinks and white flowers, styled and lit for an event table.",
    ar: "مشروبات باردة وزهور بيضاء، منسّقة ومُضاءة على طاولة إحدى الفعاليات.",
  }, "square · drinks styled with florals, soft side light"),
  profile("catering-7", "p29-1", 939, 529, {
    en: "Hospitality laid out for an executive boardroom meeting.",
    ar: "ضيافة مجهّزة لاجتماع في قاعة مجلس إدارة.",
  }, "16:9 · a boardroom table with coffee service set, no people"),
  // Creative's photography strip (profile page 25 and 27 alternates, D158).
  profile("catering-8", "p25-4", 1186, 668, {
    en: "Dessert boards and cups styled for a shoot on wooden trays.",
    ar: "ألواح حلويات وأكواب منسّقة للتصوير على صوانٍ خشبية.",
  }, "16:9 · styled desserts on boards, the second set of the same shoot"),
  profile("catering-9", "p27-2", 927, 1156, {
    en: "Dessert cups topped with lilac sugar petals, set on glass saucers.",
    ar: "أكواب حلوى تعلوها بتلات سكّرية بلون الليلك، على صحون زجاجية.",
  }, "portrait · one styled dessert close, shallow depth"),
  profile("catering-10", "p4-2", 1247, 702, {
    en: "Tiered stands of savouries and desserts along a buffet.",
    ar: "حوامل متعددة الطبقات للمقبلات والحلويات على امتداد البوفيه.",
  }, "16:9 · a buffet in perspective, tiered stands, no people"),
  profile("catering-11", "p27-3", 938, 1171, {
    en: "Canapés on picks, set in a bed of moss and grasses.",
    ar: "مقبلات صغيرة على أعواد، مغروسة في طبقة من الطحالب والأعشاب.",
  }, "portrait · a styled canapé display close"),
  profile("catering-12", "p26-3", 718, 759, {
    en: "A silver tray of savoury cups with a rose, carried by a gloved server.",
    ar: "صينية فضية بأكواب مقبلات ووردة، يحملها نادل بقفازات بيضاء.",
  }, "square · service in motion, the server cropped at the torso"),
  profile("catering-13", "p26-2", 718, 759, {
    en: "A silver tray of baked savouries and roses, carried through the room.",
    ar: "صينية فضية بمخبوزات مالحة وورود، تُقدَّم بين الضيوف.",
  }, "square · service in motion, the server cropped at the torso"),

  // Heritage hospitality (pages 31–32).
  profile("heritage-1", "p31-2", 1050, 788, {
    en: "Heritage carts with brass dallahs, lit for a welcome at night.",
    ar: "عربات تراثية بدلال نحاسية، مضاءة لاستقبال الضيوف ليلًا.",
  }, "4:3 · the welcome station at night, brass catching the light, guests far off"),
  profile("heritage-2", "p31-3", 688, 516, {
    en: "Arabic coffee service set out on a carpet.",
    ar: "ضيافة القهوة العربية مصفوفة على سجادة.",
  }, "4:3 · dallah and cups on a carpet, close, warm"),
  profile("heritage-3", "p31-5", 688, 516, {
    en: "A beach majlis with low cushions facing the sea.",
    ar: "مجلس على الشاطئ بجلسات أرضية تطل على البحر.",
  }, "4:3 · a majlis outdoors, low seating, horizon"),
  profile("heritage-4", "p32-1", 956, 1275, {
    en: "A heritage cart dressed with brass vessels.",
    ar: "عربة تراثية مزيّنة بأوانٍ نحاسية.",
  }, "3:4 portrait · one cart close, brass and wood"),
  profile("heritage-5", "p31-1", 891, 668, {
    en: "A desert tent at night, carpets laid and lit from inside.",
    ar: "خيمة في الصحراء ليلًا، فُرشت بالسجاد وأُضيئت من الداخل.",
  }, "4:3 · a tent at dusk or night, lit from within, sand foreground"),
  profile("heritage-6", "p31-4", 688, 516, {
    en: "Brass coffee pots and a firewood stack laid out on a carpet in the sand.",
    ar: "دلال نحاسية وحطب مصفوف على سجادة فوق الرمل.",
  }, "4:3 · the coffee fire set out, close, warm"),

  // Gifts (pages 22–24).
  profile("gifts-1", "p23-3", 1280, 719, {
    en: "A Dubai skyline cut in gold-finished metal, made as a corporate gift.",
    ar: "أفق دبي مقصوص من معدن بلمسة ذهبية، صُنع هديةً لإحدى الشركات.",
  }, "16:9 · the finished gift on a plain ground, raking light"),
  profile("gifts-2", "p23-2", 905, 1019, {
    en: "A sports T-shirt designed for a driving institute.",
    ar: "قميص رياضي صُمّم لمعهد لتعليم القيادة.",
  }, "portrait · the garment flat or on a form, the print readable", clientVisible),

  // Named projects (pages 5, 8, 13, 19, 23): a client is visible, so Rand approves each (question 4).
  profile("uae-pro-league-1", "p5-1", 1224, 664, {
    en: "A tournament's identity printed on fabric at the venue.",
    ar: "هوية إحدى البطولات مطبوعة على القماش في موقع الحدث.",
  }, "16:9 · the event identity in place at the venue", clientVisible),
  profile("uae-pro-league-2", "p5-3", 1060, 575, {
    en: "A pre-match ceremony on the pitch, seen from the stands.",
    ar: "مراسم ما قبل المباراة على أرض الملعب، من المدرجات.",
  }, "16:9 · the ceremony wide, people far off", clientVisible),
  profile("uae-pro-league-3", "p13-3", 643, 738, {
    en: "A social media post designed for a football league's fan zone.",
    ar: "منشور لوسائل التواصل صُمّم لمنطقة المشجعين في دوري لكرة القدم.",
  }, "portrait · one real post as published", clientVisible),
  profile("uae-pro-league-4", "p13-4", 643, 738, {
    en: "A round-result post designed for a football league.",
    ar: "منشور لنتائج إحدى الجولات صُمّم لدوري لكرة القدم.",
  }, "portrait · one real post as published", clientVisible),
  profile("uae-pro-league-6", "p13-1", 680, 685, {
    en: "A grid of posts designed for a football league: results, fixtures and registration.",
    ar: "شبكة منشورات صُمّمت لدوري لكرة القدم: نتائج ومواعيد وتسجيل.",
  }, "1:1 · the league's feed as published (players and fans far off)", clientVisible),
  profile("uae-pro-league-7", "p24-1", 1008, 752, {
    en: "A black leather-finish gift box with a league's awards emblem in gold.",
    ar: "علبة هدايا سوداء بلمسة جلدية، عليها شعار حفل جوائز أحد الدوريات بالذهبي.",
  }, "4:3 · the award box, cropped clear of the profile's baked-in badge and label", clientVisible),
  profile("smith-gulf-1", "p21-1", 497, 373, {
    en: "An exhibition stand with orange frames, built for a trade show.",
    ar: "جناح معرض بإطارات برتقالية، صُنع لأحد المعارض التجارية.",
  }, "4:3 · small (497px): a strip tile only; originals wanted (OQ #21)", clientVisible),
  profile("uae-pro-league-5", "p23-4", 1280, 882, {
    en: "A corporate gift set: notebook, pen and flask in the league's colours.",
    ar: "طقم هدايا للشركات: دفتر وقلم وقارورة بألوان الدوري.",
  }, "3:2 · the set laid out, top-down or three-quarter", clientVisible),
  profile("egyptair-pavilion-1", "p19-2", 751, 501, {
    en: "An airline's exhibition pavilion with an aircraft model, at an air show.",
    ar: "جناح شركة طيران في معرض للطيران، ومعه مجسّم طائرة.",
  }, "3:2 · the pavilion wide; originals above 1600px wanted (OQ #21)", clientVisible),
  profile("sandoz-1", "p8-1", 577, 1280, {
    en: "A pharmaceutical brand's stand at a medical conference.",
    ar: "جناح لعلامة تجارية في قطاع الأدوية، في مؤتمر طبي.",
  }, "portrait · the stand front on, empty or before doors open", clientVisible),
];

/** A stock frame (public/images/stock/<id>.webp + -9x16), graded with the category's grade (D153). */
const stock = (
  id: string,
  from: string,
  by: string,
  url: string,
  width: number,
  height: number,
  mobile: [number, number] | null,
  spec: string,
  extra: Partial<MediaEntry> = {},
): MediaEntry => ({
  id,
  file: `/images/stock/${id}.webp`,
  width,
  height,
  ...(mobile ? { mobile: { file: `/images/stock/${id}-9x16.webp`, width: mobile[0], height: mobile[1] } } : {}),
  source: "stock",
  credit: { by, url, license: "Unsplash License" },
  from,
  replace: true,
  grade: "evening",
  alt: null,
  spec,
  ...extra,
});

/** Scene plates made by scripts/scene-layers.mjs (docs/content/recipes/<page>.json). */
MEDIA.push(
  {
    id: "ev-open-night",
    file: "/images/scenes/events-hospitality/ev-open-night.webp",
    width: 1600,
    height: 900,
    mobile: { file: "/images/scenes/events-hospitality/ev-open-night-9x16.webp", width: 600, height: 1066 },
    source: "rand-profile",
    from: "p9-2",
    base: "private-celebrations-1",
    grade: "evening",
    alt: null,
    spec: "16:9 + 9:16 · the dressed hall before the lights: same frame as ev-open-room, graded to night",
  },
  stock("ev-conf-rows", "unsplash:tCFbHdEIUMU", "Declan Sun", "https://unsplash.com/photos/tCFbHdEIUMU", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · a large conference hall, chairs in exact rows, nobody yet; a real NO TIME summit hall replaces it"),
  stock("ev-conf-session", "unsplash:ZXx-aoBPYuM", "Thomas Delacrétaz", "https://unsplash.com/photos/ZXx-aoBPYuM", 2400, 1350, [1080, 1919],
    "16:9 + 9:16 · a session running, the audience from behind, the stage and screen lit"),
  stock("ev-exh-hall", "unsplash:eDzZZ7bUlz8", "Julia Taubitz", "https://unsplash.com/photos/eDzZZ7bUlz8", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · an empty exhibition hall the night before doors open, bare floor, no stands or logos"),
  stock("ev-launch-spot", "unsplash:kqgC_6j6AaA", "Fujiphilm", "https://unsplash.com/photos/kqgC_6j6AaA", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · a dark stage, one pool of light, seconds before a reveal"),
  // D172: the first beams on a truss, cropped above the stage and the crowd (no people). The earlier
  // plate was a smooth light leak with no detail, an empty screen on phones as the stage entered.
  stock("ev-stage-beams", "unsplash:sol7vhs8Pdg", "Kevin Yudhistira Alloni", "https://unsplash.com/photos/sol7vhs8Pdg", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · the first beams through haze on a truss rig, no people (a NO TIME rig at first light replaces it)"),
  stock("ev-stage-live", "unsplash:euieMyZIBmY", "Andrew Haha Lee", "https://unsplash.com/photos/euieMyZIBmY", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · the full rig on, the seated audience from behind, no faces"),
  // Creative Production (docs/content/recipes/creative.json, D158): one studio, dark then lit.
  stock("cp-open-dark", "unsplash:LYcuJG5LyU8", "Arif DALKIRAN", "https://unsplash.com/photos/LYcuJG5LyU8", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · a studio before the lights: the white sweep, stands and rails, no people (a NO TIME set replaces it)",
    { grade: "studio" }),
  stock("cp-open-lit", "unsplash:LYcuJG5LyU8", "Arif DALKIRAN", "https://unsplash.com/photos/LYcuJG5LyU8", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · the same studio with its key light on; same frame as cp-open-dark", { grade: "studio" }),
  stock("cp-rental-lights", "unsplash:S6OSYUlvJxo", "Aditya Wardhana", "https://unsplash.com/photos/S6OSYUlvJxo", 1600, 900, null,
    "16:9 · lights on stands against a plain wall, no brand marks (NO TIME's own kit replaces it)", {
      grade: "studio",
      alt: { en: "LED panel lights on stands, lit against a warm wall.", ar: "ألواح إضاءة LED على حوامل، مضاءة أمام جدار دافئ." },
    }),
  // Marketing & Brand (D159): the editorial grade; no brand marks, no faces.
  stock("mb-open-desk", "unsplash:8dgFq8Vbelo", "Andy Brown", "https://unsplash.com/photos/8dgFq8Vbelo", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · a designer's desk: swatches, sketches and pens, cropped past a printed box (a NO TIME desk replaces it)",
    { grade: "editorial" }),
  stock("mb-branding", "unsplash:Dd079V8Letk", "Razvan Dumitrasconiu", "https://unsplash.com/photos/Dd079V8Letk", 1600, 900, null,
    "16:9 · blank stationery and an envelope, ready for an identity (NO TIME's printed identity work replaces it)", {
      grade: "editorial",
      alt: { en: "Blank cards and a brown envelope laid out on a pale table.", ar: "بطاقات بيضاء وظرف بنّي مرتّبة على طاولة فاتحة." },
    }),
  stock("mb-digital", "unsplash:ppjk8kso8RE", "Kaleidico", "https://unsplash.com/photos/ppjk8kso8RE", 1600, 900, null,
    "16:9 · hands at a laptop on a meeting table, no legible data", {
      grade: "editorial",
      alt: { en: "Hands at a laptop on a meeting table, beside a glass of coffee.", ar: "يدان على حاسوب محمول فوق طاولة اجتماعات، بجانب كوب قهوة." },
    }),
  stock("mb-content", "unsplash:1c-YonlQjUE", "Vitaly Gariev", "https://unsplash.com/photos/1c-YonlQjUE", 1600, 900, null,
    "16:9 · a plan on sticky notes on a studio wall, seen from behind", {
      grade: "editorial",
      alt: { en: "A planner sorting sticky notes on a dark studio wall.", ar: "شخص يرتّب أوراقًا لاصقة على جدار داكن في استوديو." },
    }),
  stock("mb-pr", "unsplash:J0M-W7EOjrY", "Mathias Reding", "https://unsplash.com/photos/J0M-W7EOjrY", 1600, 900, null,
    "16:9 · newspapers on a table by a window, no legible mastheads", {
      grade: "editorial",
      alt: { en: "Folded newspapers and magazines on a wooden table by a window.", ar: "صحف ومجلات مطويّة على طاولة خشبية بجانب نافذة." },
    }),
  stock("mb-paid", "unsplash:bmUa09zy2ZQ", "Gabrielle Henderson", "https://unsplash.com/photos/bmUa09zy2ZQ", 1600, 900, null,
    "16:9 · a phone in hand scrolling a feed at a desk", {
      grade: "editorial",
      alt: { en: "Hands scrolling a social feed on a phone at a desk.", ar: "يدان تتصفّحان منشورات على هاتف فوق مكتب." },
    }),
  // Production, Print & Gifts (D160): the workshop grade; no brand marks, no faces.
  stock("pg-open-materials", "unsplash:0vvoSlCtWTg", "Debby Hudson", "https://unsplash.com/photos/0vvoSlCtWTg", 2400, 1350, null,
    "16:9 · twine, ribbon spools and a kraft tag on a pale bench (NO TIME's own materials replace it)", { grade: "workshop" }),
  stock("pg-open-press", "unsplash:KAO2-CRZXTE", "Geri Sakti", "https://unsplash.com/photos/KAO2-CRZXTE", 2400, 1350, [1080, 1920],
    "16:9 + 9:16 · a large-format printer running sheets (NO TIME's print partner's floor replaces it)", { grade: "workshop" }),
  stock("pg-printing", "unsplash:7l7DLynLVIY", "Scarbor Siu", "https://unsplash.com/photos/7l7DLynLVIY", 1600, 900, null,
    "16:9 · a printed banner hung in a bright hall, no text", {
      grade: "workshop",
      alt: { en: "A large printed banner hanging in a bright hall.", ar: "لافتة مطبوعة كبيرة معلّقة في قاعة مضيئة." },
    }),
  stock("pg-fabrication", "unsplash:Onty3BSYdGU", "Brett Jordan", "https://unsplash.com/photos/Onty3BSYdGU", 1600, 900, null,
    "16:9 · a carpentry workshop: timber, a saw and tools, no people", {
      grade: "workshop",
      alt: { en: "A carpentry workshop with timber boards, a mitre saw and tools.", ar: "ورشة نجارة فيها ألواح خشب ومنشار وأدوات." },
    }),
);

/** Software & Digital: one device photograph per service (Task C2, D161; docs/content/recipes/software.json). */
MEDIA.push(
  stock("sw-websites", "unsplash:3JTi3cg1s0Y", "Nat", "https://unsplash.com/photos/3JTi3cg1s0Y", 1400, 1050, null,
    "4:3 · a laptop showing code on a dark desk, no legible brand", {
      alt: { en: "A laptop showing code on a dark desk at night.", ar: "حاسوب محمول يعرض شيفرة برمجية على مكتب داكن ليلًا." },
    }),
  stock("sw-apps", "unsplash:hTck7keIHK4", "Penfer", "https://unsplash.com/photos/hTck7keIHK4", 1400, 1050, null,
    "4:3 · a phone resting on a laptop, lock screen only", {
      alt: { en: "A phone resting on an open laptop in low light.", ar: "هاتف موضوع على حاسوب محمول مفتوح في إضاءة خافتة." },
    }),
  stock("sw-systems", "unsplash:B93kPaspXcA", "Josh Sorenson", "https://unsplash.com/photos/B93kPaspXcA", 1400, 1050, null,
    "4:3 · two monitors with dashboards at a desk, no legible data", {
      alt: { en: "Two monitors with dashboards on a desk, lit in teal.", ar: "شاشتان تعرضان لوحات بيانات على مكتب بإضاءة فيروزية." },
    }),
  stock("sw-ecommerce", "unsplash:MGaFENpDCsw", "Bench Accounting", "https://unsplash.com/photos/MGaFENpDCsw", 1400, 1050, null,
    "4:3 · an order packed at a bright table, the face out of frame", {
      alt: { en: "Hands packing an online order in a box at a bright table.", ar: "يدان تغلّفان طلبًا إلكترونيًا في صندوق على طاولة مضيئة." },
    }),
  stock("sw-ux", "unsplash:sv8oOQaUb-o", "Amélie Mourichon", "https://unsplash.com/photos/sv8oOQaUb-o", 1400, 1050, null,
    "4:3 · app wireframes sketched on paper, a hand with a pen", {
      alt: { en: "App wireframes sketched in pen on paper.", ar: "مخططات أولية لتطبيق مرسومة بالقلم على الورق." },
    }),
  stock("sw-ai", "unsplash:26MJGnCM0Wc", "Kaleidico", "https://unsplash.com/photos/26MJGnCM0Wc", 1400, 1050, null,
    "4:3 · a process mapped on a whiteboard, hands only", {
      alt: { en: "A workflow being mapped on a whiteboard with markers.", ar: "مسار عمل يُرسم على سبورة بيضاء بالأقلام." },
    }),
  stock("sw-event-tech", "unsplash:yz3N50D9uy4", "Compagnons", "https://unsplash.com/photos/yz3N50D9uy4", 1400, 1050, null,
    "4:3 · hands on a rugged tablet on an event floor, no faces", {
      alt: { en: "Hands using a rugged tablet on an event floor.", ar: "يدان تستخدمان جهازًا لوحيًا متينًا في أرض فعالية." },
    }),
  // The product pages (Task 14, D162): the place each problem happens, behind the problem line.
  // Decorative (the screens and the copy say what it is); no faces, no brand marks.
  stock("pp-minute-zero", "unsplash:MLLmIskI6LU", "Joshua Ferrer", "https://unsplash.com/photos/MLLmIskI6LU", 1600, 1066, null,
    "3:2 · the way in to a venue at night, lit path to an open door, no faces, no signs"),
  stock("pp-peak-hour", "unsplash:boaDpmC-_Xo", "Fabrizio Magoni", "https://unsplash.com/photos/boaDpmC-_Xo", 1600, 1067, null,
    "3:2 · a kitchen pass at service, hands plating, no faces"),
);

/**
 * Creative and Print (D169; docs/content/recipes/creative-print-d169.json): the openings' frames and
 * the service stills, each its own stock photo; Rand's pieces and shoots show on Work.
 */
MEDIA.push(
  stock("cp-video", "unsplash:yk9VXp4W5-Q", "Peter Stumpf", "https://unsplash.com/photos/yk9VXp4W5-Q", 1600, 900, null,
    "16:9 · an edit timeline on a monitor, close, no legible brand", {
      grade: "studio",
      alt: { en: "An edit timeline on a monitor, clips in blue and violet.", ar: "خط زمني لمونتاج فيديو على شاشة، بمقاطع زرقاء وبنفسجية." },
    }),
  stock("cp-motion", "unsplash:s-OgEgolTCI", "Creatvise", "https://unsplash.com/photos/s-OgEgolTCI", 1600, 900, null,
    "16:9 · an abstract 3D object, soft light, no text", {
      grade: "studio",
      alt: { en: "An abstract 3D form in violet and white, softly lit.", ar: "شكل ثلاثي الأبعاد مجرّد بالبنفسجي والأبيض، بإضاءة ناعمة." },
    }),
  stock("cp-photography", "pexels:8857044", "Ron Lach", "https://www.pexels.com/photo/a-camera-set-up-for-food-photography-8857044/", 1600, 900, null,
    "16:9 · a camera shooting a plated dish on a set, no faces", {
      grade: "studio",
      credit: { by: "Ron Lach", url: "https://www.pexels.com/photo/a-camera-set-up-for-food-photography-8857044/", license: "Pexels License" },
      alt: { en: "A camera on a rig above a dish on a board, on a studio set.", ar: "كاميرا على حامل فوق طبق على لوح تقديم، في موقع تصوير." },
    }),
  stock("cp-set-stage", "pexels:29858811", "Martin de Arriba", "https://www.pexels.com/photo/empty-theater-stage-with-ladders-and-equipment-29858811/", 1600, 900, null,
    "16:9 · an empty stage being set up, the crew far off", {
      grade: "studio",
      credit: { by: "Martin de Arriba", url: "https://www.pexels.com/photo/empty-theater-stage-with-ladders-and-equipment-29858811/", license: "Pexels License" },
      alt: { en: "An empty stage with ladders and kit, being readied.", ar: "مسرح خالٍ بسلالم ومعدّات، قيد التجهيز." },
    }),
  stock("cp-ai", "pexels:7147722", "Michael Burrows", "https://www.pexels.com/photo/unrecognizable-artist-drawing-creative-sketch-7147722/", 1600, 900, null,
    "16:9 · a stylus over a tablet, hands only", {
      grade: "studio",
      credit: { by: "Michael Burrows", url: "https://www.pexels.com/photo/unrecognizable-artist-drawing-creative-sketch-7147722/", license: "Pexels License" },
      alt: { en: "A hand sketching on a tablet with a stylus.", ar: "يد ترسم على جهاز لوحي بقلم رقمي." },
    }),
  stock("cp-frame", "pexels:6584788", "Eva Bronzini", "https://www.pexels.com/photo/quail-egg-in-bowls-6584788/", 1600, 900, null,
    "16:9 · a styled still life on a white sweep", {
      grade: "studio",
      credit: { by: "Eva Bronzini", url: "https://www.pexels.com/photo/quail-egg-in-bowls-6584788/", license: "Pexels License" },
    }),
  stock("pg-packaging", "pexels:9594423", "Ron Lach", "https://www.pexels.com/photo/brown-cardboard-box-on-white-table-9594423/", 1600, 900, null,
    "16:9 · kraft boxes on a pale table, no print (NO TIME's own packaging replaces it)", {
      grade: "workshop",
      credit: { by: "Ron Lach", url: "https://www.pexels.com/photo/brown-cardboard-box-on-white-table-9594423/", license: "Pexels License" },
      alt: { en: "A plain kraft box on a pale surface.", ar: "علبة من الورق المقوّى البنّي على سطح فاتح." },
    }),
  stock("pg-gifts", "pexels:8250924", "PNW Production", "https://www.pexels.com/photo/pen-and-notebook-8250924/", 1600, 900, null,
    "16:9 · a leather notebook and a pen, close, no brand", {
      grade: "workshop",
      credit: { by: "PNW Production", url: "https://www.pexels.com/photo/pen-and-notebook-8250924/", license: "Pexels License" },
      alt: { en: "A yellow leather notebook with a black pen.", ar: "دفتر جلدي أصفر بجانبه قلم أسود." },
    }),
  stock("pg-merch", "pexels:9869067", "Brando Ltd", "https://www.pexels.com/photo/plain-tote-bag-9869067/", 1600, 900, null,
    "16:9 · a blank tote bag, ready for a print", {
      grade: "workshop",
      credit: { by: "Brando Ltd", url: "https://www.pexels.com/photo/plain-tote-bag-9869067/", license: "Pexels License" },
      alt: { en: "A blank cotton tote bag against a grey wall.", ar: "حقيبة قماشية خالية من الطباعة أمام جدار رمادي." },
    }),
  stock("pg-frame", "pexels:15838158", "Coppertist Wu", "https://www.pexels.com/photo/golden-dragon-tail-15838158/", 1600, 900, null,
    "16:9 · a gold sculptural piece on a white counter", {
      grade: "workshop",
      credit: { by: "Coppertist Wu", url: "https://www.pexels.com/photo/golden-dragon-tail-15838158/", license: "Pexels License" },
    }),
);

/**
 * The Events scenes' framed photos (D169; docs/content/recipes/events-d169.json): their own stock
 * frames, graded Evening, where Rand's photos now show on Home, About and the Work pages. Decorative.
 */
MEDIA.push(
  stock("ev-entrance", "unsplash:kqPRRRAFs10", "Jennifer Kalenberg", "https://unsplash.com/photos/kqPRRRAFs10", 1200, 1600, null,
    "3:4 · a floral arrangement with candles at an entrance, no people"),
  stock("ev-break", "unsplash:dPGrexR20CE", "Ahmet Yüksek", "https://unsplash.com/photos/dPGrexR20CE", 1600, 1067, null,
    "3:2 · coffee and cake set for a break, florals, no people"),
  stock("ev-stand", "unsplash:IIavGesRDcc", "Declan Sun", "https://unsplash.com/photos/IIavGesRDcc", 1200, 1600, null,
    "3:4 · a built stand: curved timber slats and a round seat, no logo (a NO TIME stand replaces it)"),
  stock("ev-pavilion", "unsplash:--202fwufNQ", "Mockaps", "https://unsplash.com/photos/--202fwufNQ", 1600, 1067, null,
    "3:2 · a blank stand with its counter, ready for a brand (a NO TIME pavilion replaces it)"),
  stock("ev-moment", "unsplash:mU2qHI5EXas", "Sergi Brylev", "https://unsplash.com/photos/mU2qHI5EXas", 1600, 1067, null,
    "3:2 · confetti and beams over a crowd in silhouette, no faces"),
  stock("ev-runner", "unsplash:XRzEwQN1vQs", "Steven Van Elk", "https://unsplash.com/photos/XRzEwQN1vQs", 1600, 1067, null,
    "3:2 · candles in glass along a table, florals above"),
  stock("ev-roses", "unsplash:WKMEVVgmB-M", "Skye Studios", "https://unsplash.com/photos/WKMEVVgmB-M", 1080, 1920, null,
    "9:16 · white roses and greenery on a table, close"),
  stock("ev-tent", "unsplash:py8P4qr1f-8", "SAMI7", "https://unsplash.com/photos/py8P4qr1f-8", 1600, 1067, null,
    "3:2 · a desert camp at night, tents lit by a fire"),
  stock("ev-majlis-phone", "unsplash:QpPDH5yeGFo", "AmirHadi Manavi Moghadam", "https://unsplash.com/photos/QpPDH5yeGFo", 1080, 1920, null,
    "9:16 · brass dallahs in a row, close, warm"),
  stock("ev-coffee", "unsplash:Iq5k2I-VLqw", "yaz00ne alani", "https://unsplash.com/photos/Iq5k2I-VLqw", 1600, 1067, null,
    "3:2 · two brass dallahs on a tray, night"),
  stock("ev-dates", "unsplash:URncnSvN6Kw", "L Photography", "https://unsplash.com/photos/URncnSvN6Kw", 1600, 1067, null,
    "3:2 · dates in a woven basket beside a dallah, sadu weave behind"),
  stock("ev-rig", "unsplash:rnpSVkbmf6c", "boris misevic", "https://unsplash.com/photos/rnpSVkbmf6c", 1600, 1067, null,
    "3:2 · a lighting truss with moving heads, beams through haze"),
);

/**
 * The category cards and the menu (D169): their own stock frames, graded like their category, so
 * no profile photo shows twice (docs/content/recipes/home.json). Decorative: the card names it.
 */
MEDIA.push(
  stock("card-events", "unsplash:7K67WDBrcIs", "Lucas T Photography", "https://unsplash.com/photos/7K67WDBrcIs", 1200, 1500, null,
    "4:5 · a dressed banquet room, round tables and chandeliers, no people (a NO TIME room replaces it)"),
  stock("card-creative", "unsplash:HuNenPCNG84", "Jakob Owens", "https://unsplash.com/photos/HuNenPCNG84", 1200, 1500, null,
    "4:5 · a cinema camera on its rig under coloured light, no brand mark", { grade: "studio" }),
  stock("card-print", "unsplash:c7ep_zsHDk4", "Ilie Barna", "https://unsplash.com/photos/c7ep_zsHDk4", 1200, 1500, null,
    "4:5 · one wrapped gift box with a ribbon bow, whole in frame (a NO TIME gift replaces it)", { grade: "workshop" }),
  stock("card-software", "unsplash:v-jFS1AsHXo", "Jakub Żerdzicki", "https://unsplash.com/photos/v-jFS1AsHXo", 1200, 1500, null,
    "4:5 · code on a screen beside a lit keyboard, no legible brand"),
  stock("menu-events", "unsplash:fotUgiCbngk", "Matt Benson", "https://unsplash.com/photos/fotUgiCbngk", 1200, 1500, null,
    "4:5 · a table set with gold chargers and blue napkins, gold chairs, no people", {
      alt: {
        en: "A banquet table set with gold chargers, blue napkins and gold chairs.",
        ar: "طاولة مأدبة بأطباق تقديم ذهبية ومناديل زرقاء وكراسٍ ذهبية.",
      },
    }),
);

/**
 * Photo stories (D109; About's evening, Home's strip): Evening-graded copies of profile photos
 * (public/images/stories/, scripts/grade-stories.mjs). Each copies its profile entry (alt, size,
 * source, `hidden`), so hiding the original hides the copy too.
 */
export const STORY_BASE = {
  // About's evening (ROOM_STORY).
  "st-rig": "private-celebrations-8",
  "st-hall": "private-celebrations-5",
  "st-cart": "heritage-4",
  "st-buffet": "catering-1",
  // Home's strip (STRIP). No photo is in both, nor anywhere else on the site (D169).
  "st-gala": "private-celebrations-3",
  "st-display": "catering-10",
  "st-table": "catering-2",
  "st-service": "catering-12",
  "st-florals": "private-celebrations-2",
  "st-tent": "heritage-5",
} as const;
for (const [id, base] of Object.entries(STORY_BASE)) {
  const b = MEDIA.find((e) => e.id === base);
  if (!b) throw new Error(`media: story ${id} has no profile entry ${base}`);
  MEDIA.push({ ...b, id, base, file: `/images/stories/${id}.webp`, grade: "evening", spec: `${b.spec} · the Evening-graded copy for photo stories` });
}

/** Ids hidden by the environment (tests: NEXT_PUBLIC_MEDIA_HIDE=a,b). */
const ENV_HIDE = (process.env.NEXT_PUBLIC_MEDIA_HIDE ?? "").split(",").filter(Boolean);

/** Looks an id up in a list; hidden entries (or ids in `hide`) are absent unless `includeHidden`. */
export function pick(list: MediaEntry[], id: string, opts: { includeHidden?: boolean; hide?: string[] } = {}): MediaEntry | undefined {
  const m = list.find((e) => e.id === id);
  if (!m || opts.includeHidden) return m;
  if (m.hidden || (opts.hide ?? ENV_HIDE).includes(id)) return undefined;
  return m.base && !pick(list, m.base, opts) ? undefined : m;
}

/** The entry a page shows, or undefined when it's hidden or unknown (fill or hide, D78). */
export const media = (id: string) => pick(MEDIA, id);
/** Every entry, hidden or not (tooling: images-for-rand). */
export const mediaAll = (id: string) => pick(MEDIA, id, { includeHidden: true });

/** True when `id` is a registry photo that is hidden: a file made from it must not show either. */
export const baseHidden = (id: string | undefined) => !!id && !!mediaAll(id) && !media(id);

/** The entries a gallery shows, in order: the visible ones, or none when fewer than `min` remain (D78). */
export function visibleMedia(ids: readonly string[], min: number, lookup: (id: string) => MediaEntry | undefined = media): MediaEntry[] {
  const shown = ids.flatMap((id) => lookup(id) ?? []);
  return shown.length >= min ? shown : [];
}
