import { describe, expect, it } from "vitest";
import { caseStudyNamed, lighthouseProof, SOFTWARE_FLAGS } from "./software";

describe("Software page flags", () => {
  it("ship off: the Lighthouse line and the named case study stay hidden (D65, D67)", () => {
    expect(SOFTWARE_FLAGS.lighthouseProof).toBe(false);
    expect(caseStudyNamed()).toBe(false);
  });

  it("shows Lighthouse scores only with the flag on and every category at 90 or more", () => {
    const good = { performance: 94, accessibility: 100, bestPractices: 100, seo: 92 };
    expect(lighthouseProof(false, good)).toBeNull();
    expect(lighthouseProof(true, good)).toEqual(good);
    expect(lighthouseProof(true, { ...good, performance: 89 })).toBeNull();
    expect(lighthouseProof(true, null)).toBeNull();
    expect(lighthouseProof(true, { ...good, seo: Number.NaN })).toBeNull();
  });
});
