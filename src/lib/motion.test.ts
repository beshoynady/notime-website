import { describe, expect, it } from "vitest";
import { ease, microTransition, motionTokens, stagger } from "./motion";

describe("motion tokens", () => {
  it("uses the approved staggers", () => {
    expect(stagger.char).toBe(0.03);
    expect(stagger.word).toBe(0.06);
  });

  it("pins durations, eases and owners", () => {
    expect(motionTokens.micro).toMatchObject({ duration: 0.3, gsapEase: "expo.out", owner: "motion" });
    expect(motionTokens.base).toMatchObject({ duration: 0.8, gsapEase: "power3.out", owner: "gsap" });
    expect(motionTokens.display.min).toBe(1.2);
    expect(motionTokens.display.max).toBe(1.5);
    expect(motionTokens.display.duration).toBeGreaterThanOrEqual(1.2);
    expect(motionTokens.display.duration).toBeLessThanOrEqual(1.5);
  });

  it("micro transition is a tween with expo.out, never a spring", () => {
    expect(microTransition).not.toHaveProperty("type", "spring");
    expect(microTransition.duration).toBe(0.3);
    expect(microTransition.ease).toEqual(ease.expoOut);
  });

  it("no cubic-bezier overshoots (no bounce)", () => {
    for (const curve of Object.values(ease)) {
      const [, y1, , y2] = curve;
      expect(y1).toBeGreaterThanOrEqual(0);
      expect(y1).toBeLessThanOrEqual(1);
      expect(y2).toBeGreaterThanOrEqual(0);
      expect(y2).toBeLessThanOrEqual(1);
    }
  });
});
