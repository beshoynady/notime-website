/**
 * Cinematic openings and layered scenes (DECISIONS D64; docs/design/storyboards/README.md).
 * A scene is data: shots on a scroll timeline (in vh of pinned scroll) and layers L0–L3.
 * `<LayeredScene>` renders it; `src/lib/scene-math.ts` holds the maths and the limits.
 */

export type Viewport = "desktop" | "mobile";

/** A shot's scroll range in vh of pinned scroll, `[start, end]`; null when it doesn't play at that width. */
export type ShotRange = [number, number] | null;

export interface SceneShot {
  id: string;
  /** Message key (namespace `scenes`) of the shot's line. */
  copyKey: string;
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
  to: { opacity?: number; scale?: number };
}

export interface SceneLayer {
  id: string;
  /** L0 plate · L1 midground · L2 foreground cutout · L3 atmosphere (code only). */
  level: 0 | 1 | 2 | 3;
  /** Vertical drift over the whole scene: y = −depth × 14 vh × progress. */
  depth: number;
  /** Scale added over the whole scene (scale = 1 + push × progress). */
  push?: number;
  /** Image slot id (src/content/images.ts or the scene slots). None on L3. */
  slot?: string;
  /** L3 effect class (`fx-<name>` in layered-scene.css), e.g. "glow", "shade", "beam". */
  fx?: string;
  /** Rendered and animated below 900px too. */
  mobile: boolean;
  /** Placement inside the stage, logical so it mirrors in RTL: CSS `inset-block` and `inset-inline` (start end). */
  box: { block: string; inline: string };
  /** The layer's resting style before any key plays. */
  style?: { opacity?: number };
  /** Enters during a shot, from these offsets to its resting place. */
  enter?: { shot: number; from: EnterFrom };
  /** Changes at shot starts (light coming up, an overlay falling). The last one is the still. */
  keys?: LayerKey[];
  /** Loads eagerly (shot-1 layers within the opening's budget only). */
  eager?: boolean;
}

export interface SceneConfig {
  id: string;
  shots: SceneShot[];
  layers: SceneLayer[];
}
