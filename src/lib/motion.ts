/**
 * Motion tokens — single source for durations, eases and staggers.
 * GSAP owns scroll-driven and display motion; Motion owns micro-interactions.
 * Feel: slow, smooth, never bouncy. No springs, no overshoot.
 */

/** Cubic-bezier control points for Motion (`motion/react`) and CSS. */
export const ease = {
  /** ≈ GSAP expo.out */
  expoOut: [0.16, 1, 0.3, 1],
  /** ≈ GSAP power3.out */
  power3Out: [0.215, 0.61, 0.355, 1],
  /** ≈ GSAP expo.inOut */
  expoInOut: [0.87, 0, 0.13, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const motionTokens = {
  micro: { duration: 0.3, gsapEase: "expo.out", owner: "motion" },
  base: { duration: 0.8, gsapEase: "power3.out", owner: "gsap" },
  display: { duration: 1.3, min: 1.2, max: 1.5, gsapEase: "expo.out", owner: "gsap" },
} as const;

/** Seconds between letters / words in a reveal. */
export const stagger = { char: 0.03, word: 0.06 } as const;

/** Default Motion transition for hover / tap / toggle: a tween, never a spring. */
export const microTransition = { duration: motionTokens.micro.duration, ease: ease.expoOut } as const;

/** CSS string forms, for inline styles and keyframes. */
export const cssEase = {
  expoOut: `cubic-bezier(${ease.expoOut.join(",")})`,
  power3Out: `cubic-bezier(${ease.power3Out.join(",")})`,
  expoInOut: `cubic-bezier(${ease.expoInOut.join(",")})`,
} as const;
