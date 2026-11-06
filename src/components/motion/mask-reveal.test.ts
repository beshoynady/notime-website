import { describe, expect, it } from "vitest";
import { maskFrom } from "./mask-reveal";

describe("maskFrom", () => {
  it("start edge is left in LTR and right in RTL", () => {
    expect(maskFrom("start", false)).toBe("inset(0 100% 0 0)");
    expect(maskFrom("start", true)).toBe("inset(0 0 0 100%)");
  });
  it("end edge mirrors start", () => {
    expect(maskFrom("end", false)).toBe("inset(0 0 0 100%)");
    expect(maskFrom("end", true)).toBe("inset(0 100% 0 0)");
  });
});
