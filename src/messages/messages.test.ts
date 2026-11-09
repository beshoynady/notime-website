import { readFileSync } from "node:fs";
import { copyProblems } from "@/lib/copy-rules";
import path from "node:path";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import ar from "./ar.json";
import en from "./en.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else Object.assign(out, flatten(v, key));
  }
  return out;
}

const EN = flatten(en as Tree);
const AR = flatten(ar as Tree);

/** Latin tokens allowed inside Arabic strings (brand names, acronyms, fixed UI). */
const AR_LATIN_ALLOW = [
  "NO TIME",
  "Creative House",
  "CREATIVE HOUSE",
  "English", // endonym on the language toggle: each language is named in its own script
  "WhatsApp",
  "iOS",
  "Android",
  // Library names on the styleguide's motion tokens (proper nouns, like WhatsApp).
  "ScrollTrigger",
  "GSAP",
  "Motion",
  "UI/UX",
  "SEO",
  "QR",
  "AI",
  "TC",
  "EN",
  "TODO",
  "N",
  "E",
];

describe("messages", () => {
  it("has content", () => {
    expect(Object.keys(EN).length).toBeGreaterThan(0);
  });

  it("en and ar have identical keys", () => {
    expect(Object.keys(AR).sort()).toEqual(Object.keys(EN).sort());
  });

  // Loops collect violations and assert once: one expect per key (and per phrase) made these
  // tests slow enough to time out on a loaded machine.
  it("no value is empty", () => {
    const empty = [...Object.entries(EN), ...Object.entries(AR)].filter(([, v]) => v.trim() === "").map(([k]) => k);
    expect(empty).toEqual([]);
  });

  it("arabic strings contain no Latin words outside the allow-list", () => {
    const bad: string[] = [];
    for (const [k, v] of Object.entries(AR)) {
      // Strip ICU syntax: `{count, plural,` selectors, `one {` keywords, `{year}` placeholders.
      let rest = v
        .replace(/\{\s*\w+\s*,\s*(?:plural|select|selectordinal)\s*,/g, "{")
        .replace(/\b(?:zero|one|two|few|many|other)\s*\{/g, "{")
        .replace(/=\d+\s*\{/g, "{")
        .replace(/\{\s*\w+\s*\}/g, "");
      for (const token of AR_LATIN_ALLOW) rest = rest.split(token).join("");
      if (/[A-Za-z]/.test(rest)) bad.push(`ar:${k} → "${v}"`);
    }
    expect(bad).toEqual([]);
  });

  it("arabic strings use Arabic punctuation, not Latin comma or question mark", () => {
    const bad = Object.entries(AR)
      .filter(([, v]) => /[؀-ۿ]\s*,|[؀-ۿ]\s*\?/.test(v))
      .map(([k]) => `ar:${k}`);
    expect(bad).toEqual([]);
  });

  // Copy decks: phrases the brand voice rules out, and «في الموقع» for on-site (copy-rules.ts).
  it("follows the copy rules: no banned phrases, no ambiguous «في الموقع»", () => {
    const hits = [
      ...Object.entries(EN).flatMap(([k, v]) => copyProblems(k, v, "en")),
      ...Object.entries(AR).flatMap(([k, v]) => copyProblems(k, v, "ar")),
    ];
    expect(hits).toEqual([]);
  });

  it("copy rules catch a banned filler word and an on-site «في الموقع»", () => {
    expect(copyProblems("x", "في خطة واحدة متكاملة.", "ar")).toHaveLength(1);
    expect(copyProblems("x", "إدارة العلاقات العامة في الموقع", "ar")).toHaveLength(1);
    expect(copyProblems("styleguide.closing.body", "كل قسم في الموقع", "ar")).toEqual([]);
    expect(copyProblems("x", "إدارة العلاقات العامة في أرض الحدث", "ar")).toEqual([]);
  });

  it("has every homepage namespace of the copy deck", () => {
    for (const ns of ["about", "categories", "work", "marquee", "digital", "process", "markets", "cta", "footer"]) {
      expect(Object.keys(EN).some((k) => k.startsWith(`${ns}.`)), ns).toBe(true);
    }
  });

  // Placeholders in messages start with "TODO:" (ICU reserves braces, so `{{TODO}}` would not
  // parse). Each one must be tracked in the content checklist by its key.
  it("lists every TODO message key in docs/CONTENT_CHECKLIST.md", () => {
    const checklist = readFileSync(path.join(process.cwd(), "docs", "CONTENT_CHECKLIST.md"), "utf8");
    const todo = Object.keys(EN).filter((k) => /\bTODO\b/.test(EN[k]) || /\bTODO\b/.test(AR[k]));
    const bad: string[] = [];
    for (const k of todo) {
      if (!/^TODO:/.test(EN[k])) bad.push(`en:${k} must start with "TODO:"`);
      if (!/^TODO:/.test(AR[k])) bad.push(`ar:${k} must start with "TODO:"`);
      if (!checklist.includes(`\`${k}\``)) bad.push(`${k} missing from CONTENT_CHECKLIST.md`);
    }
    expect(bad).toEqual([]);
  });

  it("keeps the approved anchor lines verbatim", () => {
    expect(EN["hero.titleLine1"]).toBe("IT'S TIME");
    expect(EN["hero.title.create.line2"]).toBe("TO CREATE.");
    expect(AR["hero.titleLine1"]).toBe("حان وقت");
    expect(AR["hero.title.create.line2"]).toBe("الإبداع.");
    // The brand line (D54), live through HERO_LINE = "start" in src/config/hero.ts.
    expect(EN["hero.title.start.line2"]).toBe("TO START.");
    expect(EN["hero.title.start.label"]).toBe("It's time to start.");
    expect(AR["hero.title.start.line2"]).toBe("البداية.");
    expect(AR["hero.title.start.label"]).toBe("حان وقت البداية.");
    expect(EN["hero.lead"]).toBe(
      "Events, creative production, marketing and digital solutions, planned and delivered by one house.",
    );
    expect(AR["hero.lead"]).toBe("فعاليات، إنتاج إبداعي، تسويق وحلول رقمية، نخطط لها وننفذها تحت سقف واحد.");
    expect(EN["hero.beatLead"] + " " + EN["hero.beatKey"]).toBe("Every second is planned.");
    expect(AR["hero.beatLead"] + " " + AR["hero.beatKey"]).toBe("كل ثانية محسوبة.");
    expect(EN["megaMenu.headingLead"] + " " + EN["megaMenu.headingKey"]).toBe("One house. Five crafts.");
    expect(AR["megaMenu.headingLead"] + " " + AR["megaMenu.headingKey"]).toBe("بيت واحد. خمس حِرَف.");
  });
});

/**
 * Arabic UI and data use Western digits (30, not ٣٠). ICU's plural `#` and `{x, number}` go through
 * Intl.NumberFormat("ar"), which gives Arabic-Indic digits in Chrome (Node's ICU 78 gives Western ones,
 * so the two would also disagree at hydration). A plain `{count}` is rendered with String(), so it is
 * always Western. "ar-u-nu-arab" forces the Arabic-Indic case on every machine.
 */
describe("arabic numerals", () => {
  const INDIC = /[٠-٩۰-۹]/;
  const t = createTranslator({ locale: "ar-u-nu-arab", messages: ar });

  it("the mega menu counts read 30, not ٣٠", () => {
    expect(t("megaMenu.count", { count: 30 })).toBe("30 خدمة");
    expect(t("megaMenu.count", { count: 7 })).toBe("7 خدمات");
    expect(t("megaMenu.allServices", { count: 30 })).toBe("جميع الخدمات (30)");
  });

  it("no arabic message formats a number with Arabic-Indic digits", () => {
    const bad: string[] = [];
    for (const [key, msg] of Object.entries(AR)) {
      // Only a message with an argument can format a number: a static one is checked as written,
      // and rich text is covered by the pattern check below.
      if (!msg.includes("{") || msg.includes("<")) {
        if (INDIC.test(msg)) bad.push(key);
        continue;
      }
      const args = Object.fromEntries([...msg.matchAll(/\{(\w+)/g)].map(([, name]) => [name, 30]));
      if (INDIC.test(t(key as never, args as never))) bad.push(key);
    }
    expect(bad).toEqual([]);
  });

  it("no arabic message uses # or a number format", () => {
    const bad = Object.entries(AR)
      .filter(([, msg]) => /#|,\s*number/.test(msg))
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });
});
