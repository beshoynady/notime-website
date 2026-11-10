import type { SceneConfig, SceneLayer } from "./types";

/**
 * IV · Production, Print & Gifts, "The Workshop" (docs/design/storyboards/production-print-gifts.md,
 * Act 1). Built from the storyboard with no animatic (D82, D83).
 *
 * The frame is a press sheet on a champagne worktable: crop marks, two registration targets, a
 * ruler, a colour bar and a slug line (L3, code). On it, paper, board and ribbon become a gift box:
 * - desktop, four shots on a 2.0 vh pin: raw materials → the dieline and its dimensions are
 *   drawn on the board → the board falls away, the net is printed and the open box rises beside
 *   it → the solid box takes the outline's place, the lid lowers and the ribbon settles;
 * - mobile, three shots on 1.2 vh: shots 2 and 3 merge (storyboard, "Mobile"), so the print pass
 *   and the open outline are desktop only, and shot 3's cues hand over to shot 4.
 * Reduced motion: the closed, ribboned box on the sheet, the dieline faint beside it.
 *
 * No image file exists yet (images.ts, `src: null` renders nothing), so the code-drawn layers
 * (`fx-ws-*`, themes/workshop.css) carry the whole story. The image layers sit right above their
 * code twins and take over when their files arrive.
 * TODO: replace placeholder — drop a code twin (paper, spool, box) once its graded file is in.
 *
 * Placement: each group of layers that must line up (the board rig, the box rig) shares one box
 * and one SVG viewBox, so they register at any aspect. A box reads its CSS custom property first
 * (`--ws-<rig>-b` / `--ws-<rig>-i`, set below 900px in workshop.css) and falls back to the
 * desktop values here. Layers in a rig share their depth too, so they drift as one.
 */

type Rig = "sheet" | "paper" | "spool" | "board" | "box";

/** Desktop placement of each rig (stage %, logical: block start end, inline start end). */
const RIG: Record<Rig, { block: string; inline: string; depth: number }> = {
  // The press sheet's marks, around the work area (the content column, above the H1).
  sheet: { block: "13% 44%", inline: "30% 3%", depth: 0.15 },
  // Flat lay: the board in the middle, the paper over its inline-start corner, the spool at inline-end.
  board: { block: "17% 47%", inline: "40% 26%", depth: 0.3 },
  paper: { block: "31% 48%", inline: "31% 58%", depth: 1.0 },
  spool: { block: "21% 58%", inline: "75% 8%", depth: 1.2 },
  // The box arrives where the spool was.
  box: { block: "15% 45%", inline: "71% 4%", depth: 0.5 },
};

const at = (rig: Rig): Pick<SceneLayer, "box" | "depth"> => ({
  depth: RIG[rig].depth,
  box: { block: `var(--ws-${rig}-b, ${RIG[rig].block})`, inline: `var(--ws-${rig}-i, ${RIG[rig].inline})` },
});

export const WORKSHOP_OPENING: SceneConfig = {
  id: "workshop-opening",
  shots: [
    { id: "raw-materials", copyKey: "print.s1", desktop: [0, 0.45], mobile: [0, 0.35] },
    { id: "measured-cut", copyKey: "print.s2", desktop: [0.45, 0.95], mobile: [0.35, 0.7] },
    { id: "printed-folded", copyKey: "print.s3", desktop: [0.95, 1.5], mobile: null },
    { id: "box-closes", copyKey: "print.s4", desktop: [1.5, 2.0], mobile: [0.7, 1.2] },
  ],
  layers: [
    // L0: the worktable plate (no file yet: the champagne ground and its paper texture stand in).
    { id: "bench", level: 0, slot: "pg-open-bench", depth: 0.15, push: 0.04, mobile: true, eager: true, box: { block: "0", inline: "0" } },
    // L3: a warm light from block-start inline-end, a little stronger as the box closes.
    { id: "light", level: 3, fx: "ws-light", depth: 0, mobile: true, box: { block: "0", inline: "0" }, style: { opacity: 0.7 }, keys: [{ shot: 3, to: { opacity: 1 } }] },
    // L3: the press sheet. It steps back a little once the box is the subject.
    { id: "sheet", level: 3, fx: "ws-sheet", mobile: true, ...at("sheet"), keys: [{ shot: 3, to: { opacity: 0.6 } }] },

    // The board rig. Board: a sheet of grey board; the waste falls away once the net is cut (shot 3).
    { id: "board", level: 3, fx: "ws-board", mobile: true, ...at("board"), keys: [{ shot: 2, to: { opacity: 0 } }] },
    // The dieline: cut lines and dashed folds, drawn in shot 2, faint in the end frame.
    { id: "dieline", level: 3, fx: "ws-net", mobile: true, ...at("board"), style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1 } }, { shot: 3, to: { opacity: 0.3 } }] },
    // Its dimension lines (240 and 160; the slug line gives all three): shot 2 only.
    { id: "dimensions", level: 3, fx: "ws-dims", mobile: true, ...at("board"), style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1 } }, { shot: 2, to: { opacity: 0 } }] },
    // The ink pass sweeps across the net from inline-start (desktop), then clears for the box.
    { id: "ink", level: 3, fx: "ws-ink", mobile: false, ...at("board"), enter: { shot: 2, from: { x: -24 } }, keys: [{ shot: 3, to: { opacity: 0 } }] },

    // Raw materials, over the board's corners: they clear as the dieline is drawn.
    { id: "paper-stack", level: 3, fx: "ws-paper", mobile: true, ...at("paper"), keys: [{ shot: 1, to: { opacity: 0 } }] },
    { id: "paper", level: 2, slot: "pg-open-paper", mobile: false, ...at("paper"), keys: [{ shot: 1, to: { opacity: 0 } }] },
    { id: "spool", level: 3, fx: "ws-spool", mobile: true, ...at("spool"), keys: [{ shot: 1, to: { opacity: 0 } }] },
    { id: "ribbon-spool", level: 2, slot: "pg-open-ribbon", mobile: false, ...at("spool"), keys: [{ shot: 1, to: { opacity: 0 } }] },

    // The box rig. The open box rises as a line drawing while the net is printed (desktop, shot 3),
    // then hands over to the solid box (the match cut).
    { id: "fold", level: 3, fx: "ws-fold", mobile: false, ...at("box"), enter: { shot: 2, from: { y: 6, scale: 0.94 } }, keys: [{ shot: 3, to: { opacity: 0 } }] },
    { id: "box-base", level: 3, fx: "ws-box", mobile: true, ...at("box"), enter: { shot: 3, from: { y: 5 } } },
    { id: "box-base-photo", level: 1, slot: "pg-open-box-base", mobile: true, ...at("box"), enter: { shot: 3, from: { y: 5 } } },
    // The lid lowers about 12 vh onto the base (a third of the rig's height).
    { id: "box-lid", level: 3, fx: "ws-lid", mobile: true, ...at("box"), enter: { shot: 3, from: { y: -32 } } },
    { id: "box-lid-photo", level: 1, slot: "pg-open-box-lid", mobile: true, ...at("box"), enter: { shot: 3, from: { y: -32 } } },
    // The ribbon, tied across the lid, comes down with it and settles as it closes.
    { id: "ribbon", level: 3, fx: "ws-ribbon", mobile: true, ...at("box"), enter: { shot: 3, from: { y: -32 } } },
  ],
};
