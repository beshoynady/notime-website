import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { imageSize } from "@/lib/image-size";
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

  it("every service is approved (D56)", () => {
    expect(services.every((s) => s.status === "approved")).toBe(true);
  });

  it("matches the approved list in docs/content/services-list.md (slug, anchor, EN and AR titles, order)", () => {
    const md = readFileSync(path.join(process.cwd(), "docs/content/services-list.md"), "utf8");
    const rows = [...md.matchAll(/^\| (\d+) \| ([a-z0-9-]+) \| ([a-z0-9-]+) \| (.+?) \| (.+?) \|$/gm)].map((m) => ({
      n: Number(m[1]),
      slug: m[2],
      anchor: m[3],
      en: m[4],
      ar: m[5],
    }));
    expect(rows).toHaveLength(30);
    expect(rows.map((r) => r.n)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(services.map((s) => ({ slug: s.slug, anchor: s.anchor, en: s.title.en, ar: s.title.ar }))).toEqual(
      rows.map(({ slug, anchor, en, ar }) => ({ slug, anchor, en, ar })),
    );
  });

  // D57: category pages. Anchors are section ids, the same in EN and AR, never renamed.
  it("anchors are unique and kebab-case", () => {
    const anchors = services.map((s) => s.anchor);
    expect(new Set(anchors).size).toBe(30);
    for (const a of anchors) expect(a).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("every service has 4–6 'what we deliver' points, the same count in EN and AR", () => {
    for (const s of services) {
      expect(s.points.en.length, s.slug).toBeGreaterThanOrEqual(4);
      expect(s.points.en.length, s.slug).toBeLessThanOrEqual(6);
      expect(s.points.ar.length, s.slug).toBe(s.points.en.length);
      for (const l of locales) for (const p of s.points[l]) expect(p.trim(), `${s.slug}.points.${l}`).not.toBe("");
    }
  });

  it("each service has the signature module from docs/design/category-pages.md §6", () => {
    expect(Object.fromEntries(services.map((s) => [s.anchor, s.signatureModule]))).toEqual(SIGNATURE_MODULES);
  });

  it("relatedWork stays empty until the client confirms names (OQ #17)", () => {
    for (const s of services) expect(s.relatedWork, s.slug).toEqual([]);
  });
});

const SIGNATURE_MODULES = {
  conferences: "agenda-timeline",
  exhibitions: "stand-assembly",
  launches: "launch-reveal",
  celebrations: "candle-moodboard",
  hospitality: "menu-majlis",
  stage: "stage-lights",
  photography: "aperture-gallery",
  video: "scrub-reel",
  motion: "motion-playground",
  "ai-content": "idea-to-image",
  "set-design": "set-model",
  rental: "rental-categories",
  branding: "mark-build",
  social: "phone-feed",
  "digital-marketing": "example-dashboard",
  "content-strategy": "content-calendar",
  pr: "press-release",
  "media-planning": "flighting-chart",
  "large-format": "human-scale",
  fabrication: "build-layers",
  packaging: "unboxing",
  gifts: "gift-configurator",
  "print-store": "print-order",
  merchandise: "merch-placement",
  websites: "responsive-frames",
  apps: "app-screens",
  systems: "data-flow",
  "e-commerce": "checkout-flow",
  ux: "fidelity-slider",
  "ai-consulting": "ai-sorter",
};

describe("category pages (D57)", () => {
  it("each category has its theme", () => {
    expect(Object.fromEntries(getCategories().map((c) => [c.slug, c.theme]))).toEqual({
      "events-hospitality": "evening",
      "creative-production": "studio",
      "marketing-brand": "editorial",
      "production-print-gifts": "workshop",
      "software-digital": "interface",
    });
  });

  it("each category has an intro and 4–6 FAQ entries in both locales", () => {
    for (const c of getCategories()) {
      for (const l of locales) expect(c.intro[l].trim(), `${c.slug}.intro.${l}`).not.toBe("");
      expect(c.faq.length, c.slug).toBeGreaterThanOrEqual(4);
      expect(c.faq.length, c.slug).toBeLessThanOrEqual(6);
      for (const f of c.faq) {
        for (const l of locales) {
          expect(f.q[l].trim()).not.toBe("");
          expect(f.a[l].trim()).not.toBe("");
        }
      }
    }
  });

  it("placeholder copy is marked TODO in both locales or in neither", () => {
    const texts = getCategories().flatMap((c) => [c.intro, ...c.faq.flatMap((f) => [f.q, f.a])]);
    const points = getServices().flatMap((s) => s.points.en.map((en, i) => ({ en, ar: s.points.ar[i] })));
    for (const t of [...texts, ...points]) expect(t.en.startsWith("TODO:"), t.en).toBe(t.ar.startsWith("TODO:"));
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

  // D49: the 7 slots with a usable real profile photo use it (no client name, no identifiable person).
  it("real-photo slots point at an existing curated file under /images/work/", () => {
    const real = getImageSlots().filter((s) => s.kind === "real");
    expect(real.map((s) => s.id).sort()).toEqual(
      [
        "cat-events-hospitality-4x5",
        "cat-events-hospitality-16x9",
        "cat-creative-production-16x9",
        "cat-production-print-gifts-16x9",
        "process-build-4x5",
        "process-produce-4x5",
        "process-launch-4x5",
      ].sort(),
    );
    for (const s of real) {
      expect(s.src, s.id).toMatch(/^\/images\/work\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", s.src!)), `${s.id}: ${s.src}`).toBe(true);
      expect(s.illustrative, s.id).toBe(false);
      expect(s.blurDataURL, s.id).toMatch(/^data:image\/webp;base64,/);
    }
  });

  it("no AI image is marked as real documentation", () => {
    for (const s of getImageSlots()) if (s.kind === "ai") expect(s.src === null || s.src.startsWith("/images/ai/")).toBe(true);
  });

  it("every wired AI slot has its WebP and AVIF on disk and a blur placeholder (D50)", () => {
    const wired = getImageSlots().filter((s) => s.kind === "ai" && s.src);
    expect(wired.map((s) => s.id).sort()).toEqual(
      [
        "cat-creative-production-4x5",
        "cat-marketing-brand-4x5",
        "cat-production-print-gifts-4x5",
        "cat-software-digital-4x5",
        "hero-fallback-9x16",
        "process-plan-4x5",
        "product-qr-check-in-16x9",
      ].sort(),
    );
    for (const s of wired) {
      expect(s.src, s.id).toBe(`/images/ai/${s.id}.webp`);
      expect(existsSync(path.join("public", s.src!)), s.id).toBe(true);
      expect(existsSync(path.join("public", s.src!.replace(/\.webp$/, ".avif"))), s.id).toBe(true);
      expect(s.blurDataURL, s.id).toMatch(/^data:image\/webp;base64,/);
    }
  });

  // D51: files are kept at their native size (no upscaling), and each slot records it so
  // BrandImage can cap the srcset. AI files are Canva's native generation sizes.
  // Reads the size from the file header (first 4 KB), not with sharp: loading sharp's native
  // module and decoding whole files made this test's run time depend on cold caches, and it
  // timed out once (docs/e2e-flakes.md, 2026-11-08). imageSize is cross-checked against sharp.
  it("every slot with a file records the file's real pixel size", () => {
    const CANVA: Record<string, [number, number]> = { "4:5": [1136, 1408], "16:9": [1680, 944], "9:16": [944, 1680] };
    for (const s of getImageSlots().filter((x) => x.src)) {
      for (const ext of ["webp", "avif"]) {
        const file = path.join("public", s.src!.replace(/\.webp$/, `.${ext}`));
        if (!existsSync(file)) continue; // real photos ship WebP only
        const m = imageSize(readFileSync(file).subarray(0, 4096));
        expect([m?.width, m?.height], `${s.id}.${ext}`).toEqual([s.width, s.height]);
      }
      if (s.kind === "ai") expect([s.width, s.height], s.id).toEqual(CANVA[s.aspect]);
    }
  });
});
