/**
 * Voice rules for all copy, in messages and in the localized fields of `src/content/`
 * (copy decks; tested in messages.test.ts and content.test.ts).
 */

/** Phrases the brand voice rules out, in both languages (matched case-insensitively). */
export const BANNED = [
  "elevate",
  "cutting-edge",
  "cutting edge",
  "one-stop",
  "one stop",
  "unleash",
  "الارتقاء بعلامتك",
  "متطور جدًا",
  "حلول متكاملة شاملة",
  // «متكامل» / «متكاملة» as filler ("integrated"): it adds nothing a plan or a team doesn't
  // already say (Events copy review, 2026-11-09). Rewrite the sentence rather than allow it.
  "متكامل",
];

/**
 * «في الموقع» on a website reads as "on the website". For on-site, write «في المكان» or
 * «في أرض الحدث» (Events copy review, 2026-11-09). Message keys where it does mean the website:
 */
export const AR_SITE = "في الموقع";
export const AR_SITE_MEANS_WEBSITE = new Set(["styleguide.intro.lead", "styleguide.closing.body"]);

/** Every rule a piece of copy breaks; `key` names it for the allow-lists. */
export function copyProblems(key: string, text: string, locale: "en" | "ar"): string[] {
  const lower = text.toLowerCase();
  const hits = BANNED.filter((p) => lower.includes(p)).map((p) => `${key} contains "${p}"`);
  if (locale === "ar" && text.includes(AR_SITE) && !AR_SITE_MEANS_WEBSITE.has(key)) {
    hits.push(`${key}: «${AR_SITE}» is ambiguous on a website; on-site is «في المكان» or «في أرض الحدث»`);
  }
  return hits;
}
