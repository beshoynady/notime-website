import { describe, expect, it } from "vitest";
import { NAV_LINKS, QUOTE_LINK } from "@/components/layout/nav-links";
import { contactStatus, isFilled, liveLinks } from "./content-status";

describe("isFilled (fill or hide, D78)", () => {
  it("treats empty, whitespace, TODO and missing values as not filled", () => {
    for (const v of [undefined, null, "", "   ", "TODO: number", "x TODO"]) expect(isFilled(v), String(v)).toBe(false);
    expect(isFilled("+971 50 000 0000")).toBe(true);
  });

  it("needs both locales of a localized value", () => {
    expect(isFilled({ en: "Dubai", ar: "دبي" })).toBe(true);
    expect(isFilled({ en: "Dubai", ar: "" })).toBe(false);
    expect(isFilled({ en: "", ar: "دبي" })).toBe(false);
  });
});

describe("contactStatus", () => {
  it("hides each contact line on its own until it has a value", () => {
    const s = contactStatus({ email: "hello@example.com", whatsapp: "", instagram: " ", facebook: "https://facebook.com/x" });
    expect(s).toEqual({ email: true, whatsapp: false, instagram: false, facebook: true, any: true });
    expect(contactStatus({ email: "", whatsapp: "", instagram: "", facebook: "" }).any).toBe(false);
  });
});

describe("navigation links", () => {
  it("shows only links whose page exists", () => {
    const shown = liveLinks(NAV_LINKS).map((l) => l.key);
    expect(shown).toContain("digital");
    expect(shown).not.toContain("work"); // /work arrives in Phase F (F1)
    for (const l of liveLinks(NAV_LINKS)) expect(l.href).not.toMatch(/^\/#(work|digital|contact)$/);
  });

  it("keeps the quote button hidden until /contact exists", () => {
    expect(QUOTE_LINK.href).toBe("/contact");
    expect(liveLinks([QUOTE_LINK])).toEqual([]);
  });
});
