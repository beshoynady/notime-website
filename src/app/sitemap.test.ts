import { describe, expect, it } from "vitest";
import { LAB_IDS } from "@/content/scenes";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("never lists the hidden lab, the styleguide or the link-in-bio page (noindex, D110)", () => {
    const urls = sitemap().flatMap((e) => [e.url, ...Object.values(e.alternates?.languages ?? {})]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).not.toMatch(/\/lab(\/|$)/);
      expect(url).not.toMatch(/\/styleguide(\/|$)/);
      expect(url).not.toMatch(/\/links(\/|$)/);
      for (const id of Object.keys(LAB_IDS)) expect(url).not.toContain(`${id}-animatic`);
    }
  });
});
