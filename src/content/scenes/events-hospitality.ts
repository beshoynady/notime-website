import type { SceneConfig } from "./types";

/**
 * I · Events & Hospitality, "The Evening" (docs/design/storyboards/events-hospitality.md).
 * Public since the full Events build (batch 2): the animatic was approved with D74's changes.
 *
 * Opening, desktop: four shots on a 2.0 vh pin (empty room → lights up → dressed → ready) and
 * three lines (D74, P1): shot 2 has none, so the first line holds while the lights come up. The
 * shots are timed for the lines (about 1 s each at a normal scroll): the dressing gets the second
 * line, and the promise lands with the last light key.
 * Mobile: three shots on 1.2 vh. Shot 2's lights hand their cues to shot 3, which merges lights
 * and dressing (storyboard, "Mobile").
 *
 * Images: the empty hall is drawn in code, an architect's one-point perspective in champagne
 * hairlines (`fx-ev-hall`, themes/evening.css), and the room is dressed by a real NO TIME photo
 * (private-celebrations-1: no people, no branding) on the same vanishing point, in two depths
 * (D109): the room (`ev-open-room`) and its near tables (`ev-open-table`, cut along the aisle),
 * which open together in a mask wipe and then separate as the camera moves in. The hall's AI
 * plate keeps its slot and covers the drawing once it exists. The florals, candles and glasses
 * cutouts stay documented for a later pass (the profile's photos don't cut cleanly enough).
 */
export const EVENTS_OPENING: SceneConfig = {
  id: "events-opening",
  shots: [
    { id: "empty-room", copyKey: "events.s1", desktop: [0, 0.4], mobile: [0, 0.5] },
    { id: "lights-up", desktop: [0.4, 0.83], mobile: null },
    { id: "dressed", copyKey: "events.s3", desktop: [0.83, 1.8], mobile: [0.5, 1.05] },
    { id: "ready", copyKey: "events.s4", desktop: [1.8, 2.0], mobile: [1.05, 1.2] },
  ],
  layers: [
    // L0: the empty hall, drawn (its plate's slot on top when it exists). Push-in 1.00 → 1.04 over the act.
    { id: "hall", level: 0, slot: "ev-open-hall", fx: "ev-hall", depth: 0.15, push: 0.04, mobile: true, eager: true, box: { block: "0", inline: "0" } },
    // L0: the room, dressed (a real photo on the drawing's vanishing point): it opens over the
    // drawing in a mask wipe from the centre aisle, like curtains (D109), as the room is dressed.
    { id: "room", level: 0, slot: "ev-open-room", depth: 0.15, push: 0.04, mobile: true, box: { block: "0", inline: "0" }, style: { wipe: 0 }, keys: [{ shot: 2, to: { wipe: 1 } }] },
    // L1: the near tables, cut from the same photo along the aisle (D109): full-frame, so they
    // register with the room at any aspect, and drifting and pushing faster than it, so the camera
    // dollies down the aisle (2.5D parallax). They open with the room.
    { id: "near-tables", level: 1, slot: "ev-open-table", depth: 0.55, push: 0.1, mobile: true, box: { block: "0", inline: "0" }, style: { wipe: 0 }, keys: [{ shot: 2, to: { wipe: 1 } }] },
    // L3: dusk. The overlay falls 70% → 40% as the lights come up, then 25% when the room is ready.
    { id: "dusk", level: 3, fx: "shade", depth: 0, mobile: true, box: { block: "0", inline: "0" }, style: { opacity: 0.7 }, keys: [{ shot: 1, to: { opacity: 0.4 } }, { shot: 3, to: { opacity: 0.25 } }] },
    // L3: haze, one radial gradient at 4%, there from the first frame.
    { id: "haze", level: 3, fx: "haze", depth: 0.05, mobile: true, box: { block: "10% 30%", inline: "10% 10%" } },
    // L3: the stage glow comes up in shot 2, then spreads to fill the frame for shot 4.
    { id: "stage-glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "18% 38%", inline: "26% 26%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1, scale: 1.1 } }, { shot: 3, to: { scale: 1.6 } }] },
    // L3: two beams from the rig (desktop).
    { id: "beam-start", level: 3, fx: "beam", depth: 0.1, mobile: false, box: { block: "0 30%", inline: "30% 58%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.5 } }] },
    { id: "beam-end", level: 3, fx: "beam", depth: 0.1, mobile: false, box: { block: "0 30%", inline: "58% 30%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.5 } }] },
    // L3: candle points light up as the room is ready; they flicker twice while the act is live (evening.css).
    { id: "candle-points", level: 3, fx: "candles", depth: 0.3, mobile: true, box: { block: "46% 22%", inline: "14% 14%" }, style: { opacity: 0 }, keys: [{ shot: 3, to: { opacity: 1 } }] },
    // L3: the scrim under the H1 and the lines (the lit room's floor is pale).
    { id: "scrim", level: 3, fx: "ev-scrim", depth: 0, mobile: true, box: { block: "0", inline: "0" } },
  ],
};

/**
 * Section V's majlis (hospitality), the page's peak (D74, P2). Desktop: a short pin (0.6 vh) with
 * two beats, the coffee pour, then the light blooming in the tent as the sky deepens; it scrolls
 * in at dusk, the scene's resting frame. Mobile: no pin, it plays while it crosses the viewport
 * (dusk, pour, night). Reduced motion: the end frame (poured, lit, night).
 *
 * Drawn in code in v1: the dusk over the dunes (`fx-mj-dusk`) and the lit tent (`fx-mj-tent`) are
 * layers here; the dallah, the cup, the pour and the steam are one SVG drawing over the stage
 * (MajlisArt), so the pour always meets the cup, scrubbed by its own GSAP trigger on the same
 * scroll range. The plate and tent slots keep their place and cover the drawings once their files
 * exist. No lines: the section's H2 and promise sit over its lower third, which the layers leave clear.
 */
export const EVENTS_MAJLIS: SceneConfig = {
  id: "events-majlis",
  mode: { desktop: "pin", mobile: "pass" },
  shots: [
    { id: "dusk", desktop: null, mobile: [0, 0.4] },
    { id: "pour", desktop: [0, 0.3], mobile: [0.4, 0.7] },
    { id: "bloom", desktop: [0.3, 0.6], mobile: [0.7, 1] },
  ],
  layers: [
    { id: "sand", level: 0, slot: "ev-majlis-dusk", fx: "mj-dusk", depth: 0.15, push: 0.03, mobile: true, box: { block: "0", inline: "0" } },
    // L3: the sky deepens from dusk to night.
    { id: "night-sky", level: 3, fx: "shade", depth: 0, mobile: true, box: { block: "0 45%", inline: "0" }, style: { opacity: 0 }, keys: [{ shot: 2, to: { opacity: 0.55 } }] },
    // L3: the tent's light blooms (beat 2): one glow behind and around it.
    { id: "tent-bloom", level: 3, fx: "glow", depth: 0.5, mobile: true, box: { block: "24% 26%", inline: "0 40%" }, style: { opacity: 0 }, keys: [{ shot: 2, to: { opacity: 1, scale: 1.2 } }] },
    // L1: the tent on the horizon, at inline-start (mirrors in AR), its base on the far dune.
    { id: "tent", level: 1, slot: "ev-majlis-tent", fx: "mj-tent", depth: 0.5, mobile: true, box: { block: "34% 35%", inline: "6% 52%" } },
  ],
};
