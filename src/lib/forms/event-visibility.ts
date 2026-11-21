import type { Locale } from "@/content/types";

/**
 * Client-safe pieces of the event-fields rule: no `@/content` barrel, so the contact form's bundle
 * stays small (the server passes each service's `events` flag as a prop). `showEventFields` in
 * event-fields.ts is the same rule keyed by anchor.
 */
export function eventFieldsVisible({ service, serviceIsEvents, category }: { service: string; serviceIsEvents: boolean; category: string }): boolean {
  return service === "" ? category === "events-hospitality" : serviceIsEvents;
}

/** The next `count` months from the current one, as `{ value: "YYYY-MM", label }`. */
export function monthOptions(now: Date, locale: Locale, count = 24): { value: string; label: string }[] {
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const start = now.getUTCFullYear() * 12 + now.getUTCMonth();
  return Array.from({ length: count }, (_, i) => {
    const y = Math.floor((start + i) / 12);
    const m = (start + i) % 12;
    return { value: `${y}-${String(m + 1).padStart(2, "0")}`, label: fmt.format(new Date(Date.UTC(y, m, 1))) };
  });
}
