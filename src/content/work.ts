import { WORK_NAMED } from "@/config/work";
import type { MarketKey } from "./markets";
import type { DrawingKey } from "./service-visuals";
import type { CategorySlug, Localized } from "./types";

/**
 * Work (D78 §6, approved 2026-11-09). Real facts from docs/content/case-studies.md. Until a client
 * approves its name (`WORK_NAMED`), the case shows a description instead of the name, and a drawing
 * of the work instead of its own photos, which all show the client's brand. Never a stand-in photo:
 * no AI or stock image may stand in for a real project (D106).
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
  anonymous: { label: Localized<string>; summary: Localized<string>; visual: DrawingKey };
  named: { label: Localized<string>; summary: Localized<string>; photos: string[] };
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
export const CLIENT_NAMES = ["UAE Pro League", "Pro League", "EgyptAir", "Egypt Air", "ADIB", "مصر للطيران", "دوري المحترفين"] as const;

const photos = (dir: string, n: number) => Array.from({ length: n }, (_, i) => `${dir}${dir.split("/").at(-2)}-${i + 1}.webp`);

export const workItems: WorkItem[] = [
  {
    key: "egyptair",
    slug: "airline-exhibition-pavilion",
    categories: ["events-hospitality", "marketing-brand"],
    markets: ["ae"],
    anonymous: {
      label: { en: "A national airline", ar: "شركة طيران وطنية" },
      summary: {
        en: "Stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market.",
        ar: "صمّمنا الجناح وبنيناه، وأدرنا علاقاته العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي.",
      },
      visual: "stand",
    },
    named: {
      label: { en: "EgyptAir", ar: "مصر للطيران" },
      summary: {
        en: "EgyptAir's pavilion: stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market.",
        ar: "جناح مصر للطيران: تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي.",
      },
      photos: photos("/images/work/egyptair-pavilion/", 1),
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
    categories: ["events-hospitality", "production-print-gifts", "marketing-brand"],
    markets: ["ae"],
    anonymous: {
      label: { en: "A national football league", ar: "دوري كرة قدم وطني" },
      summary: {
        en: "Tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets.",
        ar: "هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، ومعها محتوى الدوري على منصّاته، وتغليف الجوائز، وأطقم الهدايا.",
      },
      visual: "stage",
    },
    named: {
      label: { en: "UAE Pro League", ar: "رابطة دوري المحترفين الإماراتي" },
      summary: {
        en: "Full event delivery for the UAE Pro League: tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets.",
        ar: "تنفيذ متكامل لفعاليات دوري المحترفين الإماراتي: هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا.",
      },
      photos: photos("/images/work/uae-pro-league/", 5),
    },
    // p5, p13, p23–24. Challenge, Idea and Result are {{TODO}}: hidden. No edition year (unconfirmed).
    story: {
      facts: [
        { label: { en: "Our role", ar: "دورنا" }, value: { en: "Event delivery, content and gifts", ar: "تنفيذ الفعاليات والمحتوى والهدايا" } },
        { label: { en: "Occasions", ar: "المناسبات" }, value: { en: "Tournaments and award nights", ar: "البطولات وليالي التكريم" } },
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

export type WorkView = { key: WorkKey; slug: string; named: boolean; label: Localized<string>; summary: Localized<string>; visual?: DrawingKey; photos: string[] };

/** The version a page shows: named only with the client's approval (`WORK_NAMED`). */
export function workView(w: WorkItem, named: boolean = WORK_NAMED[w.key]): WorkView {
  return named
    ? { key: w.key, slug: w.slug, named, label: w.named.label, summary: w.named.summary, photos: w.named.photos }
    : { key: w.key, slug: w.slug, named, label: w.anonymous.label, summary: w.anonymous.summary, visual: w.anonymous.visual, photos: [] };
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return workItems.find((w) => w.slug === slug);
}

/** The case after this one, wrapping around: the case page's "Next case". */
export function nextWork(w: WorkItem): WorkItem {
  return workItems[(workItems.indexOf(w) + 1) % workItems.length];
}
