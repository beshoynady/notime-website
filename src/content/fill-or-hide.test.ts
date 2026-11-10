import { describe, expect, it } from "vitest";
import { budgetBands } from "./forms";
import { getImageSlot } from "./index";
import { principles } from "./principles";
import { BRANDED_PHOTO_DIRS, CLIENT_NAMES, workItems, workView } from "./work";

/** The D78 data moves (approved 2026-11-09, docs/content/review-fill-or-hide.md). */
describe("budget bands (D78 §3)", () => {
  it("has five AED bands per kind, then 'Prefer not to say' last", () => {
    for (const kind of ["events", "software"] as const) {
      const bands = budgetBands[kind];
      expect(bands, kind).toHaveLength(6);
      expect(bands.at(-1)!.value).toBe("prefer-not");
      expect(bands.at(-1)!.label).toEqual({ en: "Prefer not to say", ar: "أفضّل عدم التحديد" });
      for (const b of bands.slice(0, -1)) {
        expect(b.label.en).toMatch(/AED/);
        expect(b.label.ar).toMatch(/درهم$/);
        expect(b.label.ar, "Western digits in Arabic (D50)").not.toMatch(/[٠-٩]/);
      }
    }
    expect(new Set([...budgetBands.events, ...budgetBands.software].map((b) => b.value)).size).toBe(11);
  });
});

describe("principles (D78 §5)", () => {
  it("are the four approved principles, unnumbered, in both languages", () => {
    expect(principles.map((p) => p.title.en)).toEqual(["Under one roof", "From the concept to the guest", "Arabic and English, natively", "Six markets, one standard"]);
    for (const p of principles) for (const l of ["en", "ar"] as const) expect(p.line[l].trim()).not.toBe("");
    expect(principles.some((p) => "order" in p || "number" in p)).toBe(false);
  });
});

describe("anonymised work (D78 §6)", () => {
  it("lists the three approved cases, with the user's label for the airline", () => {
    expect(workItems.map((w) => w.key)).toEqual(["uaeaf", "egyptair", "uaepl"]);
    expect(workItems.find((w) => w.key === "egyptair")!.anonymous.label).toEqual({ en: "A national airline", ar: "شركة طيران وطنية" });
  });

  it("keeps Arabian Travel Market, a venue, in the airline case", () => {
    const w = workItems.find((x) => x.key === "egyptair")!;
    expect(w.anonymous.summary.en).toContain("Arabian Travel Market");
    expect(w.anonymous.summary.ar).toContain("سوق السفر العربي");
  });

  it("shows no client name and no branded photo while a case is anonymous", () => {
    for (const w of workItems) {
      const v = workView(w, false);
      expect(v.named).toBe(false);
      const text = [v.label.en, v.label.ar, v.summary.en, v.summary.ar].join(" ");
      for (const name of CLIENT_NAMES) expect(text, `${w.key} mentions ${name}`).not.toContain(name);
      const slot = getImageSlot(v.image!);
      expect(slot.illustrative, `${w.key}: a stand-in carries the Illustrative label`).toBe(true);
      for (const dir of BRANDED_PHOTO_DIRS) expect(slot.src ?? "", `${w.key} uses a branded photo`).not.toContain(dir);
    }
  });

  it("switches to the named version only when its flag is on", () => {
    for (const w of workItems) {
      const v = workView(w, true);
      expect(v.named).toBe(true);
      expect(v.label).toEqual(w.named.label);
    }
  });
});
