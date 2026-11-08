import { describe, expect, it } from "vitest";
import { localeAlternates } from "./seo";

describe("localeAlternates", () => {
  it("sets the canonical to the current locale and lists every locale plus x-default", () => {
    expect(localeAlternates("ar", "/services/events-hospitality")).toEqual({
      canonical: "/ar/services/events-hospitality",
      languages: {
        en: "/en/services/events-hospitality",
        ar: "/ar/services/events-hospitality",
        "x-default": "/en/services/events-hospitality",
      },
    });
  });

  it("handles the locale root", () => {
    expect(localeAlternates("en", "")).toEqual({
      canonical: "/en",
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    });
  });
});
