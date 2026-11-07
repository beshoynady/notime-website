/**
 * Hero line variant. The brand line is "start" (D54, decided 2026-11-07, OPEN_QUESTIONS #15
 * closed): "IT'S TIME / TO START." · «حان وقت / البداية.».
 * - "create": the approved reference's "IT'S TIME / TO CREATE." (kept for comparison only);
 * - "start": the 2026 company profile's official line (live).
 * Switching is this one value; the copy for both lives in the messages (`hero.title.*`).
 */
export type HeroLine = "create" | "start";
export const HERO_LINE: HeroLine = "start";
