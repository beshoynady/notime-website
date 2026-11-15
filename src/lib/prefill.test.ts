import { describe, expect, it } from "vitest";
import { parsePrefill, prefillHref } from "./prefill";

describe("consultation prefill (Software page, ?build / ?tier)", () => {
  it("reads a known build and tier from the query", () => {
    expect(parsePrefill("?build=apps")).toEqual({ build: "apps" });
    expect(parsePrefill("?tier=grow")).toEqual({ build: "websites", tier: "grow" });
    expect(parsePrefill("build=systems&tier=platform")).toEqual({ build: "systems", tier: "platform" });
  });

  it("presets the build a tier implies when the query names none", () => {
    expect(parsePrefill("?tier=launch").build).toBe("websites");
    expect(parsePrefill("?tier=platform").build).toBe("systems");
    expect(parsePrefill("?tier=platform&build=apps").build).toBe("apps");
  });

  it("accepts the storyboard's ?service=<anchor> as a build", () => {
    expect(parsePrefill("?service=event-tech")).toEqual({ build: "event-tech" });
    expect(parsePrefill("?service=ux&build=apps")).toEqual({ build: "apps" });
  });

  it("ignores unknown, empty or hostile values", () => {
    expect(parsePrefill("")).toEqual({});
    expect(parsePrefill("?build=")).toEqual({});
    expect(parsePrefill("?build=<script>&tier=gold")).toEqual({});
    expect(parsePrefill("?build=APPS")).toEqual({ build: "apps" });
  });

  it("writes a link that works with the URL alone", () => {
    expect(prefillHref({ build: "apps" })).toBe("?build=apps#consult");
    expect(prefillHref({ tier: "grow" })).toBe("?tier=grow#consult");
    expect(prefillHref({ build: "systems", tier: "platform" })).toBe("?build=systems&tier=platform#consult");
    expect(parsePrefill(prefillHref({ build: "e-commerce" }).split("#")[0])).toEqual({ build: "e-commerce" });
  });
});
