import { getServiceByAnchor } from "@/content";
import type { Locale } from "@/content";

/** True when the anchor names a service in the Events & Hospitality category. */
export function isEventsService(anchor: string): boolean {
  return getServiceByAnchor(anchor)?.category === "events-hospitality";
}

/** Client: show the event date and guests. The chosen service wins over the `?category=` hint. */
export function showEventFields({ service, category }: { service: string; category: string }): boolean {
  return isEventsService(service) || (service === "" && category === "events-hospitality");
}

/** Server: keep a posted event date and guests (the category hint never reaches the server). */
export function keepEventFields(service: string): boolean {
  return service === "" || isEventsService(service);
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
