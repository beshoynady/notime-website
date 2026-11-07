import { describe, expect, it } from "vitest";
import { anchorScrollTop, sameDocumentHash } from "./anchor";

const here = "https://notime.ae/en";

describe("sameDocumentHash", () => {
  it("returns the id for a bare hash", () => {
    expect(sameDocumentHash("#services", here)).toBe("services");
  });
  it("returns the id for a path + hash on the current page", () => {
    expect(sameDocumentHash("/en#services", here)).toBe("services");
    expect(sameDocumentHash("https://notime.ae/en#services", here)).toBe("services");
  });
  it("ignores a trailing slash on either side", () => {
    expect(sameDocumentHash("/en/#services", here)).toBe("services");
    expect(sameDocumentHash("/en#services", "https://notime.ae/en/")).toBe("services");
  });
  it("is null for another page, another locale or another origin", () => {
    expect(sameDocumentHash("/en/services/events-hospitality#conferences", here)).toBeNull();
    expect(sameDocumentHash("/ar#services", here)).toBeNull();
    expect(sameDocumentHash("https://example.com/en#services", here)).toBeNull();
  });
  it("is null when the query changes (a navigation, e.g. ?service=)", () => {
    expect(sameDocumentHash("/en?service=conferences#quote", here)).toBeNull();
  });
  it("is null without a fragment, or with an empty one", () => {
    expect(sameDocumentHash("/en", here)).toBeNull();
    expect(sameDocumentHash("#", here)).toBeNull();
  });
  it("decodes the fragment", () => {
    expect(sameDocumentHash("#%D8%AE%D8%AF%D9%85%D8%A7%D8%AA", here)).toBe("خدمات");
  });
  it("is null for unparseable hrefs", () => {
    expect(sameDocumentHash("http://[bad", here)).toBeNull();
  });
});

describe("anchorScrollTop", () => {
  it("puts the target's top at the header's bottom", () => {
    // Target 900px below the viewport top, page scrolled 200px, header bottom at 68px.
    expect(anchorScrollTop({ targetTop: 900, scrollY: 200, headerBottom: 68, maxScroll: 5000 })).toBe(1032);
  });
  it("clamps to the scroll range", () => {
    expect(anchorScrollTop({ targetTop: 20, scrollY: 0, headerBottom: 68, maxScroll: 5000 })).toBe(0);
    expect(anchorScrollTop({ targetTop: 4000, scrollY: 3000, headerBottom: 68, maxScroll: 5000 })).toBe(5000);
  });
  it("rounds to whole pixels", () => {
    expect(anchorScrollTop({ targetTop: 900.6, scrollY: 0, headerBottom: 68.2, maxScroll: 5000 })).toBe(832);
  });
});
