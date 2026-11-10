import { WORK_NAMED } from "@/config/work";
import type { CategorySlug, Localized } from "./types";

/**
 * Work (D78 §6, approved 2026-11-09). Real facts from docs/content/case-studies.md. Until a client
 * approves its name (`WORK_NAMED`), the case shows a description instead of the name, and an
 * illustrative image instead of its own photos, which all show the client's brand.
 */
export type WorkKey = keyof typeof WORK_NAMED;

export interface WorkItem {
  key: WorkKey;
  /** The first is the case's home; the rest list it as related work. */
  categories: CategorySlug[];
  anonymous: { label: Localized<string>; summary: Localized<string>; image: string };
  named: { label: Localized<string>; summary: Localized<string>; photos: string[] };
}

/** Folders of curated client photos that show a client's brand (profile-inventory.md audit). */
export const BRANDED_PHOTO_DIRS = ["/images/work/uae-athletics-federation/", "/images/work/egyptair-pavilion/", "/images/work/uae-pro-league/"] as const;

/** Words that identify a client; none may appear in an anonymised case. */
export const CLIENT_NAMES = ["UAE Pro League", "Pro League", "UAEAF", "Athletics", "uaeathletics", "EgyptAir", "Egypt Air", "Oregon", "ADIB", "مصر للطيران", "دوري المحترفين", "ألعاب القوى"] as const;

const photos = (dir: string, n: number) => Array.from({ length: n }, (_, i) => `${dir}${dir.split("/").at(-2)}-${i + 1}.webp`);

export const workItems: WorkItem[] = [
  {
    key: "uaeaf",
    categories: ["software-digital", "marketing-brand"],
    anonymous: {
      label: { en: "A national sports federation", ar: "اتحاد رياضي وطني" },
      summary: {
        en: "Its digital and media partner: a full rebuild of the bilingual website and the connected mobile app, plus daily social media in Arabic and English. First week of one championship campaign: 487K views, +37.6K new followers, 271K reach.",
        ar: "شريكه الرقمي والإعلامي: إعادة بناء كاملة للموقع الإلكتروني ثنائي اللغة وتطبيق الجوّال المرتبط به، مع إدارة يومية لوسائل التواصل بالعربية والإنجليزية. في الأسبوع الأول من إحدى حملات البطولات: 487 ألف مشاهدة، و‎+37.6 ألف متابع جديد، ووصول بلغ 271 ألفًا.",
      },
      image: "work-sports-federation-16x9",
    },
    named: {
      label: { en: "UAE Athletics Federation", ar: "الاتحاد الإماراتي لألعاب القوى" },
      summary: {
        en: "The federation's appointed digital and media partner: a full rebuild of the bilingual website and the connected mobile app, plus daily social media in Arabic and English. First week of the Oregon 26 campaign: 487K views, +37.6K new followers, 271K reach.",
        ar: "الشريك الرقمي والإعلامي المعتمد للاتحاد: إعادة بناء كاملة للموقع الإلكتروني ثنائي اللغة وتطبيق الجوّال المرتبط به، مع إدارة يومية لوسائل التواصل بالعربية والإنجليزية. في الأسبوع الأول من حملة أوريغون 26: 487 ألف مشاهدة، و‎+37.6 ألف متابع جديد، ووصول بلغ 271 ألفًا.",
      },
      photos: photos("/images/work/uae-athletics-federation/", 3),
    },
  },
  {
    key: "egyptair",
    categories: ["events-hospitality", "marketing-brand"],
    anonymous: {
      label: { en: "A national airline", ar: "شركة طيران وطنية" },
      summary: {
        en: "Stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market.",
        ar: "تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي.",
      },
      image: "work-airline-pavilion-16x9",
    },
    named: {
      label: { en: "EgyptAir", ar: "مصر للطيران" },
      summary: {
        en: "EgyptAir's pavilion: stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market.",
        ar: "جناح مصر للطيران: تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي.",
      },
      photos: photos("/images/work/egyptair-pavilion/", 1),
    },
  },
  {
    key: "uaepl",
    categories: ["events-hospitality", "production-print-gifts", "marketing-brand"],
    anonymous: {
      label: { en: "A national football league", ar: "دوري كرة قدم وطني" },
      summary: {
        en: "Tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets.",
        ar: "هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا.",
      },
      image: "work-sports-league-16x9",
    },
    named: {
      label: { en: "UAE Pro League", ar: "رابطة دوري المحترفين الإماراتي" },
      summary: {
        en: "Full event delivery for the UAE Pro League: tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets.",
        ar: "تنفيذ متكامل لفعاليات دوري المحترفين الإماراتي: هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا.",
      },
      photos: photos("/images/work/uae-pro-league/", 5),
    },
  },
];

export type WorkView = { key: WorkKey; named: boolean; label: Localized<string>; summary: Localized<string>; image?: string; photos: string[] };

/** The version a page shows: named only with the client's approval (`WORK_NAMED`). */
export function workView(w: WorkItem, named: boolean = WORK_NAMED[w.key]): WorkView {
  return named
    ? { key: w.key, named, label: w.named.label, summary: w.named.summary, photos: w.named.photos }
    : { key: w.key, named, label: w.anonymous.label, summary: w.anonymous.summary, image: w.anonymous.image, photos: [] };
}
