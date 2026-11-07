import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCategories, getCategory, getImageSlot, getImageSlots, getProducts, getServices } from "./index";

const locales = ["en", "ar"] as const;

describe("categories", () => {
  it("has 5 categories ordered 1–5", () => {
    const cats = getCategories();
    expect(cats).toHaveLength(5);
    expect(cats.map((c) => c.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("every category has bilingual title and summary and resolvable images", () => {
    for (const c of getCategories()) {
      for (const l of locales) {
        expect(c.title[l].trim(), `${c.slug}.title.${l}`).not.toBe("");
        expect(c.summary[l].trim(), `${c.slug}.summary.${l}`).not.toBe("");
      }
      expect(getImageSlot(c.image).aspect).toBe("4:5");
      expect(getImageSlot(c.imageWide).aspect).toBe("16:9");
    }
  });

  it("looks up by slug", () => {
    expect(getCategory("software-digital")?.order).toBe(5);
    expect(getCategory("nope" as never)).toBeUndefined();
  });
});

describe("services", () => {
  const services = getServices();

  it("has exactly 30 services, 6 per category", () => {
    expect(services).toHaveLength(30);
    for (const c of getCategories()) expect(getServices(c.slug), c.slug).toHaveLength(6);
  });

  it("slugs are unique and url-safe", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("orders are 1..6 within each category and results are sorted", () => {
    for (const c of getCategories()) {
      expect(getServices(c.slug).map((s) => s.order)).toEqual([1, 2, 3, 4, 5, 6]);
    }
  });

  it("every service is bilingual and its image resolves", () => {
    for (const s of services) {
      for (const l of locales) {
        expect(s.title[l].trim(), `${s.slug}.title.${l}`).not.toBe("");
        expect(s.summary[l].trim(), `${s.slug}.summary.${l}`).not.toBe("");
        expect(s.imageAlt[l].trim(), `${s.slug}.imageAlt.${l}`).not.toBe("");
      }
      expect(() => getImageSlot(s.image)).not.toThrow();
    }
  });

  it("all services stay draft until services-list.md is approved", () => {
    expect(services.every((s) => s.status === "draft")).toBe(true);
  });
});

describe("products", () => {
  it("has the QR check-in and restaurant systems, both coming soon", () => {
    const products = getProducts();
    expect(products.map((p) => p.slug)).toEqual(["qr-check-in", "restaurant-system"]);
    expect(products.every((p) => p.status === "comingSoon")).toBe(true);
    for (const p of products) expect(() => getImageSlot(p.image)).not.toThrow();
  });
});

describe("image slots", () => {
  it("ids are unique, alts are bilingual, and unknown ids throw", () => {
    const ids = getImageSlots().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of getImageSlots()) {
      for (const l of locales) expect(s.alt[l].trim(), `${s.id}.alt.${l}`).not.toBe("");
    }
    expect(() => getImageSlot("missing-slot")).toThrow();
  });

  // Task 14: every slot has exactly one art-direction entry (`### \`<id>\``) and vice versa.
  it("matches docs/content/image-prompts.md one to one", () => {
    const doc = readFileSync(path.join(process.cwd(), "docs", "content", "image-prompts.md"), "utf8");
    const documented = [...doc.matchAll(/^### `([a-z0-9-]+)`/gm)].map((m) => m[1]);
    expect(new Set(documented).size, "duplicate entries in image-prompts.md").toBe(documented.length);
    expect([...documented].sort()).toEqual(getImageSlots().map((s) => s.id).sort());
    // The documented alt texts are the ones the site renders.
    for (const s of getImageSlots()) {
      const entry = doc.split(/^### /m).find((e) => e.startsWith(`\`${s.id}\``))!;
      expect(entry, `${s.id} alt EN`).toContain(`**Alt EN:** ${s.alt.en}`);
      expect(entry, `${s.id} alt AR`).toContain(`**Alt AR:** ${s.alt.ar}`);
    }
  });

  it("no AI image is marked as real documentation", () => {
    for (const s of getImageSlots()) if (s.kind === "ai") expect(s.src === null || s.src.startsWith("/images/ai/")).toBe(true);
  });
});
