import type { SceneConfig } from "./types";

/**
 * Inline insets for a layer spanning columns `from`–`to` of the spread's 12-column grid. The grid
 * sits on the sections' column (beside the rail at ≥ 900px, between the gutters below): its
 * insets are `--ed-cs` / `--ed-ce` and its width `--ed-cw`, set on the scene in
 * themes/editorial.css, so every box mirrors in Arabic with no extra rule.
 */
const cols = (from: number, to: number) => {
  // Half a 24px gutter on each inner edge, so neighbouring cells never touch.
  const start = `calc(var(--ed-cs) + var(--ed-cw) * ${((from - 1) / 12).toFixed(4)}${from > 1 ? " + 12px" : ""})`;
  const end = `calc(var(--ed-ce) + var(--ed-cw) * ${((12 - to) / 12).toFixed(4)}${to < 12 ? " + 12px" : ""})`;
  return `${start} ${end}`;
};

/** The spread's block: from its top rule (`--ed-top`) to its foot (`--ed-base`, from the bottom). */
const SPREAD = "calc(var(--ed-top) + 3%) calc(var(--ed-base) + 4%)";

/**
 * III · Marketing & Brand, "The Editorial" (docs/design/storyboards/marketing-brand.md, Act 1):
 * a blank page draws its grid, the spread sets itself, and the brand comes alive. Built from the
 * storyboard with no animatic (D82, D83).
 *
 * Every layer is drawn in code (`.fx-*` in themes/editorial.css), so the scene reads with no image
 * at all: the paper, the folio, the column lines (drawn from the folio down: a clipped wipe), the
 * baseline rules (drawn across from inline-start), a colour plate in the 7-column cell, headline
 * and text blocks in the other five, a swatch fan and a brass pen at the edges, the highlight band
 * and a seal. The four image slots stay in the config (they render nothing until their files
 * arrive); a code drawing that shares a layer with an image steps aside once the image is in.
 *
 * Desktop: four shots on the 2.0 vh pin, four lines; the two long lines get the most scroll.
 * Mobile: three shots on 1.2 vh (the grid merges into the spread, storyboard "Mobile"): the paper
 * and the board are the only image slots there; the pen and the swatch fan stay desktop only.
 *
 * The mark: the logo SVG is missing (CONTENT_CHECKLIST #14), so shot 4's "mark settling in a
 * corner" is a neutral seal (a ring with a half-filled disc, the storyboard's ◐), not the logo.
 * TODO: replace placeholder — the seal becomes the mark once the SVG arrives.
 */
export const EDITORIAL_OPENING: SceneConfig = {
  id: "editorial-opening",
  shots: [
    { id: "blank-page", copyKey: "marketing.s1", desktop: [0, 0.5], mobile: [0, 0.4] },
    { id: "the-grid", copyKey: "marketing.s2", desktop: [0.5, 0.85], mobile: null },
    { id: "the-spread", copyKey: "marketing.s3", desktop: [0.85, 1.5], mobile: [0.4, 0.85] },
    { id: "alive", copyKey: "marketing.s4", desktop: [1.5, 2.0], mobile: [0.85, 1.2] },
  ],
  layers: [
    // L0: the page. Ivory paper drawn in code under the plate's slot; a slow push-in over the act.
    { id: "paper", level: 0, slot: "mb-open-paper", fx: "paper", depth: 0.15, push: 0.06, mobile: true, eager: true, box: { block: "0", inline: "0" } },
    // L3: the folio rule at the head of the page, there from the first frame.
    { id: "folio", level: 3, fx: "folio", depth: 0.15, mobile: true, box: { block: "calc(var(--ed-top) - 22px) calc(100% - var(--ed-top))", inline: cols(1, 12) } },
    // L3: twelve column lines draw from the folio down (shot 2; on mobile they open the merged shot).
    { id: "grid", level: 3, fx: "grid", depth: 0.15, mobile: true, box: { block: "var(--ed-top) 0", inline: cols(1, 12) }, enter: { shot: 1, from: { y: -100, opacity: 1 } } },
    // L3: two baseline rules draw across from inline-start.
    { id: "baselines", level: 3, fx: "baselines", depth: 0.15, mobile: true, box: { block: "var(--ed-top) var(--ed-base)", inline: cols(1, 12) }, enter: { shot: 1, from: { x: -100, opacity: 1 } } },
    // L1: the image drops into its 7-column cell: a colour plate in code until the board image arrives.
    { id: "board", level: 1, slot: "mb-open-board", fx: "board", depth: 0.5, push: 0.04, mobile: true, box: { block: SPREAD, inline: cols(1, 7) }, enter: { shot: 2, from: { y: -12 } } },
    // L3: headline and text blocks slide up into the other five columns.
    { id: "heads", level: 3, fx: "heads", depth: 0.5, mobile: true, box: { block: SPREAD, inline: cols(8, 12) }, enter: { shot: 2, from: { y: 24 } } },
    // L2: on the desk, out of the grid: the swatch fan from inline-start, the pen from inline-end.
    { id: "swatches", level: 2, slot: "mb-open-swatches", fx: "swatches", depth: 1.1, mobile: false, box: { block: "60% -6%", inline: "-3% 84%" }, enter: { shot: 2, from: { x: -40 } } },
    { id: "pen", level: 2, slot: "mb-open-pen", fx: "pen", depth: 1.3, mobile: false, box: { block: "36% 46%", inline: "79% 2%" }, enter: { shot: 2, from: { x: 30, y: 12 } } },
    // L3: the champagne highlight band sweeps in behind the last line, from inline-start.
    { id: "band", level: 3, fx: "band", depth: 0, mobile: true, box: { block: "var(--ed-band-top) var(--ed-band-end)", inline: "0" }, enter: { shot: 3, from: { x: -100, opacity: 1 } } },
    // L3: the seal settles on the plate's corner.
    {
      id: "seal",
      level: 3,
      fx: "seal",
      depth: 0.5,
      mobile: true,
      box: {
        block: "calc(var(--ed-top) + 3% - 28px) calc(100% - var(--ed-top) - 3% - 28px)",
        inline: "calc(var(--ed-cs) + var(--ed-cw) * 0.5833 - 28px) calc(100% - var(--ed-cs) - var(--ed-cw) * 0.5833 - 28px)",
      },
      enter: { shot: 3, from: { scale: 1.5 } },
    },
  ],
};
