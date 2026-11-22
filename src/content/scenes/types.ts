/**
 * Cinematic openings and layered scenes (DECISIONS D64; docs/design/storyboards/README.md).
 * A scene is data: shots on a scroll timeline (in vh of pinned scroll) and layers L0–L3.
 * `<LayeredScene>` renders it; `src/lib/scene-math.ts` holds the maths and the limits.
 */

import type { Grade } from "../../lib/grade";
import type { CategorySlug, Localized } from "../types";

export type Viewport = "desktop" | "mobile";
export type SceneMode = "pin" | "pass";

/** A shot's scroll range, `[start, end]`: vh of pinned scroll (a pinned scene) or fractions of the
 * crossing (a pass scene, 0–1). Null when it doesn't play at that width. */
export type ShotRange = [number, number] | null;

export interface SceneShot {
  id: string;
  /** Message key (namespace `scenes`) of the shot's line; none when the scene carries no lines (a pass scene under its section's H2). */
  copyKey?: string;
  desktop: ShotRange;
  mobile: ShotRange;
}

/** Inline offsets: x is in the inline direction (negative = from inline-start), as a % of the layer. */
export interface EnterFrom {
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
}

export interface LayerKey {
  /** Shot index (0-based) at whose start the change plays, over that shot. */
  shot: number;
  /** `wipe`: the mask wipe (D109), 0 = closed to a line at the centre, 1 = open (curtains, so it reads the same in RTL). */
  to: { opacity?: number; scale?: number; wipe?: number };
}

export interface SceneLayer {
  id: string;
  /** L0 plate · L1 midground · L2 foreground cutout · L3 atmosphere (code only). */
  level: 0 | 1 | 2 | 3;
  /** Vertical drift over the whole scene: y = −depth × 14 vh × progress. */
  depth: number;
  /** Scale added over the whole scene (scale = 1 + push × progress). */
  push?: number;
  /** Scene image slot id (`SCENE_IMAGES`, scenes/images.ts). None on L3. */
  slot?: string;
  /** L3 effect class (`fx-<name>` in layered-scene.css), e.g. "glow", "shade", "frame". */
  fx?: string;
  /** Rendered and animated below PIN_MIN_WIDTH (1024px) too. */
  mobile: boolean;
  /** `false`: a phone-only layer (below PIN_MIN_WIDTH), e.g. a portrait plate where laptops show frames (D153). */
  desktop?: false;
  /** Placement inside the stage, logical so it mirrors in RTL: CSS `inset-block` and `inset-inline` (start end). */
  box: { block: string; inline: string };
  /** The layer's resting style before any key plays. */
  style?: { opacity?: number; wipe?: number };
  /** Enters during a shot, from these offsets to its resting place. */
  enter?: { shot: number; from: EnterFrom };
  /** Changes at shot starts (light coming up, an overlay falling). The last one is the still. */
  keys?: LayerKey[];
  /** Requests its image at another layer's size (by id), not its own box's: a blurred backdrop
   * asks for its sharp frame's size, so the two share one file (D153). */
  sizesOf?: string;
  /** How the image fills its box. Default: `cover` for a full-frame layer (it registers with its
   * plate), `contain` otherwise (a trimmed cutout is never cropped); a framed photo is `cover`. */
  fit?: "cover" | "contain";
  /** Loads eagerly (shot-1 layers within the opening's budget only). */
  eager?: boolean;
}

export interface SceneConfig {
  id: string;
  /**
   * "pin" (default): pinned while its shots play (ranges in vh; an opening's PIN_LIMIT, a section
   * scene's SECTION_PIN_LIMIT). "pass": never pinned; it plays while it crosses the viewport, from
   * its top entering (0) to its bottom leaving (1). Per width when they differ: the Events majlis
   * pins briefly on desktop and passes on mobile (D74, P2).
   */
  mode?: SceneMode | Record<Viewport, SceneMode>;
  /** A category opening that plays its film as the hero (D154): pinned from 1024px, the still below. */
  hero?: true;
  shots: SceneShot[];
  layers: SceneLayer[];
}

/**
 * A scene layer's image (Task 2.10; layers.md). Files are graded at export (scripts/grade.mjs)
 * and stored at native size in public/images/scenes/<category>/.
 */
export interface SceneImageSlot {
  /** Stable id, as in layers.md, e.g. "ev-open-hall". */
  id: string;
  category: CategorySlug;
  /** The category's grade, baked into the file. */
  grade: Grade;
  /** Where the pixels come from: a curated real photo (D49, its id) or AI (new, or the slot it re-uses). */
  source: { kind: "real"; from: string } | { kind: "ai"; from?: string };
  /** URL of the graded WebP; null until it exists. A plate's 16:9 file. */
  src: string | null;
  /** Native pixel size of `src` (required with `src`, tested). */
  width?: number;
  height?: number;
  /** Plates only: the 9:16 file used below 900px. */
  mobile?: { src: string | null; width?: number; height?: number };
  /** Only for a layer that shows real work as evidence; every other layer is decorative (alt=""). */
  alt?: Localized<string>;
}

/** A layer box that fills the scene. */
export const FULL = { block: "0", inline: "0" } as const;

/** L3 · the scrim under the head and the shot lines, so ivory text holds on a photo's pale parts. */
export const scrim: SceneLayer = { id: "scrim", level: 3, fx: "scrim", depth: 0, mobile: true, box: FULL };
