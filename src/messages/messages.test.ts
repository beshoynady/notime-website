import { readFileSync } from "node:fs";
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

  it("no value is empty", () => {
    for (const [k, v] of [...Object.entries(EN), ...Object.entries(AR)]) {
      expect(v.trim(), k).not.toBe("");
    }
  });

  it("arabic strings contain no Latin words outside the allow-list", () => {
    for (const [k, v] of Object.entries(AR)) {
      // Strip ICU syntax: `{count, plural,` selectors, `one {` keywords, `{year}` placeholders.
      let rest = v
        .replace(/\{\s*\w+\s*,\s*(?:plural|select|selectordinal)\s*,/g, "{")
        .replace(/\b(?:zero|one|two|few|many|other)\s*\{/g, "{")
        .replace(/=\d+\s*\{/g, "{")
        .replace(/\{\s*\w+\s*\}/g, "");
      for (const token of AR_LATIN_ALLOW) rest = rest.split(token).join("");
      expect(rest, `ar:${k} → "${v}"`).not.toMatch(/[A-Za-z]/);
    }
  });

  it("arabic strings use Arabic punctuation, not Latin comma or question mark", () => {
    for (const [k, v] of Object.entries(AR)) {
      expect(v, `ar:${k}`).not.toMatch(/[؀-ۿ]\s*,|[؀-ۿ]\s*\?/);
    }
  });

  // Copy deck (Task 13): phrases the brand voice rules out, in both languages.
  const BANNED = ["elevate", "cutting-edge", "cutting edge", "one-stop", "one stop", "unleash", "الارتقاء بعلامتك", "متطور جدًا", "حلول متكاملة شاملة"];

  it("uses none of the banned phrases", () => {
    for (const [k, v] of [...Object.entries(EN), ...Object.entries(AR)]) {
      for (const phrase of BANNED) expect(v.toLowerCase(), `${k} contains "${phrase}"`).not.toContain(phrase);
    }
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
    for (const k of todo) {
      expect(EN[k], `en:${k} must start with "TODO:"`).toMatch(/^TODO:/);
      expect(AR[k], `ar:${k} must start with "TODO:"`).toMatch(/^TODO:/);
      expect(checklist, `${k} missing from CONTENT_CHECKLIST.md`).toContain(`\`${k}\``);
    }
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
    for (const [key, msg] of Object.entries(AR)) {
      if (msg.includes("<")) continue; // rich text: covered by the pattern check below
      const args = Object.fromEntries([...msg.matchAll(/\{(\w+)/g)].map(([, name]) => [name, 30]));
      expect(t(key as never, args as never), key).not.toMatch(INDIC);
    }
  });

  it("no arabic message uses # or a number format", () => {
    for (const [key, msg] of Object.entries(AR)) {
      expect(msg, key).not.toMatch(/#|,\s*number/);
    }
  });
});
