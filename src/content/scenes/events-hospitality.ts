import { FULL, scrim, type SceneConfig, type SceneLayer } from "./types";

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
/** L2 · one of Rand's photos framed at about its own size, cropped to its box (`fx-frame`).
 * Laptop only: on a phone the frame would be a sliver, and the work follows in the section's strip. */
const frame = (id: string, slot: string, depth: number, box: SceneLayer["box"], rest: Partial<SceneLayer> = {}): SceneLayer => ({
  id,
  level: 2,
  slot,
  fx: "frame",
  depth,
  mobile: false,
  box,
  fit: "cover",
  ...rest,
});

/** L0 · a frame's own photo, blurred and dimmed behind it (`fx-blur`), at the frame's size so the
 * two share one file. Laptop only. */
const backdrop = (slot: string, sizesOf: string): SceneLayer => ({ id: "backdrop", level: 0, slot, fx: "blur", depth: 0.1, mobile: false, box: FULL, sizesOf });

/** L0 · a portrait photo as the phone's plate, where a laptop shows frames (`desktop: false`). */
const phonePlate = (slot: string): SceneLayer => ({ id: "phone-plate", level: 0, slot, depth: 0.15, push: 0.04, mobile: true, desktop: false, box: FULL });

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
    { id: "night", level: 0, slot: "ev-open-night", depth: 0.15, push: 0.04, mobile: false, eager: true, box: FULL },
    // L0: the same room in its light, wiping in from the centre aisle like curtains (D109).
    { id: "room", level: 0, slot: "ev-open-room", depth: 0.15, push: 0.04, mobile: true, box: FULL, style: { wipe: 0 }, keys: [{ shot: 1, to: { wipe: 1 } }] },
    // L1: the near tables, cut from the same photo along the aisle (D109): they open as the room is
    // dressed, then drift and push faster than it, so the camera walks down the aisle (2.5D).
    { id: "near-tables", level: 1, slot: "ev-open-table", depth: 0.55, push: 0.1, mobile: true, box: FULL, style: { wipe: 0 }, keys: [{ shot: 2, to: { wipe: 1 } }] },
    // L3: the overlay lifts as the light comes up (text stays AA over the scrim below).
    { id: "dusk", level: 3, fx: "shade", depth: 0, mobile: true, box: FULL, style: { opacity: 0.3 }, keys: [{ shot: 1, to: { opacity: 0.2 } }, { shot: 3, to: { opacity: 0.15 } }] },
    // L3: the stage's warm glow at the end of the aisle.
    { id: "stage-glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "18% 38%", inline: "26% 26%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 0.8, scale: 1.1 } }, { shot: 3, to: { scale: 1.5 } }] },
    // L2: the entrance (a real NO TIME arrangement), a framed photo at the inline-end (mirrors in AR).
    frame("entrance", "private-celebrations-3", 0.6, { block: "24% 14%", inline: "66% 7%" }, { enter: { shot: 3, from: { x: 12, opacity: 0 } } }),
    scrim,
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
    { id: "rows", level: 0, slot: "ev-conf-rows", depth: 0.15, push: 0.03, mobile: true, box: FULL },
    { id: "session", level: 0, slot: "ev-conf-session", depth: 0.15, push: 0.03, mobile: true, box: FULL, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1 } }] },
    frame("break", "catering-7", 0.3, { block: "12% 50%", inline: "58% 6%" }, { enter: { shot: 2, from: { x: 12, opacity: 0 } } }),
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
    { id: "hall", level: 0, slot: "ev-exh-hall", depth: 0.15, push: 0.04, mobile: true, box: FULL },
    frame("stand", "sandoz-1", 0.35, { block: "8% 30%", inline: "50% 28%" }, { enter: { shot: 1, from: { y: 8, opacity: 0 } } }),
    frame("pavilion", "egyptair-pavilion-1", 0.5, { block: "10% 64%", inline: "76% 3%" }, { enter: { shot: 2, from: { x: 12, opacity: 0 } } }),
    frame("identity", "uae-pro-league-1", 0.5, { block: "42% 34%", inline: "76% 3%" }, { enter: { shot: 2, from: { x: 12, opacity: 0 } } }),
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
    { id: "spot", level: 0, slot: "ev-launch-spot", depth: 0.15, push: 0.05, mobile: true, box: FULL },
    { id: "glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "20% 30%", inline: "25% 25%" }, style: { opacity: 0.4 }, keys: [{ shot: 1, to: { opacity: 0, scale: 1.3 } }] },
    // The real ceremony in a frame: the file is 1060px wide and busy, too soft and loud as a backdrop
    // behind the head. On a laptop it arrives beside the head with the second beat.
    frame("moment", "uae-pro-league-2", 0.35, { block: "10% 46%", inline: "42% 5%" }, { enter: { shot: 1, from: { x: 10, opacity: 0 } } }),
    // A phone: the same photo framed across the upper half, above the head, there as the scene
    // enters. Alone, the dark spot plate left the top half of the screen black (W02).
    frame("moment-phone", "uae-pro-league-2", 0.25, { block: "8% 56%", inline: "6% 6%" }, { mobile: true, desktop: false, enter: { shot: 0, from: { y: 8, opacity: 0 } } }),
    scrim,
  ],
};

/*
 * Sections IV–VI (D153). Rand's photos here are under 1100px wide, too small to fill a laptop
 * screen sharp, so on a laptop each beat is the photo framed at its own size over a blurred copy of
 * itself (`fx-blur`, the same picture as atmosphere, never upscaled sharp). A phone gets one
 * portrait photo as its plate instead (`desktop: false`), sharp at its width.
 */

/** IV · "Candles lit, roses set": the runner, then the roses close; Rand's own tables follow. */
export const EVENTS_GALAS: SceneConfig = {
  id: "events-galas",
  mode: "pass",
  shots: [
    { id: "runner", desktop: [0, 0.3], mobile: [0, 1] },
    { id: "roses", desktop: [0.3, 0.45], mobile: null },
  ],
  layers: [
    backdrop("private-celebrations-4", "runner"),
    phonePlate("private-celebrations-2"),
    frame("runner", "private-celebrations-4", 0.3, { block: "10% 50%", inline: "34% 25%" }),
    frame("roses", "private-celebrations-2", 0.55, { block: "6% 30%", inline: "78% 4%" }, { enter: { shot: 1, from: { y: 8, opacity: 0 } } }),
    scrim,
  ],
};

/**
 * V · "Sunset, the coffee is poured": the page's peak (D74, P2). Laptop: a short pin (0.6 vh) under
 * the header, the tent at night, then the carts, then the coffee on the carpet. Phone: no pin, the
 * brass cart as its plate as it crosses. Reduced motion: the end frame, every photo in place.
 */
/** The majlis's centre frame: the tent, then the coffee in its place. */
const CENTRE = { block: "8% 42%", inline: "34% 36%" };

export const EVENTS_MAJLIS: SceneConfig = {
  id: "events-majlis",
  mode: { desktop: "pin", mobile: "pass" },
  shots: [
    { id: "tent", desktop: [0, 0.2], mobile: [0, 1] },
    { id: "carts", desktop: [0.2, 0.4], mobile: null },
    { id: "coffee", desktop: [0.4, 0.6], mobile: null },
  ],
  layers: [
    backdrop("heritage-5", "tent"),
    phonePlate("heritage-4"),
    // The centre frame: the tent, then the coffee poured on the carpet in its place (beat 3).
    frame("tent", "heritage-5", 0.3, CENTRE, { level: 1 }),
    frame("coffee", "heritage-2", 0.3, CENTRE, { level: 1, enter: { shot: 2, from: { opacity: 0 } } }),
    // The right column: the brass carts arrive (beat 2).
    frame("carts", "heritage-1", 0.5, { block: "10% 56%", inline: "67% 3%" }, { enter: { shot: 1, from: { x: 12, opacity: 0 } } }),
    scrim,
  ],
};

/**
 * VI · "The rig goes up, then the light": the truss going up (Rand's photo, framed), the first beams
 * through haze, then the full rig live (stock until Rand's own rig photos arrive). Laptop: a short
 * pin (0.6 vh); phone: the beams, then the live rig, as it crosses.
 */
export const EVENTS_STAGE: SceneConfig = {
  id: "events-stage",
  mode: { desktop: "pin", mobile: "pass" },
  shots: [
    { id: "rig", desktop: [0, 0.2], mobile: null },
    { id: "beams", desktop: [0.2, 0.4], mobile: [0, 0.3] },
    { id: "live", desktop: [0.4, 0.6], mobile: [0.3, 0.55] },
  ],
  layers: [
    { id: "beams", level: 0, slot: "ev-stage-beams", depth: 0.15, push: 0.04, mobile: true, box: FULL, style: { opacity: 0.35 }, keys: [{ shot: 1, to: { opacity: 1 } }] },
    { id: "live", level: 0, slot: "ev-stage-live", depth: 0.15, push: 0.04, mobile: true, box: FULL, style: { opacity: 0 }, keys: [{ shot: 2, to: { opacity: 1 } }] },
    frame("rig", "private-celebrations-8", 0.4, { block: "10% 46%", inline: "44% 10%" }, { keys: [{ shot: 1, to: { opacity: 0 } }] }),
    scrim,
  ],
};
