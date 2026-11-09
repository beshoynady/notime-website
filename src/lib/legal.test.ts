import { describe, expect, it } from "vitest";
import { legalDocs } from "@/content/legal";
import { resolveLegal, type LegalDoc, type LegalValues } from "./legal";

const EMPTY: LegalValues = { legalName: "", address: "", dataRequestContact: "", whatsapp: "", courts: "the courts of Dubai", prevailingLanguage: "Arabic" };
const doc: LegalDoc = {
  slug: "terms",
  title: { en: "T", ar: "ش" },
  updated: "2026-11-09",
  sections: [
    {
      heading: { en: "One", ar: "واحد" },
      blocks: [
        { p: { en: "Run by NO TIME Creative House.", ar: "يديره NO TIME Creative House." } },
        { p: { en: "The legal entity is {legalName}, {address}.", ar: "الكيان القانوني {legalName}، {address}." }, needs: ["legalName", "address"] },
        { list: [{ text: { en: "Vercel", ar: "Vercel" } }, { text: { en: "WhatsApp (Meta)", ar: "واتساب (Meta)" }, needs: ["whatsapp"] }] },
      ],
    },
    { heading: { en: "Contact", ar: "تواصل" }, blocks: [{ p: { en: "Write to {dataRequestContact}.", ar: "راسلنا عبر {dataRequestContact}." }, needs: ["dataRequestContact"] }] },
    { heading: { en: "Law", ar: "القانون" }, blocks: [{ p: { en: "Disputes go to {courts}; the {prevailingLanguage} version prevails.", ar: "x" } }] },
  ],
};

describe("resolveLegal (fill or hide, D78)", () => {
  it("hides every block and list item whose config value is missing, never showing a token", () => {
    const r = resolveLegal(doc, EMPTY, "en");
    const text = JSON.stringify(r);
    expect(text).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(text).not.toContain("legal entity");
    expect(text).not.toContain("WhatsApp (Meta)");
    expect(text).toContain("Run by NO TIME Creative House.");
  });

  it("gives each section an anchor from its English heading, the same in both locales", () => {
    expect(resolveLegal(doc, EMPTY, "ar").sections.map((s) => s.id)).toEqual(["one", "law"]);
  });

  it("drops a section left with no blocks", () => {
    expect(resolveLegal(doc, EMPTY, "en").sections.map((s) => s.heading)).toEqual(["One", "Law"]);
  });

  it("fills the tokens once the values are set, and shows the gated lines", () => {
    const r = resolveLegal(doc, { ...EMPTY, legalName: "Example LLC", address: "Dubai", dataRequestContact: "privacy@example.com", whatsapp: "+971 50 000 0000" }, "en");
    const text = JSON.stringify(r);
    expect(text).toContain("The legal entity is Example LLC, Dubai.");
    expect(text).toContain("WhatsApp (Meta)");
    expect(text).toContain("Write to privacy@example.com.");
    expect(text).toContain("Disputes go to the courts of Dubai; the Arabic version prevails.");
  });
});

describe("the legal pages' content (src/content/legal.ts)", () => {
  it("has the three documents, each with sections in both locales and no unfilled token once every value is set", () => {
    expect(legalDocs.map((d) => d.slug)).toEqual(["privacy", "terms", "cookies"]);
    const all = { legalName: "L", address: "A", dataRequestContact: "C", whatsapp: "W", courts: "X", prevailingLanguage: "Y" };
    for (const d of legalDocs) {
      for (const l of ["en", "ar"] as const) {
        const text = JSON.stringify(resolveLegal(d, all, l));
        expect(text, `${d.slug}.${l}`).not.toMatch(/\{[a-zA-Z]+\}/);
        expect(text, `${d.slug}.${l}`).not.toMatch(/TODO/);
      }
    }
  });

  it("lists WhatsApp (Meta) in the privacy policy, gated on the WhatsApp number, before the button can show (D78)", () => {
    const privacy = legalDocs.find((d) => d.slug === "privacy")!;
    const withNumber = resolveLegal(privacy, { ...EMPTY, whatsapp: "+971 50 000 0000" }, "en");
    const without = resolveLegal(privacy, EMPTY, "en");
    expect(JSON.stringify(withNumber)).toMatch(/WhatsApp.*Meta/);
    expect(JSON.stringify(without)).not.toContain("WhatsApp (Meta)");
    const ar = JSON.stringify(resolveLegal(privacy, { ...EMPTY, whatsapp: "+971 50 000 0000" }, "ar"));
    expect(ar).toMatch(/واتساب.*Meta/);
  });

  it("names the company only as NO TIME Creative House, in Latin, in both languages", () => {
    const text = JSON.stringify(legalDocs);
    expect(text).not.toContain("نو تايم");
    expect(text).not.toContain("شركة NO TIME");
  });

  it("carries the AI-image disclosure line in the Terms (D77)", () => {
    const terms = JSON.stringify(legalDocs.find((d) => d.slug === "terms"));
    expect(terms).toContain("Some images on this site are AI-generated illustrations.");
    expect(terms).toContain("بعض الصور في هذا الموقع توضيحية ومولّدة بالذكاء الاصطناعي.");
  });
});
