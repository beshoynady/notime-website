import { describe, expect, it } from "vitest";
import { copyProblems } from "@/lib/copy-rules";
import { HUMAN_SCALE_COPY, SCALE_FORMATS } from "./human-scale";
import { ORDER_STEPS, PRINT_ORDER_COPY } from "./print-order";

/** Every localized string of the Workshop's two modules (D83), keyed for the report. */
const fields: [string, { en: string; ar: string }][] = [
  ...Object.entries(HUMAN_SCALE_COPY).map(([k, v]) => [`human-scale.${k}`, v] as [string, { en: string; ar: string }]),
  ...SCALE_FORMATS.flatMap((f) => [[`human-scale.${f.id}.name`, f.name], [`human-scale.${f.id}.basis`, f.basis]] as [string, { en: string; ar: string }][]),
  ...Object.entries(PRINT_ORDER_COPY).map(([k, v]) => [`print-order.${k}`, v] as [string, { en: string; ar: string }]),
  ...ORDER_STEPS.flatMap((s) => [[`print-order.${s.id}.title`, s.title], [`print-order.${s.id}.line`, s.line]] as [string, { en: string; ar: string }][]),
];

describe("the Workshop modules' copy", () => {
  it("is written in both languages", () => {
    expect(fields.filter(([, t]) => !t.en.trim() || !t.ar.trim()).map(([k]) => k)).toEqual([]);
  });

  it("follows the voice rules (copy-rules.ts)", () => {
    expect(fields.flatMap(([k, t]) => [...copyProblems(k, t.en, "en"), ...copyProblems(k, t.ar, "ar")])).toEqual([]);
  });

  it("names no price, currency, lead time or cart (D58, D78)", () => {
    const banned = /\b(AED|USD|price|cost|cart|basket|checkout|days?|hours?)\b|درهم|سعر|أسعار|سلة|الدفع|أيام|ساعات/i;
    expect(fields.filter(([, t]) => banned.test(t.en) || banned.test(t.ar)).map(([k]) => k)).toEqual([]);
  });

  it("states sizes only as typical formats: a standard or a common size, never a capability", () => {
    for (const f of SCALE_FORMATS) expect(f.basis.en, f.id).toMatch(/^(ISO A\d|A common .+ size)$/);
  });

  it("keeps the print-store promise's order of steps: item, artwork, proof, print", () => {
    expect(ORDER_STEPS.map((s) => s.id)).toEqual(["item", "artwork", "proof", "print"]);
  });
});
