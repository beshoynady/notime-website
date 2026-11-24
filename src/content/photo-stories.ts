import { media, type MediaEntry, type STORY_BASE } from "./media";
import type { Localized } from "./types";

/**
 * Photo-driven scroll stories (§5 of the final pass, D109): real NO TIME photos from the 2026
 * profile (profile-inventory.md: no identifiable person, no client name or branding), graded with
 * the Evening grade at native size (scripts/grade-stories.mjs → public/images/stories/). They show
 * the company's own work in general, never a named project: Work cards and case studies keep
 * their own rules (CaseMedia, D106).
 *
 * Two stories (the Galas photo stack gave way to its photo scene and work strip, D153):
 * - `ROOM_STORY` (About): split screen, the line pinned beside its photo, four beats of one evening;
 * - `STRIP` (home, Our work): a pinned horizontal strip, mirrored in Arabic.
 */

/** A story's photos, by registry id (media.ts: the Evening-graded copies, STORY_BASE). */
export const STORY_PHOTOS = {
  rig: "st-rig",
  hall: "st-hall",
  cart: "st-cart",
  buffet: "st-buffet",
  gala: "st-gala",
  display: "st-display",
  table: "st-table",
  service: "st-service",
  florals: "st-florals",
  tent: "st-tent",
} as const satisfies Record<string, keyof typeof STORY_BASE>;

export type StoryPhotoKey = keyof typeof STORY_PHOTOS;

export interface StoryBeat {
  photo: StoryPhotoKey;
  title: Localized<string>;
  body: Localized<string>;
}

/** About: one evening, four beats, one team (strategy → creative → production → delivery, p3). */
export const ROOM_STORY = {
  eyebrow: { en: "From our events", ar: "من فعالياتنا" },
  title: { en: "How a room comes together.", ar: "هكذا تكتمل القاعة." },
  beats: [
    {
      photo: "rig",
      title: { en: "The rig goes up.", ar: "يُنصب المسرح." },
      body: {
        en: "Truss, sound and light, built and tested by our crew before anything else enters the room.",
        ar: "الهياكل المعدنية والصوت والإضاءة، يركّبها طاقمنا ويختبرها قبل أن يدخل القاعة أي شيء آخر.",
      },
    },
    {
      photo: "hall",
      title: { en: "The room is dressed.", ar: "تتزيّن القاعة." },
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
    // Each frame's photo is its own: About's story and the Work pages show others (D169).
    { photo: "gala", caption: { en: "Gala dinner", ar: "حفل عشاء" } },
    { photo: "display", caption: { en: "Buffet display", ar: "تنسيق البوفيه" } },
    { photo: "table", caption: { en: "Table styling", ar: "تنسيق الطاولات" } },
    { photo: "service", caption: { en: "Hospitality service", ar: "تقديم الضيافة" } },
    { photo: "florals", caption: { en: "Florals and décor", ar: "الزهور والديكور" } },
    { photo: "tent", caption: { en: "Desert majlis", ar: "مجلس في الصحراء" } },
  ] satisfies { photo: StoryPhotoKey; caption: Localized<string> }[],
} as const;

/**
 * The items of a story or strip whose photo is shown, each with its registry entry; a hidden photo
 * drops its item and the rest close up (fill or hide, D78). `lookup` is `media` (tests pass their own).
 */
export function storyBeats<T extends { photo: StoryPhotoKey }>(items: readonly T[], lookup: (id: string) => MediaEntry | undefined = media) {
  return items.flatMap((item) => {
    const entry = lookup(STORY_PHOTOS[item.photo]);
    return entry ? [{ ...item, entry }] : [];
  });
}
