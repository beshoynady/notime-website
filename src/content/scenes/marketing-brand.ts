import type { SceneConfig, SceneLayer } from "./types";

/**
 * III · Marketing & Brand, "The brief on the desk" (docs/content/visual-stories.md; D159).
 * Photographs only: a designer's desk (stock: swatches, sketches and pens, no brand marks) and a
 * post NO TIME published for a football league as the finished work.
 *
 * Laptop (≥ 1024px, D151): the hero pins and plays three beats on a 2.0 vh pin, with the eyebrow,
 * H1, lead and "Request a quote" there from the first frame (LayeredScene mode "hero"):
 *   1. a blank page: the desk under an ivory wash (`mb-open-desk`, fx "wash"),
 *   2. words and images find their place: the same desk, clean, wipes in from the centre,
 *   3. ready to post: the real post (uae-pro-league-4 ⚑, a round result) arrives in a frame.
 * Phones and reduced motion: the still, the clean desk (the frame is laptop-only, as in Events).
 * One file for both desk layers: the wash is CSS over the same image, so nothing loads twice.
 */
const FULL = { block: "0", inline: "0" } as const;

export const EDITORIAL_OPENING: SceneConfig = {
  id: "editorial-opening",
  hero: true,
  shots: [
    { id: "blank-page", copyKey: "marketing.s1", desktop: [0, 0.5], mobile: [0, 0.6] },
    { id: "the-spread", copyKey: "marketing.s3", desktop: [0.5, 1.1], mobile: null },
    { id: "the-post", copyKey: "marketing.s4", desktop: [1.1, 1.8], mobile: [0.6, 1.05] },
    { id: "ready", desktop: [1.8, 2.0], mobile: [1.05, 1.2] },
  ],
  layers: [
    // L0: the desk under an ivory wash, the blank page (desktop only: the film's first frame).
    { id: "blank", level: 0, slot: "mb-open-desk", fx: "wash", depth: 0.15, push: 0.04, mobile: false, eager: true, box: FULL },
    // L0: the same desk, clean, wiping in from the centre as the spread sets itself.
    { id: "desk", level: 0, slot: "mb-open-desk", depth: 0.15, push: 0.04, mobile: true, box: FULL, style: { wipe: 0 }, keys: [{ shot: 1, to: { wipe: 1 } }] },
    // L2: the post, framed like a proof on the desk (inline-end, so the head keeps the lower
    // inline-start; mirrors in Arabic). Hidden with its photo if Rand withholds it.
    {
      id: "post",
      level: 2,
      slot: "uae-pro-league-4",
      fx: "frame",
      depth: 0.5,
      mobile: false,
      fit: "cover",
      box: { block: "8% 34%", inline: "62% 8%" },
      enter: { shot: 2, from: { y: 6, opacity: 0 } },
    },
  ] satisfies SceneLayer[],
};
