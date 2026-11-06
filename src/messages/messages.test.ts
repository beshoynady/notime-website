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

  it("keeps the approved anchor lines verbatim", () => {
    expect(EN["hero.titleLine1"]).toBe("IT'S TIME");
    expect(EN["hero.titleLine2"]).toBe("TO CREATE.");
    expect(AR["hero.titleLine1"]).toBe("حان وقت");
    expect(AR["hero.titleLine2"]).toBe("الإبداع.");
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
