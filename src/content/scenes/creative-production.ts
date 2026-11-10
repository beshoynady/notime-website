import type { SceneConfig, SceneLayer, SceneShot } from "./types";

/**
 * II · Creative Production, "The Studio" (docs/design/storyboards/creative-production.md, Act 1),
 * built from the storyboard with no animatic (D82, D83).
 *
 * Black box → slate → push-in → the frame develops, inside letterbox bars at 2.39:1. The Studio's
 * transition is the **cut** (storyboards README §4): content swaps in one step behind a short
 * ivory flash line. A key always plays over 80% of its shot, so each cut is two very short shots
 * with no line (flash on, flash off, 0.025 vh each, about 120 ms at a normal scroll): everything
 * that changes at the cut is keyed to the "on" shot and swaps within ~20px of scroll. A shot
 * without a line keeps the previous one (lineSpans), so the lines read exactly as the four shots.
 *
 * No image file exists yet (images.ts, `src: null`): the ground (night) and the code-drawn L3
 * layers carry the scene — the studio's seamless backdrop and its work-light pool, the bars, the
 * slate and its stick, the camera's frame lines, the timecode, the flash, the develop wash and
 * the key light (`.fx-<name>`, themes/studio.css). The slate is drawn in code, not cut out
 * (layers.md: a slate is a simple shape), so its two image slots stay unused; the plate, the
 * camera and the real frame keep their slots and appear when their files arrive.
 *
 * Mobile: three shots (black box, slate, the frame develops); the push-in, its camera, its frame
 * lines and its timecode are desktop only. Cues of shots that don't play hand on to the next one.
 * Reduced motion and the still: the developed frame in the open letterbox, the last timecode.
 */

/** Shot indices, for the keys below. */
const S = { box: 0, cut1: 1, cut1Off: 2, slate: 3, snap: 4, slateHold: 5, cut2: 6, cut2Off: 7, push: 8, cut3: 9, cut3Off: 10, frame: 11, open: 12 } as const;

const shots: SceneShot[] = [
  { id: "black-box", copyKey: "creative.s1", desktop: [0, 0.43], mobile: [0, 0.3] },
  { id: "cut-1", desktop: [0.43, 0.455], mobile: [0.3, 0.315] },
  { id: "cut-1-off", desktop: [0.455, 0.48], mobile: [0.315, 0.33] },
  { id: "slate", copyKey: "creative.s2", desktop: [0.48, 0.68], mobile: [0.33, 0.46] },
  // The stick snaps shut: two drawn sticks swap in one step (keys move opacity and scale, never rotation).
  { id: "snap", desktop: [0.68, 0.7], mobile: [0.46, 0.475] },
  { id: "slate-hold", desktop: [0.7, 0.88], mobile: [0.475, 0.6] },
  { id: "cut-2", desktop: [0.88, 0.905], mobile: null },
  { id: "cut-2-off", desktop: [0.905, 0.93], mobile: null },
  { id: "push-in", copyKey: "creative.s3", desktop: [0.93, 1.43], mobile: null },
  { id: "cut-3", desktop: [1.43, 1.455], mobile: [0.6, 0.615] },
  { id: "cut-3-off", desktop: [1.455, 1.48], mobile: [0.615, 0.63] },
  { id: "the-frame", copyKey: "creative.s4", desktop: [1.48, 1.8], mobile: [0.63, 1.0] },
  // The letterbox bars open to full frame, then the curtain.
  { id: "bars-open", desktop: [1.8, 2.0], mobile: [1.0, 1.2] },
];

/** Code-drawn layers fill the stage; their CSS places what they draw (it knows the letterbox maths). */
const STAGE = { block: "0", inline: "0" };
/** Shown from shot `on` until shot `off` (a cut each way). */
const between = (on: number, off?: number): Pick<SceneLayer, "style" | "keys"> => ({
  style: { opacity: 0 },
  keys: [{ shot: on, to: { opacity: 1 } }, ...(off === undefined ? [] : [{ shot: off, to: { opacity: 0 } }])],
});
/** One flash line per cut: on, then off, ~120 ms. */
const flash = (id: string, on: number, off: number, mobile: boolean): SceneLayer => ({
  id,
  level: 3,
  fx: "flash",
  depth: 0,
  mobile,
  box: STAGE,
  style: { opacity: 0 },
  keys: [
    { shot: on, to: { opacity: 1 } },
    { shot: off, to: { opacity: 0 } },
  ],
});

export const STUDIO_OPENING: SceneConfig = {
  id: "studio-opening",
  shots,
  layers: [
    // L0: the empty studio (image when it exists) and, drawn, its seamless backdrop. Push-in 1.00 → 1.06.
    { id: "studio", level: 0, slot: "cp-open-studio", depth: 0.15, push: 0.06, mobile: true, eager: true, box: STAGE },
    { id: "cyc", level: 3, fx: "cyc", depth: 0.15, push: 0.06, mobile: true, box: STAGE },
    // L3: the work light's pool on the floor; it spreads as the frame is lit.
    { id: "work-light", level: 3, fx: "pool", depth: 0.15, push: 0.06, mobile: true, box: STAGE, keys: [{ shot: S.frame, to: { scale: 1.25 } }] },
    // L3: the single warm key comes up with the final frame.
    { id: "key-light", level: 3, fx: "key", depth: 0.2, mobile: true, box: STAGE, ...between(S.cut3) },
    // L1: the real frame (catering-4, the one meaningful layer) cuts in for shot 4.
    { id: "frame", level: 1, slot: "cp-open-frame", depth: 0.4, mobile: true, box: { block: "14% 14%", inline: "8% 8%" }, ...between(S.cut3) },
    // L3: the frame develops, from a dark amber state to the grade: an overlay that falls (opacity only).
    {
      id: "develop",
      level: 3,
      fx: "develop",
      depth: 0,
      mobile: true,
      box: STAGE,
      style: { opacity: 0 },
      keys: [
        { shot: S.cut3, to: { opacity: 0.92 } },
        { shot: S.frame, to: { opacity: 0 } },
      ],
    },
    // L1: the camera on its dolly pushes toward the backdrop (desktop), with its frame lines.
    { id: "camera", level: 1, slot: "cp-open-camera", depth: 0.6, push: 0.25, mobile: false, box: { block: "30% 20%", inline: "52% 8%" }, ...between(S.cut2, S.cut3) },
    // L3: the camera's frame lines push out until they meet the letterbox's edges: the match cut to shot 4.
    {
      id: "frame-lines",
      level: 3,
      fx: "framelines",
      depth: 0,
      mobile: false,
      box: STAGE,
      style: { opacity: 0 },
      keys: [
        { shot: S.cut2, to: { opacity: 1 } },
        { shot: S.push, to: { scale: 1.3 } },
        { shot: S.cut3, to: { opacity: 0 } },
      ],
    },
    // L2 (drawn): the slate, "II · CP · TAKE 1", with its stick open, then snapped shut.
    { id: "slate", level: 2, fx: "slate", depth: 1.0, mobile: true, box: STAGE, ...between(S.cut1, S.cut2) },
    { id: "stick-open", level: 2, fx: "stick-open", depth: 1.0, mobile: true, box: STAGE, ...between(S.cut1, S.snap) },
    { id: "stick-shut", level: 2, fx: "stick-shut", depth: 1.0, mobile: true, box: STAGE, ...between(S.snap, S.cut2) },
    // L3: the letterbox bars (2.39:1). They open by scaling out past the stage's edges.
    { id: "letterbox", level: 3, fx: "letterbox", depth: 0, mobile: true, box: STAGE, keys: [{ shot: S.open, to: { scale: 2.8 } }] },
    // L3: the timecode, one reading per shot (decorative; technical numerals stay Latin, D50).
    { id: "tc-0", level: 3, fx: "tc-0", depth: 0, mobile: true, box: STAGE, keys: [{ shot: S.cut1, to: { opacity: 0 } }] },
    { id: "tc-1", level: 3, fx: "tc-1", depth: 0, mobile: true, box: STAGE, ...between(S.cut1, S.cut2) },
    { id: "tc-2", level: 3, fx: "tc-2", depth: 0, mobile: false, box: STAGE, ...between(S.cut2, S.cut3) },
    { id: "tc-3", level: 3, fx: "tc-3", depth: 0, mobile: true, box: STAGE, ...between(S.cut3) },
    // L3: the ivory flash line at each cut (the second plays on desktop only, with the push-in).
    flash("flash-1", S.cut1, S.cut1Off, true),
    flash("flash-2", S.cut2, S.cut2Off, false),
    flash("flash-3", S.cut3, S.cut3Off, true),
  ],
};
