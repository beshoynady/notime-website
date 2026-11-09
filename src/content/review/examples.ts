/**
 * Example content for the trust blocks that stay hidden in production until Rand sends the real
 * material (D78): client logos, testimonials, stats, team, press. Review mode only, every block
 * badged "Example – to be replaced". Nothing here may read as a real claim: logos are plain shapes,
 * people are "Client name / Role, Company", figures are blanks to confirm.
 */
import type { Localized } from "../types";

export type ExampleKind = "logos" | "testimonials" | "stats" | "team" | "press";

export const exampleHeadings: Record<ExampleKind, Localized<string>> = {
  logos: { en: "Clients", ar: "عملاؤنا" },
  testimonials: { en: "What clients say", ar: "ماذا يقول العملاء" },
  stats: { en: "In figures", ar: "بالأرقام" },
  team: { en: "The team", ar: "الفريق" },
  press: { en: "In the press", ar: "في الصحافة" },
};

/** Six neutral shapes standing in for client logos (no real marks). */
export const exampleLogos = ["circle", "square", "triangle", "hexagon", "diamond", "ring"] as const;

export const exampleQuote: Localized<string> = {
  en: "A short quote from the client goes here: what changed for them, in their own words.",
  ar: "هنا اقتباس قصير من العميل: ما الذي تغيّر لديه، بكلماته هو.",
};

export const exampleStats: { label: Localized<string> }[] = [
  { label: { en: "Projects delivered (to confirm)", ar: "مشاريع منفّذة (للتأكيد)" } },
  { label: { en: "Years in operation (to confirm)", ar: "سنوات العمل (للتأكيد)" } },
  { label: { en: "Markets served", ar: "أسواق نعمل فيها" } },
];

export const exampleTeam: { name: Localized<string>; role: Localized<string> }[] = [
  { name: { en: "Name", ar: "الاسم" }, role: { en: "Role", ar: "المنصب" } },
  { name: { en: "Name", ar: "الاسم" }, role: { en: "Role", ar: "المنصب" } },
  { name: { en: "Name", ar: "الاسم" }, role: { en: "Role", ar: "المنصب" } },
];

export const examplePress: { outlet: Localized<string>; headline: Localized<string> }[] = [
  { outlet: { en: "Publication name", ar: "اسم المطبوعة" }, headline: { en: "Article headline", ar: "عنوان المقال" } },
  { outlet: { en: "Publication name", ar: "اسم المطبوعة" }, headline: { en: "Article headline", ar: "عنوان المقال" } },
];
