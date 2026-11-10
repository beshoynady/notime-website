import type { Localized } from "../types";

/**
 * Content strategy's signature module (category-pages.md §6 III, entry 16): a sample month of
 * content for an unnamed, fictional brand, colour-coded by pillar (tone and pattern, never colour
 * alone) and filterable by pillar and channel. It is demo content: the module always shows the
 * "Example" label (`example: true`). No real brand, handle, figure or result.
 * Channels are named as their users know them (Instagram, LinkedIn); in Arabic the platforms are
 * written in Arabic letters, as in the copy deck (VI · Paid media).
 */

export type PillarId = "launch" | "craft" | "guide" | "community";
export type ChannelId = "instagram" | "linkedin" | "newsletter" | "blog";
export type FormatId = "reel" | "stories" | "post" | "carousel" | "article" | "email";
export type LangId = "en" | "ar" | "both";

export interface CalendarEntry {
  id: string;
  /** Day of the month, 1–28, so every entry exists in every month. */
  day: number;
  pillar: PillarId;
  channel: ChannelId;
  format: FormatId;
  /** The language(s) the post is written in: each one natively (FAQ 1). */
  lang: LangId;
  topic: Localized<string>;
}

export const CALENDAR = {
  example: true,
  title: { en: "A month of content, planned", ar: "شهر من المحتوى، بخطة واضحة" },
  note: {
    en: "A sample plan for a fictional brand. Filter by pillar or channel, then choose a day to see the post.",
    ar: "خطة نموذجية لعلامة افتراضية. صفِّها حسب المحور أو القناة، ثم اختر يومًا لترى المنشور.",
  },
  filters: {
    pillar: { en: "Pillar", ar: "المحور" },
    channel: { en: "Channel", ar: "القناة" },
    all: { en: "All", ar: "الكل" },
  },
  detail: {
    pillar: { en: "Pillar", ar: "المحور" },
    channel: { en: "Channel", ar: "القناة" },
    format: { en: "Format", ar: "الصيغة" },
    lang: { en: "Language", ar: "اللغة" },
  },
  /** The table's caption for assistive tech; `{month}` is the month and year. */
  caption: { en: "Sample content calendar, {month}", ar: "تقويم محتوى نموذجي، {month}" },
  /** Announced when the filters change: `{count}` posts are shown (Intl.PluralRules categories; none shown is `empty`). */
  status: {
    en: { one: "1 post shown", other: "{count} posts shown" },
    ar: { one: "منشور واحد معروض", two: "منشوران معروضان", few: "{count} منشورات معروضة", many: "{count} منشورًا معروضًا", other: "{count} منشور معروض" },
  } as { en: Partial<Record<Intl.LDMLPluralRule, string>>; ar: Partial<Record<Intl.LDMLPluralRule, string>> },
  empty: {
    en: "No post matches both filters. Choose another pillar or channel.",
    ar: "لا يوجد منشور يطابق الاختيارين. اختر محورًا أو قناة أخرى.",
  },
  pillars: [
    { id: "launch", label: { en: "Launches and news", ar: "إطلاقات وأخبار" } },
    { id: "craft", label: { en: "Behind the scenes", ar: "خلف الكواليس" } },
    { id: "guide", label: { en: "Tips and how-tos", ar: "نصائح وإرشادات" } },
    { id: "community", label: { en: "Community", ar: "مع الجمهور" } },
  ] satisfies { id: PillarId; label: Localized<string> }[],
  channels: [
    { id: "instagram", label: { en: "Instagram", ar: "إنستغرام" } },
    { id: "linkedin", label: { en: "LinkedIn", ar: "لينكدإن" } },
    { id: "newsletter", label: { en: "Newsletter", ar: "النشرة البريدية" } },
    { id: "blog", label: { en: "Blog", ar: "المدوّنة" } },
  ] satisfies { id: ChannelId; label: Localized<string> }[],
  formats: {
    reel: { en: "Reel", ar: "ريل" },
    stories: { en: "Stories", ar: "قصص" },
    post: { en: "Post", ar: "منشور" },
    carousel: { en: "Carousel", ar: "منشور بعدّة صور" },
    article: { en: "Article", ar: "مقال" },
    email: { en: "Email", ar: "رسالة بريدية" },
  } satisfies Record<FormatId, Localized<string>>,
  langs: {
    en: { en: "English", ar: "الإنجليزية" },
    ar: { en: "Arabic", ar: "العربية" },
    both: { en: "Arabic and English", ar: "العربية والإنجليزية" },
  } satisfies Record<LangId, Localized<string>>,
  /** Short language marks on the calendar's cells. */
  langMarks: {
    en: { en: "EN", ar: "EN" },
    ar: { en: "AR", ar: "ع" },
    both: { en: "AR · EN", ar: "ع · EN" },
  } satisfies Record<LangId, Localized<string>>,
  entries: [
    { id: "e01", day: 2, pillar: "launch", channel: "instagram", format: "reel", lang: "both", topic: { en: "First look at the new season", ar: "نظرة أولى على الموسم الجديد" } },
    { id: "e02", day: 4, pillar: "guide", channel: "blog", format: "article", lang: "both", topic: { en: "A guide for first-time users", ar: "دليل لمن يجرّب لأول مرة" } },
    { id: "e03", day: 6, pillar: "craft", channel: "instagram", format: "stories", lang: "ar", topic: { en: "A morning in the studio", ar: "صباح في الاستوديو" } },
    { id: "e04", day: 8, pillar: "community", channel: "linkedin", format: "post", lang: "en", topic: { en: "Your questions, answered", ar: "أسئلتكم وإجاباتها" } },
    { id: "e05", day: 10, pillar: "launch", channel: "newsletter", format: "email", lang: "both", topic: { en: "What's new this month", ar: "جديد هذا الشهر" } },
    { id: "e06", day: 12, pillar: "guide", channel: "instagram", format: "carousel", lang: "both", topic: { en: "Care tips, one slide each", ar: "نصائح العناية، نصيحة في كل صورة" } },
    { id: "e07", day: 14, pillar: "craft", channel: "linkedin", format: "article", lang: "en", topic: { en: "How the new packaging was designed", ar: "كيف صُمّمت العبوة الجديدة" } },
    { id: "e08", day: 15, pillar: "community", channel: "instagram", format: "reel", lang: "ar", topic: { en: "Customers share their favourite pick", ar: "العملاء يختارون مفضّلهم" } },
    { id: "e09", day: 17, pillar: "launch", channel: "blog", format: "article", lang: "both", topic: { en: "The launch announcement", ar: "إعلان الإطلاق" } },
    { id: "e10", day: 19, pillar: "guide", channel: "linkedin", format: "post", lang: "en", topic: { en: "Common mistakes, and how to avoid them", ar: "أخطاء شائعة وكيف تتجنّبها" } },
    { id: "e11", day: 21, pillar: "craft", channel: "instagram", format: "stories", lang: "both", topic: { en: "Packing day, behind the scenes", ar: "يوم التغليف من خلف الكواليس" } },
    { id: "e12", day: 23, pillar: "community", channel: "blog", format: "article", lang: "ar", topic: { en: "A conversation with a customer", ar: "حوار مع أحد العملاء" } },
    { id: "e13", day: 24, pillar: "launch", channel: "instagram", format: "post", lang: "both", topic: { en: "The full range in one post", ar: "المجموعة كاملة في منشور واحد" } },
    { id: "e14", day: 26, pillar: "guide", channel: "blog", format: "article", lang: "en", topic: { en: "A short glossary for beginners", ar: "مصطلحات أساسية للمبتدئين" } },
    { id: "e15", day: 27, pillar: "craft", channel: "newsletter", format: "email", lang: "ar", topic: { en: "The month in pictures", ar: "الشهر بالصور" } },
    { id: "e16", day: 28, pillar: "community", channel: "linkedin", format: "post", lang: "both", topic: { en: "Thank you to this month's community", ar: "شكرًا لجمهور هذا الشهر" } },
  ] satisfies CalendarEntry[],
};
