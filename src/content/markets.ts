/**
 * The six markets (company profile 2026; fact check #1), in the profile's order, each with its
 * IANA time zone for the homepage clocks (H-08). Dubai is the base.
 */
export const markets = [
  { key: "ae", timeZone: "Asia/Dubai", base: true },
  { key: "sa", timeZone: "Asia/Riyadh", base: false },
  { key: "qa", timeZone: "Asia/Qatar", base: false },
  { key: "om", timeZone: "Asia/Muscat", base: false },
  { key: "kw", timeZone: "Asia/Kuwait", base: false },
  { key: "eg", timeZone: "Africa/Cairo", base: false },
] as const;

export type MarketKey = (typeof markets)[number]["key"];
