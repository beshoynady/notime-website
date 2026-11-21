import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MODULES } from "@/components/modules/registry";
import { getSectionScene } from "./scenes";
import { services } from "./services";
import { SERVICE_VISUALS } from "./service-visuals";
import { media } from "./media";
import { BRANDED_PHOTO_DIRS } from "./work";

// The template-built categories (Software has its own page, D96).
const TEMPLATE = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts"];

describe("service visuals (D100)", () => {
  it("no template section ends on a bare list: each has a module, a visual or its photo scene", () => {
    for (const s of services.filter((s) => TEMPLATE.includes(s.category))) {
      const hasModule = !!s.signatureModule && !!MODULES[s.signatureModule];
      expect(hasModule || !!SERVICE_VISUALS[s.slug] || !!getSectionScene(s, false), s.slug).toBe(true);
    }
  });
  it("a visual is only for a section whose module isn't built (remove it when the module ships)", () => {
    for (const slug of Object.keys(SERVICE_VISUALS)) {
      const s = services.find((x) => x.slug === slug);
      expect(s, slug).toBeDefined();
      expect(!!s!.signatureModule && !!MODULES[s!.signatureModule], slug).toBe(false);
    }
  });
  it("photos exist, come from curated unbranded sources, and carry alt text in both locales", () => {
    for (const v of Object.values(SERVICE_VISUALS)) {
      if (v.kind !== "photo") continue;
      expect(existsSync(path.join("public", v.src)), v.src).toBe(true);
      expect(BRANDED_PHOTO_DIRS.some((d) => d.includes(v.from.replace(/-\d+$/, "")))).toBe(false);
      expect(v.alt.en.length && v.alt.ar.length).toBeTruthy();
    }
  });
  it("Creative: Video, Motion, AI and Rental show registry photographs, Rand's own where they exist (D158)", () => {
    const want = { "video-production": "rand-profile", "motion-graphics": "rand-profile", "ai-content-creation": "rand-profile", "equipment-camera-rental": "stock" };
    for (const [slug, source] of Object.entries(want)) {
      const v = SERVICE_VISUALS[slug];
      expect(v?.kind, slug).toBe("media");
      if (v?.kind === "media") expect(media(v.id)?.source, slug).toBe(source);
    }
  });
});
