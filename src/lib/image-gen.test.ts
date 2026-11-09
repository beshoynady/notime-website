import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { budgetProblem, buildPrompt, centreCrop, deliverySize, findSlot, inboxTarget, loggedSpend, provenance, sceneCategory } from "./image-gen";

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

describe("inboxTarget (D79: a file in assets-inbox/ names its slot)", () => {
  it("matches a site slot by its full id", () => {
    expect(inboxTarget("hero-fallback-16x9.png", PROMPTS, LAYERS)).toEqual({ slot: "hero-fallback-16x9", kind: "site", aspect: "16:9", cutout: false, master: "hero-fallback-16x9" });
  });

  it("matches a scene plate and its aspect from the suffix; the 9:16 master keeps the suffix", () => {
    expect(inboxTarget("ev-open-hall-16x9.png", PROMPTS, LAYERS)).toMatchObject({ slot: "ev-open-hall", kind: "scene", aspect: "16:9", cutout: false, master: "ev-open-hall" });
    expect(inboxTarget("ev-majlis-dusk-9x16.jpg", PROMPTS, LAYERS)).toMatchObject({ slot: "ev-majlis-dusk", aspect: "9:16", master: "ev-majlis-dusk-9x16" });
  });

  it("treats a real-source layer's AI fallback as a cutout", () => {
    expect(inboxTarget("ev-open-candles-4x5.png", PROMPTS, LAYERS)).toMatchObject({ slot: "ev-open-candles", aspect: "4:5", cutout: true });
  });

  it("refuses an unknown slot, an aspect the slot doesn't have, or a name without an aspect", () => {
    expect(() => inboxTarget("ev-open-hall-4x5.png", PROMPTS, LAYERS)).toThrow(/aspect/);
    expect(() => inboxTarget("nope-16x9.png", PROMPTS, LAYERS)).toThrow(/not found/);
    expect(() => inboxTarget("ev-open-hall.png", PROMPTS, LAYERS)).toThrow(/aspect/);
  });
});

describe("centreCrop (D51: the largest centred crop at the aspect, never enlarged)", () => {
  it("crops ChatGPT's 1536 × 1024 landscape to 1536 × 864 for 16:9", () => {
    expect(centreCrop(1536, 1024, "16:9")).toEqual({ left: 0, top: 80, width: 1536, height: 864 });
  });

  it("crops the 1024 × 1536 portrait to 864 × 1536 for 9:16", () => {
    expect(centreCrop(1024, 1536, "9:16")).toEqual({ left: 80, top: 0, width: 864, height: 1536 });
  });

  it("keeps even dimensions inside the source", () => {
    const c = centreCrop(1023, 1023, "4:5");
    expect(c.width / c.height).toBeCloseTo(0.8, 2);
    expect(c.left + c.width).toBeLessThanOrEqual(1023);
    expect(c.width % 2 + (c.height % 2)).toBe(0);
  });
});
