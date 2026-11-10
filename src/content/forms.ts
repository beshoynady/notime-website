import type { Localized } from "./types";

/**
 * Form data (D78 §3, approved 2026-11-09). Budget bands describe the visitor's budget, never
 * NO TIME's prices. AED, Western digits (D50), optional, and "Prefer not to say" always last.
 * Events bands serve the consultation and event quote; software bands the digital quote.
 */
export type BudgetBand = { value: string; label: Localized<string> };

const PREFER_NOT: BudgetBand = { value: "prefer-not", label: { en: "Prefer not to say", ar: "أفضّل عدم التحديد" } };

export const budgetBands: Record<"events" | "software", BudgetBand[]> = {
  events: [
    { value: "ev-under-50k", label: { en: "Under AED 50,000", ar: "أقل من 50,000 درهم" } },
    { value: "ev-50k-150k", label: { en: "AED 50,000–150,000", ar: "50,000–150,000 درهم" } },
    { value: "ev-150k-500k", label: { en: "AED 150,000–500,000", ar: "150,000–500,000 درهم" } },
    { value: "ev-500k-1m", label: { en: "AED 500,000–1,000,000", ar: "500,000–1,000,000 درهم" } },
    { value: "ev-over-1m", label: { en: "Over AED 1,000,000", ar: "أكثر من 1,000,000 درهم" } },
    PREFER_NOT,
  ],
  software: [
    { value: "sw-under-25k", label: { en: "Under AED 25,000", ar: "أقل من 25,000 درهم" } },
    { value: "sw-25k-75k", label: { en: "AED 25,000–75,000", ar: "25,000–75,000 درهم" } },
    { value: "sw-75k-150k", label: { en: "AED 75,000–150,000", ar: "75,000–150,000 درهم" } },
    { value: "sw-150k-300k", label: { en: "AED 150,000–300,000", ar: "150,000–300,000 درهم" } },
    { value: "sw-over-300k", label: { en: "Over AED 300,000", ar: "أكثر من 300,000 درهم" } },
    PREFER_NOT,
  ],
};
