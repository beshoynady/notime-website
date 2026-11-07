/**
 * Hero line variant (OPEN_QUESTIONS #15), waiting on the client:
 * - "create": the approved reference's "IT'S TIME / TO CREATE." (current);
 * - "start": the 2026 company profile's official line, "IT'S TIME / TO START.".
 * Switching is this one value; the copy for both lives in the messages (`hero.title.*`).
 */
export type HeroLine = "create" | "start";
export const HERO_LINE: HeroLine = "create";
