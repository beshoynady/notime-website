import { describe, expect, it } from "vitest";
import { unknownCategoryLocale } from "./services-route";

const SLUGS = ["events-hospitality", "software-digital"];

describe("unknownCategoryLocale", () => {
  it("returns the locale for a category slug that does not exist", () => {
    expect(unknownCategoryLocale("/en/services/nope", SLUGS)).toBe("en");
    expect(unknownCategoryLocale("/ar/services/nope/", SLUGS)).toBe("ar");
  });

  it("returns null for real categories, the overview and other paths", () => {
    expect(unknownCategoryLocale("/en/services/events-hospitality", SLUGS)).toBeNull();
    expect(unknownCategoryLocale("/ar/services/software-digital/", SLUGS)).toBeNull();
    expect(unknownCategoryLocale("/en/services", SLUGS)).toBeNull();
    expect(unknownCategoryLocale("/en", SLUGS)).toBeNull();
    // Deeper paths (the OG image route) are not category pages.
    expect(unknownCategoryLocale("/en/services/events-hospitality/opengraph-image/og", SLUGS)).toBeNull();
  });

  it("ignores unknown locales (next-intl handles those)", () => {
    expect(unknownCategoryLocale("/fr/services/nope", SLUGS)).toBeNull();
  });
});
