import { FULL, scrim, type SceneConfig, type SceneLayer } from "./types";

/**
 * II · Creative Production, "Lights, then the frame" (docs/content/visual-stories.md; D158).
 * Photographs only: one studio (stock, until a NO TIME set is photographed) graded twice, and Rand's
 * own styled shoot as the finished frame.
 *
 * Laptop (≥ 1024px, D151): the hero pins and plays three beats on a 2.0 vh pin, with the eyebrow,
 * H1, lead and "Request a quote" there from the first frame (LayeredScene mode "hero"):
 *   1. the studio before the lights (`cp-open-dark`),
 *   2. the key light comes up: the same studio lit wipes in from the centre (`cp-open-lit`),
 *   3. the frame: Rand's dessert boards (catering-4) arrive on the white sweep, framed like a print.
 * Phones and reduced motion: the still, the lit studio (the frame is laptop-only, as in Events).
 */

export const STUDIO_OPENING: SceneConfig = {
  id: "studio-opening",
  hero: true,
  shots: [
    { id: "dark", copyKey: "creative.s1", desktop: [0, 0.5], mobile: [0, 0.6] },
    { id: "lights-up", copyKey: "creative.s3", desktop: [0.5, 1.1], mobile: null },
    { id: "the-frame", copyKey: "creative.s4", desktop: [1.1, 1.8], mobile: [0.6, 1.05] },
    { id: "ready", desktop: [1.8, 2.0], mobile: [1.05, 1.2] },
  ],
  layers: [
    // L0: the studio in the dark (the film's first frame, desktop only). Push-in 1.00 → 1.04.
    { id: "dark", level: 0, slot: "cp-open-dark", depth: 0.15, push: 0.04, mobile: false, eager: true, box: FULL },
    // L0: the same studio with its key light on, wiping in from the centre like curtains (D109).
    { id: "lit", level: 0, slot: "cp-open-lit", depth: 0.15, push: 0.04, mobile: true, box: FULL, style: { wipe: 0 }, keys: [{ shot: 1, to: { wipe: 1 } }] },
    // L3: the key's warm pool on the sweep, as the light comes up.
    { id: "key", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "26% 30%", inline: "30% 30%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.8, scale: 1.15 } }] },
    // L2: the frame, Rand's styled shoot set on the sweep like a print (inline-end of centre, so the
    // head keeps the lower inline-start; mirrors in Arabic).
    {
      id: "frame",
      level: 2,
      slot: "catering-4",
      fx: "frame",
      depth: 0.5,
      mobile: false,
      fit: "cover",
      box: { block: "22% 30%", inline: "40% 14%" },
      enter: { shot: 2, from: { y: 6, opacity: 0 } },
    },
    // L3: the scrim under the head and the shot lines.
    scrim,
  ] satisfies SceneLayer[],
};
