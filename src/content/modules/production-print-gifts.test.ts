import { describe, expect, it } from "vitest";
import { copyProblems } from "@/lib/copy-rules";
import { ORDER_STEPS, PRINT_ORDER_COPY } from "./print-order";

/** Every localized string of the Workshop's module (print-order, D83), keyed for the report. */
const fields: [string, { en: string; ar: string }][] = [
  ...Object.entries(PRINT_ORDER_COPY).map(([k, v]) => [`print-order.${k}`, v] as [string, { en: string; ar: string }]),
  ...ORDER_STEPS.flatMap((s) => [[`print-order.${s.id}.title`, s.title], [`print-order.${s.id}.line`, s.line]] as [string, { en: string; ar: string }][]),
];

describe("the Workshop module's copy", () => {
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

  it("keeps the print-ordering steps in order: item, artwork, proof, print", () => {
    expect(ORDER_STEPS.map((s) => s.id)).toEqual(["item", "artwork", "proof", "print"]);
  });
});
