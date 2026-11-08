import { describe, expect, it } from "vitest";
import { closedLabLocale, unknownCategoryLocale } from "./services-route";

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

describe("closedLabLocale", () => {
  const PAGES = ["events-animatic", "software-animatic"];

  it("returns null for a lab page while the lab is on", () => {
    expect(closedLabLocale("/en/lab/events-animatic", PAGES, true)).toBeNull();
    expect(closedLabLocale("/ar/lab/software-animatic/", PAGES, true)).toBeNull();
  });

  it("returns the locale for every lab path while the lab is off", () => {
    expect(closedLabLocale("/en/lab/events-animatic", PAGES, false)).toBe("en");
    expect(closedLabLocale("/ar/lab", PAGES, false)).toBe("ar");
  });

  it("returns the locale for an unknown lab page, or the bare lab path", () => {
    expect(closedLabLocale("/en/lab/nope-animatic", PAGES, true)).toBe("en");
    expect(closedLabLocale("/ar/lab/", PAGES, true)).toBe("ar");
    expect(closedLabLocale("/en/lab/events-animatic/extra", PAGES, true)).toBe("en");
  });

  it("leaves other paths and unknown locales alone", () => {
    expect(closedLabLocale("/en/services/events-hospitality", PAGES, false)).toBeNull();
    expect(closedLabLocale("/en/laboratory", PAGES, false)).toBeNull();
    expect(closedLabLocale("/fr/lab/events-animatic", PAGES, false)).toBeNull();
  });
});
