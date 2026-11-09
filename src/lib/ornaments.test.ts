import { describe, expect, it } from "vitest";
import { kenBurnsOrigin, kenBurnsScale, tickAngle } from "./ornaments";

describe("kenBurnsScale", () => {
  it("runs from `from` at progress 0 to `to` at progress 1", () => {
    expect(kenBurnsScale(0, 1, 1.08)).toBe(1);
    expect(kenBurnsScale(1, 1, 1.08)).toBeCloseTo(1.08);
    expect(kenBurnsScale(0.5, 1, 1.08)).toBeCloseTo(1.04);
  });
  it("stays within [from, to] for progress outside 0..1, in either direction", () => {
    expect(kenBurnsScale(-0.4, 1, 1.08)).toBe(1);
    expect(kenBurnsScale(1.7, 1, 1.08)).toBeCloseTo(1.08);
    expect(kenBurnsScale(2, 1.08, 1)).toBe(1);
    expect(kenBurnsScale(-1, 1.08, 1)).toBeCloseTo(1.08);
  });
});

describe("kenBurnsOrigin", () => {
  it("anchors at the reading start: left in English, right in Arabic", () => {
    expect(kenBurnsOrigin("start-top", "ltr")).toBe("0% 0%");
    expect(kenBurnsOrigin("start-top", "rtl")).toBe("100% 0%");
    expect(kenBurnsOrigin("end-bottom", "ltr")).toBe("100% 100%");
    expect(kenBurnsOrigin("end-bottom", "rtl")).toBe("0% 100%");
  });
  it("keeps the centre where it is", () => {
    expect(kenBurnsOrigin("center", "rtl")).toBe("50% 50%");
  });
});

describe("tickAngle", () => {
  it("gives 30° per section, wrapping after twelve", () => {
    expect(tickAngle(0)).toBe(0);
    expect(tickAngle(3)).toBe(90);
    expect(tickAngle(11)).toBe(330);
    expect(tickAngle(12)).toBe(0);
    expect(tickAngle(14)).toBe(60);
  });
});
