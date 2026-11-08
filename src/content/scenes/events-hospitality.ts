import type { SceneConfig } from "./types";

/**
 * I · Events & Hospitality, "The Evening" (docs/design/storyboards/events-hospitality.md).
 * In review: lab route only until the animatic is approved (Task 3.0, stop point 2).
 *
 * Opening, desktop: four shots on a 2.0 vh pin (empty room → lights up → dressed → ready).
 * Mobile: three shots on 1.2 vh. Shot 2's lights hand their cues to shot 3, which merges lights
 * and dressing (storyboard, "Mobile"); the table and the florals are the only cutouts there.
 */
export const EVENTS_OPENING: SceneConfig = {
  id: "events-opening",
  shots: [
    { id: "empty-room", copyKey: "events.s1", desktop: [0, 0.45], mobile: [0, 0.35] },
    { id: "lights-up", copyKey: "events.s2", desktop: [0.45, 0.95], mobile: null },
    { id: "dressed", copyKey: "events.s3", desktop: [0.95, 1.5], mobile: [0.35, 1.0] },
    { id: "ready", copyKey: "events.s4", desktop: [1.5, 2.0], mobile: [1.0, 1.2] },
  ],
  layers: [
    // L0: the empty hall. Push-in 1.00 → 1.04 over the act (1.02 by the end of shot 2).
    { id: "hall", level: 0, slot: "ev-open-hall", depth: 0.15, push: 0.04, mobile: true, eager: true, box: { block: "0", inline: "0" } },
    // L3: dusk. The overlay falls 70% → 40% as the lights come up, then 25% when the room is ready.
    { id: "dusk", level: 3, fx: "shade", depth: 0, mobile: true, box: { block: "0", inline: "0" }, style: { opacity: 0.7 }, keys: [{ shot: 1, to: { opacity: 0.4 } }, { shot: 3, to: { opacity: 0.25 } }] },
    // L3: haze, one radial gradient at 4%, there from the first frame.
    { id: "haze", level: 3, fx: "haze", depth: 0.05, mobile: true, box: { block: "10% 30%", inline: "10% 10%" } },
    // L3: the stage glow comes up in shot 2, then spreads to fill the frame for shot 4.
    { id: "stage-glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "18% 38%", inline: "26% 26%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1, scale: 1.1 } }, { shot: 3, to: { scale: 1.6 } }] },
    // L3: two beams from the rig (desktop).
    { id: "beam-start", level: 3, fx: "beam", depth: 0.1, mobile: false, box: { block: "0 30%", inline: "30% 58%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.5 } }] },
    { id: "beam-end", level: 3, fx: "beam", depth: 0.1, mobile: false, box: { block: "0 30%", inline: "58% 30%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.5 } }] },
    // L1: the dressed table rises into the midground.
    { id: "table", level: 1, slot: "ev-open-table", depth: 0.5, mobile: true, box: { block: "50% 6%", inline: "12% 12%" }, enter: { shot: 2, from: { y: 30 } } },
    // L2: florals drift in from inline-start, candles from inline-end, glasses pass the lens (desktop).
    { id: "florals", level: 2, slot: "ev-open-florals", depth: 1.2, mobile: true, box: { block: "30% 0", inline: "0 70%" }, enter: { shot: 2, from: { x: -30 } } },
    { id: "candles", level: 2, slot: "ev-open-candles", depth: 1.0, mobile: false, box: { block: "48% 4%", inline: "72% 2%" }, enter: { shot: 2, from: { x: 30 } } },
    { id: "glasses", level: 2, slot: "ev-open-glasses", depth: 1.3, mobile: false, box: { block: "68% -10%", inline: "80% -6%" }, enter: { shot: 2, from: { x: 20, y: 20 } } },
    // L3: candle points light up as the room is ready (their flicker comes with the live build, Task 3.2).
    { id: "candle-points", level: 3, fx: "candles", depth: 0.3, mobile: true, box: { block: "46% 22%", inline: "14% 14%" }, style: { opacity: 0 }, keys: [{ shot: 3, to: { opacity: 1 } }] },
  ],
};

/**
 * Section V's majlis (hospitality): not pinned, it plays while it crosses the viewport. Dusk over
 * sand, the lit tent, a brass dallah pouring into a cup (the pour is an SVG stroke, drawn from 40%
 * to 70% of the crossing), and the sky deepening to night. No lines: the section's H2 and promise
 * sit over its lower third, which the layers leave clear. Mobile: the plate, the tent and the dallah (the cup merges into it).
 */
export const EVENTS_MAJLIS: SceneConfig = {
  id: "events-majlis",
  mode: "pass",
  shots: [
    { id: "dusk", desktop: [0, 0.4], mobile: [0, 0.4] },
    { id: "pour", desktop: [0.4, 0.7], mobile: [0.4, 0.7] },
    { id: "night", desktop: [0.7, 1], mobile: [0.7, 1] },
  ],
  layers: [
    { id: "sand", level: 0, slot: "ev-majlis-dusk", depth: 0.15, push: 0.03, mobile: true, box: { block: "0", inline: "0" } },
    // L3: the sky deepens from dusk to night.
    { id: "night-sky", level: 3, fx: "shade", depth: 0, mobile: true, box: { block: "0 45%", inline: "0" }, style: { opacity: 0 }, keys: [{ shot: 2, to: { opacity: 0.55 } }] },
    { id: "tent", level: 1, slot: "ev-majlis-tent", depth: 0.5, mobile: true, box: { block: "16% 42%", inline: "8% 46%" } },
    // L2: the dallah at inline-end pours toward inline-start (mirrors in AR).
    { id: "dallah", level: 2, slot: "ev-majlis-dallah", depth: 1.0, mobile: true, box: { block: "8% 38%", inline: "66% 6%" } },
    { id: "cup", level: 2, slot: "ev-majlis-cup", depth: 1.1, mobile: false, box: { block: "46% 38%", inline: "50% 38%" } },
    // L3: the pour (SVG stroke in the live build) and three wisps of steam.
    { id: "pour", level: 3, depth: 1.05, mobile: true, box: { block: "22% 54%", inline: "56% 34%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1 } }] },
    { id: "steam", level: 3, depth: 1.1, mobile: true, box: { block: "34% 54%", inline: "50% 40%" }, style: { opacity: 0 }, keys: [{ shot: 2, to: { opacity: 0.8 } }] },
  ],
};
