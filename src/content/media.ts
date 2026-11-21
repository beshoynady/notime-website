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
 * - `hidden: true` hides it everywhere: its scene ends a beat earlier, its gallery closes up.
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
    ar: "جناح لعلامة دوائية في مؤتمر طبي.",
  }, "portrait · the stand front on, empty or before doors open", clientVisible),
];

/** Ids hidden by the environment (tests: NEXT_PUBLIC_MEDIA_HIDE=a,b). */
const ENV_HIDE = (process.env.NEXT_PUBLIC_MEDIA_HIDE ?? "").split(",").filter(Boolean);

/** Looks an id up in a list; hidden entries (or ids in `hide`) are absent unless `includeHidden`. */
export function pick(list: MediaEntry[], id: string, opts: { includeHidden?: boolean; hide?: string[] } = {}): MediaEntry | undefined {
  const m = list.find((e) => e.id === id);
  if (!m || opts.includeHidden) return m;
  return m.hidden || (opts.hide ?? ENV_HIDE).includes(id) ? undefined : m;
}

/** The entry a page shows, or undefined when it's hidden or unknown (fill or hide, D78). */
export const media = (id: string) => pick(MEDIA, id);
/** Every entry, hidden or not (tooling: images-for-rand). */
export const mediaAll = (id: string) => pick(MEDIA, id, { includeHidden: true });
