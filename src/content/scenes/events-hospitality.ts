import type { SceneConfig } from "./types";

/**
 * I · Events & Hospitality, "The evening, before the first guest" (docs/content/visual-stories.md;
 * D153, D154). Photographs only: one real NO TIME room (private-celebrations-1, no people, no
 * branding) in three depths, and the entrance from the same kind of evening.
 *
 * Laptop (≥ 1024px, D151): the hero pins and plays four beats on a 2.0 vh pin, with the eyebrow,
 * H1, lead and "Request a quote" there from the first frame (LayeredScene mode "hero"):
 *   1. the room at night (the same photo graded to the hour before; `ev-open-night`),
 *   2. light comes up: the room in its own light wipes in from the centre aisle (`ev-open-room`),
 *   3. the near tables (cut from the same photo along the aisle, D109) open and walk closer,
 *   4. the entrance arrangement comes in from the inline-end, a framed photo: the first guest's view.
 * Phones and reduced motion: the still, the lit room with its tables (the entrance is desktop-only).
 */
export const EVENTS_OPENING: SceneConfig = {
  id: "events-opening",
  hero: true,
  shots: [
    { id: "night", copyKey: "events.s1", desktop: [0, 0.4], mobile: [0, 0.5] },
    { id: "lights-up", desktop: [0.4, 0.83], mobile: null },
    { id: "dressed", copyKey: "events.s3", desktop: [0.83, 1.8], mobile: [0.5, 1.05] },
    { id: "ready", copyKey: "events.s4", desktop: [1.8, 2.0], mobile: [1.05, 1.2] },
  ],
  layers: [
    // L0: the room at night, the hour before (the film's first frame, desktop only: phones get the
    // still, D154). Push-in 1.00 → 1.04 over the act.
    { id: "night", level: 0, slot: "ev-open-night", depth: 0.15, push: 0.04, mobile: false, eager: true, box: { block: "0", inline: "0" } },
    // L0: the same room in its light, wiping in from the centre aisle like curtains (D109).
    { id: "room", level: 0, slot: "ev-open-room", depth: 0.15, push: 0.04, mobile: true, eager: true, box: { block: "0", inline: "0" }, style: { wipe: 0 }, keys: [{ shot: 1, to: { wipe: 1 } }] },
    // L1: the near tables, cut from the same photo along the aisle (D109): they open as the room is
    // dressed, then drift and push faster than it, so the camera walks down the aisle (2.5D).
    { id: "near-tables", level: 1, slot: "ev-open-table", depth: 0.55, push: 0.1, mobile: true, eager: true, box: { block: "0", inline: "0" }, style: { wipe: 0 }, keys: [{ shot: 2, to: { wipe: 1 } }] },
    // L3: the overlay lifts as the light comes up (text stays AA over the scrim below).
    { id: "dusk", level: 3, fx: "shade", depth: 0, mobile: true, box: { block: "0", inline: "0" }, style: { opacity: 0.3 }, keys: [{ shot: 1, to: { opacity: 0.2 } }, { shot: 3, to: { opacity: 0.15 } }] },
    // L3: the stage's warm glow at the end of the aisle.
    { id: "stage-glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "18% 38%", inline: "26% 26%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.8, scale: 1.1 } }, { shot: 3, to: { scale: 1.5 } }] },
    // L2: the entrance (a real NO TIME arrangement), a framed photo at the inline-end (mirrors in AR).
    { id: "entrance", level: 2, slot: "private-celebrations-3", fx: "ev-frame", depth: 0.6, mobile: false, box: { block: "24% 14%", inline: "66% 7%" }, enter: { shot: 3, from: { x: 12, opacity: 0 } } },
    // L3: the scrim under the H1 and the lines.
    { id: "scrim", level: 3, fx: "ev-scrim", depth: 0, mobile: true, box: { block: "0", inline: "0" } },
  ],
};

/*
 * Sections I–III (D153; docs/content/visual-stories.md): each tells one moment in photographs as it
 * crosses the viewport, never pinned, so the page keeps moving between the opening and the majlis.
 * The beats land by the middle of the crossing (0.55), while the scene fills the screen; after
 * that it only drifts out. Full-frame plates cross-fade; Rand's own work arrives in frames at the inline-end (mirrored in
 * Arabic), clear of the head, which sits over the lower third on the scrim. Frames are laptop-only:
 * on a phone the plates play and the work follows in the section's strip (GALLERIES).
 */
const scrim = { id: "scrim", level: 3, fx: "ev-scrim", depth: 0, mobile: true, box: { block: "0", inline: "0" } } as const;

/** I · "Eight in the morning, the hall fills": the rows set, the session running, the break laid. */
export const EVENTS_CONFERENCES: SceneConfig = {
  id: "events-conferences",
  mode: "pass",
  shots: [
    { id: "rows", desktop: [0, 0.3], mobile: [0, 0.3] },
    { id: "session", desktop: [0.3, 0.42], mobile: [0.3, 0.5] },
    { id: "break", desktop: [0.42, 0.55], mobile: null },
  ],
  layers: [
    { id: "rows", level: 0, slot: "ev-conf-rows", depth: 0.15, push: 0.03, mobile: true, box: { block: "0", inline: "0" } },
    { id: "session", level: 0, slot: "ev-conf-session", depth: 0.15, push: 0.03, mobile: true, box: { block: "0", inline: "0" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1 } }] },
    { id: "break", level: 2, slot: "catering-7", fx: "ev-frame", depth: 0.3, mobile: false, box: { block: "12% 50%", inline: "58% 6%" }, enter: { shot: 2, from: { x: 12, opacity: 0 } } },
    scrim,
  ],
};

/** II · "The night before doors open": the empty hall, then NO TIME's stands standing in it (⚑). */
export const EVENTS_EXHIBITIONS: SceneConfig = {
  id: "events-exhibitions",
  mode: "pass",
  shots: [
    { id: "hall", desktop: [0, 0.3], mobile: [0, 1] },
    { id: "stand", desktop: [0.3, 0.42], mobile: null },
    { id: "work", desktop: [0.42, 0.55], mobile: null },
  ],
  layers: [
    { id: "hall", level: 0, slot: "ev-exh-hall", depth: 0.15, push: 0.04, mobile: true, box: { block: "0", inline: "0" } },
    { id: "stand", level: 2, slot: "sandoz-1", fx: "ev-frame", depth: 0.35, mobile: false, box: { block: "8% 30%", inline: "50% 28%" }, enter: { shot: 1, from: { y: 8, opacity: 0 } } },
    { id: "pavilion", level: 2, slot: "egyptair-pavilion-1", fx: "ev-frame", depth: 0.5, mobile: false, box: { block: "10% 64%", inline: "76% 3%" }, enter: { shot: 2, from: { x: 12, opacity: 0 } } },
    { id: "identity", level: 2, slot: "uae-pro-league-1", fx: "ev-frame", depth: 0.5, mobile: false, box: { block: "42% 34%", inline: "76% 3%" }, enter: { shot: 2, from: { x: 12, opacity: 0 } } },
    scrim,
  ],
};

/** III · "Ten seconds before the reveal": one spot on an empty floor, then the real ceremony (⚑) framed beside it. */
export const EVENTS_LAUNCHES: SceneConfig = {
  id: "events-launches",
  mode: "pass",
  shots: [
    { id: "spot", desktop: [0, 0.32], mobile: [0, 0.3] },
    { id: "moment", desktop: [0.32, 0.5], mobile: [0.3, 0.5] },
  ],
  layers: [
    { id: "spot", level: 0, slot: "ev-launch-spot", depth: 0.15, push: 0.05, mobile: true, box: { block: "0", inline: "0" } },
    { id: "glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "20% 30%", inline: "25% 25%" }, style: { opacity: 0.4 }, keys: [{ shot: 1, to: { opacity: 0, scale: 1.3 } }] },
    // The real ceremony in a frame: the file is 1060px wide and busy, too soft and loud as a backdrop
    // behind the head. Laptop only (a phone keeps the spot, the frame would be a sliver).
    { id: "moment", level: 2, slot: "uae-pro-league-2", fx: "ev-frame", depth: 0.35, mobile: false, box: { block: "10% 46%", inline: "42% 5%" }, enter: { shot: 1, from: { x: 10, opacity: 0 } } },
    scrim,
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
