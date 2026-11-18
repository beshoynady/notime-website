import { describe, expect, it } from "vitest";
import { autohidesOn, nextHeaderHidden } from "./header-hide";

const o = { headerH: 68, delta: 8 };

describe("nextHeaderHidden", () => {
  it("hides on a scroll down past the delta", () => {
    expect(nextHeaderHidden({ y: 400, hidden: false }, 420, o)).toBe(true);
  });
  it("keeps its state for a move under the delta", () => {
    expect(nextHeaderHidden({ y: 420, hidden: true }, 415, o)).toBe(true);
    expect(nextHeaderHidden({ y: 400, hidden: false }, 403, o)).toBe(false); // jitter
  });
  it("shows on a scroll up past the delta", () => {
    expect(nextHeaderHidden({ y: 420, hidden: true }, 400, o)).toBe(false);
  });
  it("shows at the top, whatever the move", () => {
    expect(nextHeaderHidden({ y: 500, hidden: true }, 30, o)).toBe(false);
    expect(nextHeaderHidden({ y: 0, hidden: false }, 60, o)).toBe(false);
  });
});

describe("autohidesOn", () => {
  it("is on for the five category pages, Software included", () => {
    for (const slug of ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"]) {
      expect(autohidesOn(`/services/${slug}`)).toBe(true);
    }
    expect(autohidesOn("/services/marketing-brand/")).toBe(true);
  });
  it("is off everywhere else", () => {
    for (const path of ["/", "/work", "/services", "/services/nope", "/contact", "/services/marketing-brand/x"]) {
      expect(autohidesOn(path)).toBe(false);
    }
  });
});
