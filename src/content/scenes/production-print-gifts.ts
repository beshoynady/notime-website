import type { SceneConfig, SceneLayer } from "./types";

/**
 * IV · Production, Print & Gifts, "From the press to the hand" (docs/content/visual-stories.md;
 * D160). Photographs only: the materials and the press (stock, until NO TIME's own floor is
 * photographed) and the gold skyline gift NO TIME made, as the finished piece.
 *
 * Laptop (≥ 1024px, D151): the hero pins and plays three beats on a 2.0 vh pin, with the eyebrow,
 * H1, lead and "Request a quote" there from the first frame (LayeredScene mode "hero"):
 *   1. paper, board, ribbon: twine, spools and a kraft tag on the bench (`pg-open-materials`),
 *   2. printed: the press running sheets wipes in from the centre (`pg-open-press`),
 *   3. ready to give: the gold skyline piece (gifts-1) arrives in a frame.
 * Phones and reduced motion: the still, the press (the frame is laptop-only, as in Events).
 */
const FULL = { block: "0", inline: "0" } as const;

export const WORKSHOP_OPENING: SceneConfig = {
  id: "workshop-opening",
  hero: true,
  shots: [
    { id: "materials", copyKey: "print.s1", desktop: [0, 0.5], mobile: [0, 0.6] },
    { id: "printed", copyKey: "print.s3", desktop: [0.5, 1.1], mobile: null },
    { id: "the-gift", copyKey: "print.s4", desktop: [1.1, 1.8], mobile: [0.6, 1.05] },
    { id: "ready", desktop: [1.8, 2.0], mobile: [1.05, 1.2] },
  ],
  layers: [
    // L0: the materials on the bench (the film's first frame, desktop only).
    { id: "materials", level: 0, slot: "pg-open-materials", depth: 0.15, push: 0.04, mobile: false, eager: true, box: FULL },
    // L0: the press running sheets, wiping in from the centre as the print pass starts.
    { id: "press", level: 0, slot: "pg-open-press", depth: 0.15, push: 0.04, mobile: true, box: FULL, style: { wipe: 0 }, keys: [{ shot: 1, to: { wipe: 1 } }] },
    // L2: the finished piece, framed like a print on the bench (inline-end, so the head keeps the
    // lower inline-start; mirrors in Arabic), above the eyebrow line.
    {
      id: "gift",
      level: 2,
      slot: "gifts-1",
      fx: "frame",
      depth: 0.5,
      mobile: false,
      fit: "cover",
      box: { block: "12% 40%", inline: "46% 8%" },
      enter: { shot: 2, from: { y: 6, opacity: 0 } },
    },
  ] satisfies SceneLayer[],
};
