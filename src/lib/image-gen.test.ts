import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { budgetProblem, buildPrompt, deliverySize, findSlot, loggedSpend, provenance, sceneCategory } from "./image-gen";

const doc = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");
const PROMPTS = doc("docs/content/image-prompts.md");
const LAYERS = doc("docs/design/storyboards/layers.md");

describe("findSlot", () => {
  it("reads a site slot's prompt and aspect from image-prompts.md", () => {
    const s = findSlot("product-restaurant-system-16x9", PROMPTS, LAYERS);
    expect(s.kind).toBe("site");
    expect(s.aspects).toEqual(["16:9"]);
    expect(s.prompt.startsWith("A restaurant pass at service time")).toBe(true);
    expect(s.prompt).not.toMatch(/^House style/);
  });

  it("reads a scene layer's prompt and both aspects from layers.md", () => {
    const s = findSlot("ev-open-hall", PROMPTS, LAYERS);
    expect(s.kind).toBe("scene");
    expect(s.aspects).toEqual(["16:9", "9:16"]);
    expect(s.prompt).toMatch(/^A wide empty banquet hall/);
  });

  it("refuses a slot with a real source and no AI prompt", () => {
    expect(() => findSlot("ev-open-table", PROMPTS, LAYERS)).toThrow(/real source/);
  });

  it("refuses an unknown or cancelled slot", () => {
    expect(() => findSlot("nope-16x9", PROMPTS, LAYERS)).toThrow(/not found/);
    expect(() => findSlot("cat-marketing-brand-16x9", PROMPTS, LAYERS)).toThrow(/cancelled/);
  });
});

describe("buildPrompt", () => {
  it("joins the house style, the slot prompt and the negative prompt as an avoid list", () => {
    const p = buildPrompt(PROMPTS, "A quiet room.");
    expect(p).toMatch(/^Cinematic still photograph/);
    expect(p).toContain("A quiet room.");
    expect(p).toMatch(/Avoid: text, letters, numbers, logos/);
    expect(p).not.toContain("> ");
  });
});

describe("deliverySize", () => {
  it("is the approved native size per aspect (D51)", () => {
    expect(deliverySize("16:9")).toEqual({ width: 1680, height: 944 });
    expect(deliverySize("9:16")).toEqual({ width: 944, height: 1680 });
    expect(deliverySize("4:5")).toEqual({ width: 1136, height: 1408 });
  });
});

describe("sceneCategory", () => {
  it("maps a layer prefix to its category", () => {
    expect(sceneCategory("ev-majlis-dusk")).toBe("events-hospitality");
    expect(sceneCategory("pg-open-bench")).toBe("production-print-gifts");
    expect(() => sceneCategory("hero-fallback-16x9")).toThrow();
  });
});

describe("budget", () => {
  const log = [
    "Approved budget: USD 1.50",
    "| 2026-11-10 | ev-open-hall | 16:9 | m | 2752×1536 | 1 | 0.06 | p1 | generated |",
    "| 2026-11-10 | ev-open-hall | 9:16 | m | 1536×2752 | 2 | 0.06 | p2 | generated |",
  ].join("\n");

  it("sums the logged estimated costs", () => {
    expect(loggedSpend(log)).toBeCloseTo(0.12);
  });

  it("refuses without an approved budget, and past it", () => {
    expect(budgetProblem("Approved budget: none", 0.06)).toMatch(/no approved budget/);
    expect(budgetProblem(log, 0.06)).toBeNull();
    expect(budgetProblem(log.replace("1.50", "0.15"), 0.06)).toMatch(/over the approved budget/);
  });
});

describe("provenance (D77: check AI markers before converting)", () => {
  const bytes = (...parts: string[]) => new TextEncoder().encode(parts.join(""));
  const PNG = "\x89PNG\r\n\x1a\n";

  it("finds a C2PA manifest in a PNG caBX chunk or a JUMBF box labelled c2pa", () => {
    expect(provenance(bytes(PNG, "....caBX....jumb....jumd....c2pa....")).c2pa).toBe(true);
    expect(provenance(bytes("\xff\xd8\xff\xebJP..jumb....jumd....c2pa.manifest")).c2pa).toBe(true);
  });

  it("finds the IPTC 'trained algorithmic media' source type in XMP", () => {
    const xmp = '<x:xmpmeta><Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType></x:xmpmeta>';
    expect(provenance(bytes(PNG, "....iTXtXML:com.adobe.xmp", xmp))).toEqual({ c2pa: false, iptcAi: true });
  });

  it("reports nothing on a plain image, and ignores a stray 'c2pa' outside a JUMBF box", () => {
    expect(provenance(bytes(PNG, "....IHDR....IDATc2pa....IEND"))).toEqual({ c2pa: false, iptcAi: false });
  });
});
