import { describe, expect, it } from "vitest";
import { copyProblems } from "@/lib/copy-rules";
import { errorMessages, formCopy, requiredMessages } from "../form-copy";
import * as page from "./page";

type Loc = { en: string; ar: string };
const isLoc = (v: unknown): v is Loc => typeof v === "object" && v !== null && "en" in v && "ar" in v && typeof (v as Loc).en === "string";
/** Every localized string in the data, with its path. */
function strings(value: unknown, path: string): [string, Loc][] {
  if (isLoc(value)) return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}.${i}`));
  if (typeof value === "object" && value !== null) return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

/** The Software brief's own banned list, on top of the site's (software-brief.md, copy standard 2026-11-11). */
const SOFTWARE_BANNED = ["innovative solution", "digital transformation", "seamless", "world-class", "حلول مبتكرة", "التحول الرقمي", "بيئات", "نقوم بعملية", "حلول متكاملة"];

describe("Software & Digital copy (D91)", () => {
  const all = [
    ...strings(page, "software"),
    ...strings(formCopy, "forms"),
    ...strings(errorMessages, "forms.errors"),
    ...strings(requiredMessages, "forms.required"),
  ];

  it("is written in both languages", () => {
    expect(all.length).toBeGreaterThan(100);
    for (const [k, t] of all) expect(t.en.trim() && t.ar.trim(), k).toBeTruthy();
  });

  it("follows the voice rules and the brief's banned list", () => {
    const problems = all.flatMap(([k, t]) => [
      ...copyProblems(k, t.en, "en"),
      // «في الموقع» means the website on this page, so only the shared banned list applies in Arabic.
      ...copyProblems(k, t.ar, "ar").filter((p) => !p.includes("is ambiguous on a website")),
      ...SOFTWARE_BANNED.filter((w) => `${t.en} ${t.ar}`.toLowerCase().includes(w)).map((w) => `${k} contains "${w}"`),
    ]);
    expect(problems).toEqual([]);
  });

  it("names no price: every project is scoped and quoted individually", () => {
    for (const [k, t] of all) expect(`${t.en} ${t.ar}`, k).not.toMatch(/\bAED\b|\$\s?\d|USD|درهم|دولار/);
  });

  it("makes only the two approved promises (one working day; 5 improvements in 3 working days)", () => {
    for (const [k, t] of all) {
      for (const m of t.en.matchAll(/within (\w+) (working )?(days|day|hours|weeks)\b/gi)) {
        expect(["one working day", "3 working days"], `${k}: "${m[0]}"`).toContain(`${m[1]} ${m[2] ?? ""}${m[3]}`.toLowerCase());
      }
    }
  });
});
