import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAV_LINKS, QUOTE_LINK } from "@/components/layout/nav-links";
import { contactStatus, isFilled, liveLinks, shownFaq } from "./content-status";

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
    expect(shown).toEqual(["work", "digital", "about", "contact"]); // Contact live with its page (D102; footer only, D105)
    expect(NAV_LINKS.find((l) => l.key === "about")!.href).toBe("/about");
    for (const l of liveLinks(NAV_LINKS)) expect(l.href).not.toMatch(/^\/#(work|digital|contact)$/);
  });

  it("shows the quote button now that /contact exists (D102)", () => {
    expect(QUOTE_LINK.href).toBe("/contact");
    expect(existsSync("src/app/[locale]/(site)/contact/page.tsx")).toBe(true);
    expect(liveLinks([QUOTE_LINK])).toEqual([QUOTE_LINK]);
  });
});

describe("shownFaq (D123: a claim the site can't back stays in the data, hidden)", () => {
  it("leaves out the Print FAQ on ordering prints online, in the page and in its FAQPage JSON-LD", async () => {
    const { getCategory, getServices } = await import("@/content");
    const { categoryJsonLd } = await import("./jsonld");
    const print = getCategory("production-print-gifts")!;
    const online = print.faq.find((f) => f.q.en === "Can I order prints online?");
    expect(online, "the line stays in the data").toBeDefined();
    expect(shownFaq(print.faq)).not.toContain(online);
    expect(shownFaq(print.faq)).toHaveLength(print.faq.length - 1);
    const ld = categoryJsonLd(print, getServices("production-print-gifts"), "en", "https://example.com") as Record<string, unknown>[];
    const names = (ld.find((n) => n["@type"] === "FAQPage")!.mainEntity as { name: string }[]).map((e) => e.name);
    expect(names).not.toContain("Can I order prints online?");
  });

  it("keeps every other category's FAQ whole", async () => {
    const { getCategories } = await import("@/content");
    for (const c of getCategories().filter((c) => c.slug !== "production-print-gifts")) expect(shownFaq(c.faq), c.slug).toEqual(c.faq);
  });
});
