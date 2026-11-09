/**
 * Fill or hide (D78): an element whose real content doesn't exist yet doesn't render. These are
 * the rules every component asks, so a missing value can never show as a TODO or a broken element.
 */
import type { ContactConfig } from "@/config/contact";
import type { Localized } from "@/content/types";

type Value = string | Localized<string> | null | undefined;

const one = (s: string) => s.trim() !== "" && !s.includes("TODO");

/** A value is filled when it is non-empty, has no TODO, and (localized) has both locales. */
export function isFilled(v: Value): boolean {
  if (v == null) return false;
  if (typeof v === "string") return one(v);
  return one(v.en) && one(v.ar);
}

/** Which contact lines can show; `any` is false while contact.ts is still empty. */
export function contactStatus(c: ContactConfig) {
  const s = { email: isFilled(c.email), whatsapp: isFilled(c.whatsapp), instagram: isFilled(c.instagram), facebook: isFilled(c.facebook) };
  return { ...s, any: Object.values(s).some(Boolean) };
}

/** Links whose page exists (`live`); the rest stay hidden until their page is built. */
export const liveLinks = <T extends { live: boolean }>(links: readonly T[]) => links.filter((l) => l.live);
