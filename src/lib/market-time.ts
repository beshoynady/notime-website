/**
 * A market's local time for the homepage clocks (H-08): "HH:MM" on a 24-hour clock and the
 * UTC offset, from the IANA zone, so daylight saving (Cairo) follows the date. Always Western
 * digits (D50): the formatter is pinned to `en-GB` with Latin numerals, whatever the page locale.
 */
export function marketTime(date: Date, timeZone: string): { time: string; offset: string } {
  const parts = new Intl.DateTimeFormat("en-GB-u-nu-latn", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  // "GMT+4" → "UTC+4"; a zone on UTC itself reads "GMT".
  const offset = get("timeZoneName").replace(/^GMT/, "UTC") || "UTC";
  return { time: `${get("hour")}:${get("minute")}`, offset: offset === "UTC" ? "UTC+0" : offset };
}
