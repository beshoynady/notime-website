import { WORK_NAMED } from "@/config/work";
import type { MarketKey } from "./markets";
import { media, visibleMedia, type MediaEntry } from "./media";
import type { CategorySlug, Localized } from "./types";

/**
 * Work (D78 §6, approved 2026-11-09). Real facts from docs/content/case-studies.md. Until a client
 * approves its name (`WORK_NAMED`), the case shows a description instead of the name; its picture is
 * its own cover photo (D150, D164: the client shows in it, so Rand approves it). Never a stand-in
 * photo: no AI or stock image may stand in for a real project (D106).
 */
export type WorkKey = keyof typeof WORK_NAMED;

export interface WorkItem {
  key: WorkKey;
  /** The case page's path (`/work/<slug>`): stable and anonymous, so it survives the named switch. */
  slug: string;
  /** The first is the case's home; the rest list it as related work. */
  categories: CategorySlug[];
  /** Where the work took place (the Work index's market filter, D88). Only what the profile states. */
  markets: MarketKey[];
  anonymous: { label: Localized<string>; summary: Localized<string> };
  named: { label: Localized<string>; summary: Localized<string> };
  /**
   * The case's own photo on its card and page (a registry id, media.ts), shown named or not: the client is visible
   * in it, so Rand approves it (`randApproval`, D150), but the text stays anonymous until `WORK_NAMED`.
   */
  cover: string;
  /** The case page (F1). Written without the client's name, so it reads true in both versions. */
  story: WorkStory;
}

/**
 * Challenge → Idea → Execution → Result (case-studies.md). A part the profile doesn't support is
 * left out and its section is hidden (fill or hide, D78): most Challenges, Ideas and Results are
 * still `{{TODO}}` there. Figures only with their scope.
 */
export interface WorkStory {
  /** Key facts beside the client line: what we were, and where. */
  facts: { label: Localized<string>; value: Localized<string> }[];
  challenge?: Localized<string>;
  idea?: Localized<string>;
  execution: { lead: Localized<string>; points: Localized<string[]> };
  result?: { lead: Localized<string>; figures?: { value: Localized<string>; label: Localized<string> }[]; scope?: Localized<string> };
  /** Services in scope, by service slug: the scope block links each to its section. */
  scope: string[];
}

/** Folders of curated client photos that show a client's brand (profile-inventory.md audit). */
export const BRANDED_PHOTO_DIRS = ["/images/work/egyptair-pavilion/", "/images/work/uae-pro-league/"] as const;

/** Words that identify a client; none may appear in an anonymised case. */
export const CLIENT_NAMES = ["UAE Pro League", "Pro League", "EgyptAir", "Egypt Air", "ADIB", "Sandoz", "Smith Gulf", "مصر للطيران", "دوري المحترفين", "ساندوز"] as const;

export const workItems: WorkItem[] = [
  {
    key: "egyptair",
    slug: "airline-exhibition-pavilion",
    cover: "egyptair-pavilion-1",
    categories: ["events-hospitality", "marketing-brand"],
    markets: ["ae"],
    anonymous: {
      label: { en: "A national airline", ar: "شركة طيران وطنية" },
      summary: {
        en: "Stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market.",
        ar: "صمّمنا الجناح وبنيناه، وأدرنا علاقاته العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي.",
      },
    },
    named: {
      label: { en: "EgyptAir", ar: "مصر للطيران" },
      summary: {
        en: "EgyptAir's pavilion: stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market.",
        ar: "جناح مصر للطيران: تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي.",
      },
    },
    // p19. Challenge, Idea and Result are {{TODO}}: hidden. The press-headlines line stays off (OQ #19).
    story: {
      facts: [
        { label: { en: "Our role", ar: "دورنا" }, value: { en: "Stand design, build and on-site PR", ar: "تصميم الجناح وبناؤه وعلاقاته العامة" } },
        { label: { en: "Shows", ar: "المعارض" }, value: { en: "Dubai Airshow · Arabian Travel Market", ar: "معرض دبي للطيران · سوق السفر العربي" } },
      ],
      execution: {
        lead: {
          en: "From the first drawing to the show floor: we designed the stand, built it, and ran its PR while the doors were open.",
          ar: "من أول رسم حتى أرض المعرض: صمّمنا الجناح، وبنيناه، وأدرنا علاقاته العامة طوال أيام الحدث.",
        },
        points: {
          en: ["Stand design", "Stand build", "PR on the show floor", "The media coverage that follows"],
          ar: ["تصميم الجناح", "بناء الجناح", "العلاقات العامة في أرض الحدث", "التغطية الإعلامية التي تليه"],
        },
      },
      scope: ["exhibitions-booths", "stand-fabrication-signage", "public-relations"],
    },
  },
  {
    key: "uaepl",
    slug: "football-league-events-awards",
    cover: "uae-pro-league-2",
    categories: ["events-hospitality", "production-print-gifts", "marketing-brand"],
    markets: ["ae"],
    anonymous: {
      label: { en: "A national football league", ar: "دوري كرة قدم وطني" },
      summary: {
        en: "Tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets.",
        ar: "هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، ومعها محتوى الدوري على منصّاته، وتغليف الجوائز، وأطقم الهدايا.",
      },
    },
    named: {
      label: { en: "UAE Pro League", ar: "رابطة دوري المحترفين الإماراتي" },
      summary: {
        en: "Full event delivery for the UAE Pro League: tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets.",
        ar: "تنفيذ متكامل لفعاليات دوري المحترفين الإماراتي: هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا.",
      },
    },
    // p5, p13, p23–24. Challenge, Idea and Result are {{TODO}}: hidden. No edition year (unconfirmed).
    story: {
      facts: [
        { label: { en: "Our role", ar: "دورنا" }, value: { en: "Event delivery, content and gifts", ar: "تنفيذ الفعاليات والمحتوى والهدايا" } },
        { label: { en: "Occasions", ar: "المناسبات" }, value: { en: "Tournaments and award nights", ar: "البطولات وحفلات التكريم" } },
      ],
      execution: {
        lead: {
          en: "The league's big days in one team's hands, from the tournament identity to the boxes the awards arrive in.",
          ar: "أيام الدوري الكبرى في يد فريق واحد، من هوية البطولة حتى العلب التي تصل فيها الجوائز.",
        },
        points: {
          en: [
            "Tournament branding, including a sponsors' tournament identity",
            "On-ground production, including a pre-match ceremony",
            "Award ceremonies and sponsor activations",
            "Social content for the league: fan zone and round-result posts",
            "Award packaging and a branded corporate gift set",
          ],
          ar: [
            "هوية البطولات، ومنها هوية بطولة للرعاة",
            "الإنتاج في أرض الحدث، ومنه مراسم ما قبل المباراة",
            "حفلات التكريم وتفعيلات الرعاة",
            "محتوى الدوري على منصّاته: منشورات منطقة المشجعين ونتائج الجولات",
            "تغليف الجوائز، وطقم هدايا مؤسسية يحمل هوية الدوري",
          ],
        },
      },
      scope: ["branding-identity", "stage-technical-production", "product-launches-activations", "social-media-management", "packaging-design", "corporate-gifts"],
    },
  },
];

export type WorkView = { key: WorkKey; slug: string; named: boolean; label: Localized<string>; summary: Localized<string> };

/** The version a page shows: named only with the client's approval (`WORK_NAMED`). */
export function workView(w: WorkItem, named: boolean = WORK_NAMED[w.key]): WorkView {
  return named
    ? { key: w.key, slug: w.slug, named, label: w.named.label, summary: w.named.summary }
    : { key: w.key, slug: w.slug, named, label: w.anonymous.label, summary: w.anonymous.summary };
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return workItems.find((w) => w.slug === slug);
}

/** The case after this one, wrapping around: the case page's "Next case". */
export function nextWork(w: WorkItem): WorkItem {
  return workItems[(workItems.indexOf(w) + 1) % workItems.length];
}

/**
 * Collections (Task 15, D164): NO TIME's own photos of one kind of work, from the 2026 profile, each
 * at `/work/<slug>` beside the cases. No client and no story, so nothing to name or claim: the
 * summary says only what the photos show. Markets stay empty (the profile doesn't say where).
 */
export interface WorkCollection {
  slug: string;
  categories: CategorySlug[];
  markets: MarketKey[];
  label: Localized<string>;
  summary: Localized<string>;
  /** Registry ids (media.ts), in gallery order; the first one shown is the cover. */
  photos: string[];
  /** Home's third Real-projects tile (D164: the approved move of «قاعات جهّزناها»). */
  home?: true;
}

/** Below this many visible photos a collection hides (fill or hide, D78). */
export const COLLECTION_MIN_PHOTOS = 4;


export const workCollections: WorkCollection[] = [
  {
    slug: "rooms-we-dressed",
    home: true,
    categories: ["events-hospitality"],
    markets: [],
    label: { en: "Rooms we dressed", ar: "قاعات جهّزناها" },
    summary: {
      en: "Halls and tables we dressed for private celebrations: candlelight, flowers, the entrance, and the stage going up before the doors open.",
      ar: "قاعات وطاولات جهّزناها لحفلات ومناسبات خاصة: الشموع والزهور والمدخل، والمسرح قبل أن تُفتح الأبواب.",
    },
    photos: ["private-celebrations-4", "private-celebrations-6", "private-celebrations-7", "private-celebrations-9", "private-celebrations-10"],
  },
  {
    slug: "heritage-hospitality",
    categories: ["events-hospitality"],
    markets: [],
    label: { en: "Heritage hospitality we set up", ar: "ضيافة تراثية جهّزناها" },
    summary: {
      en: "Heritage carts with brass dallahs, Arabic coffee laid out on a carpet, a majlis facing the sea and a desert tent lit from inside.",
      ar: "عربات ضيافة تراثية بدلال نحاسية، وقهوة عربية على السجاد، ومجلس يطلّ على البحر، وخيمة في الصحراء مضاءة من الداخل.",
    },
    photos: ["heritage-1", "heritage-2", "heritage-3", "heritage-6"],
  },
  {
    slug: "buffets-and-tables",
    categories: ["events-hospitality"],
    markets: [],
    label: { en: "Buffets and tables we styled", ar: "بوفيهات وطاولات نسّقناها" },
    summary: {
      en: "Buffets set with crystal and gold, dessert tables for occasions, and hospitality laid out for a boardroom meeting.",
      ar: "بوفيهات بالكريستال والذهبي، وطاولات حلويات للمناسبات، وضيافة لاجتماع مجلس إدارة.",
    },
    photos: ["catering-3", "catering-4", "catering-5", "catering-7", "catering-11"],
  },
  {
    slug: "gifts-for-companies",
    categories: ["production-print-gifts"],
    markets: [],
    label: { en: "Gifts we made for companies", ar: "هدايا صنعناها للشركات" },
    summary: {
      en: "A Dubai skyline in gold-finished metal, a desk gift set, an awards box and a sports T-shirt, each made for a company.",
      ar: "أفق دبي من معدن بلمسة ذهبية، وطقم هدايا مكتبية، وعلبة جوائز، وقميص رياضي، صُنع كلٌّ منها لإحدى الشركات.",
    },
    photos: ["gifts-1", "uae-pro-league-5", "uae-pro-league-7", "gifts-2"],
  },
];

/** The photos a collection shows, in order; undefined when fewer than four are visible (D78). */
export function collectionPhotos(c: WorkCollection, lookup: (id: string) => MediaEntry | undefined = media): MediaEntry[] | undefined {
  const shown = visibleMedia(c.photos, COLLECTION_MIN_PHOTOS, lookup);
  return shown.length ? shown : undefined;
}

export function visibleCollections(lookup: (id: string) => MediaEntry | undefined = media): WorkCollection[] {
  return workCollections.filter((c) => collectionPhotos(c, lookup));
}

/** A collection a page can show: known and not hidden. */
export function getCollectionBySlug(slug: string): WorkCollection | undefined {
  const c = workCollections.find((x) => x.slug === slug);
  return c && collectionPhotos(c) ? c : undefined;
}

/** What `/work/<slug>` shows: a case, a collection, or nothing (404). */
export function resolveWorkSlug(slug: string): { item: WorkItem; collection?: never } | { item?: never; collection: WorkCollection } | undefined {
  const item = getWorkBySlug(slug);
  if (item) return { item };
  const collection = getCollectionBySlug(slug);
  return collection && { collection };
}

/** One card on the Work index and on home: a case (in the version WORK_NAMED allows) or a collection. */
export interface WorkCard {
  slug: string;
  kind: "case" | "collection";
  categories: CategorySlug[];
  markets: MarketKey[];
  label: Localized<string>;
  summary: Localized<string>;
  /** Hidden or unknown leaves the card as text. */
  cover?: MediaEntry;
  /** A collection home shows after the cases. */
  home?: true;
}

/** The Work index's list: the cases first, then the collections that have enough photos. */
export function workCards(lookup: (id: string) => MediaEntry | undefined = media): WorkCard[] {
  return [
    ...workItems.map((w): WorkCard => {
      const v = workView(w);
      return { slug: w.slug, kind: "case", categories: w.categories, markets: w.markets, label: v.label, summary: v.summary, cover: lookup(w.cover) };
    }),
    ...workCollections.flatMap((c): WorkCard[] => {
      const shown = collectionPhotos(c, lookup);
      return shown ? [{ slug: c.slug, kind: "collection", categories: c.categories, markets: c.markets, label: c.label, summary: c.summary, cover: shown[0], home: c.home }] : [];
    }),
  ];
}
