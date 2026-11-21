import type { EnterFrom, SceneConfig, SceneLayer, SceneMode, SceneShot, Viewport } from "@/content/scenes/types";

/** The opening's pinned scroll, at most (D64): vh of scroll per viewport. */
/** Scenes pin from this width (D151, the owner's "laptop"); below it they pass. globals.css and layered-scene.css use the same number. */
export const PIN_MIN_WIDTH = 1024;

export const PIN_LIMIT = { desktop: 2.0, mobile: 1.2 } as const;
/** A scene inside a service section (the majlis, D74 P2): a short pin on desktop, none on mobile. */
export const SECTION_PIN_LIMIT = { desktop: 0.6, mobile: 0 } as const;
/** Vertical drift per unit of depth over the whole scene, in vh. */
const DRIFT_VH = 14;
const MAX_IMAGE_LAYERS = 5;
const MAX_MOBILE_IMAGE_LAYERS = 3;

/** Where the pinned scroll ends at this width: the end of its last shot (vh). */
export function pinLength(shots: SceneShot[], viewport: Viewport): number {
  return Math.max(0, ...shots.map((s) => s[viewport]?.[1] ?? 0));
}

/** Whether the scene pins or passes at this width (a pin unless it says otherwise). */
export function sceneMode(scene: Pick<SceneConfig, "mode">, viewport: Viewport): SceneMode {
  const mode = scene.mode ?? "pin";
  return typeof mode === "string" ? mode : mode[viewport];
}

/**
 * When each shot line shows at this width (vh, or fractions of a crossing): from its shot's start
 * until the next line comes in, the last until the end. A shot without a line keeps the previous
 * line on screen (D74, P1: three lines over the Evening's four shots), and shots that don't play
 * at this width are skipped.
 */
export function lineSpans(shots: SceneShot[], viewport: Viewport): { shot: number; start: number; end: number }[] {
  const lined = shots.flatMap((s, i) => (s.copyKey && s[viewport] ? [{ shot: i, start: s[viewport][0] }] : []));
  const end = pinLength(shots, viewport);
  return lined.map((l, k) => ({ ...l, end: lined[k + 1]?.start ?? end }));
}

/** Index of the shot playing after `vh` of pinned scroll; shots without a range at this width are skipped. */
export function shotAt(vh: number, shots: SceneShot[], viewport: Viewport): number {
  const playing = shots.map((s, i) => [i, s[viewport]] as const).filter((e): e is readonly [number, [number, number]] => e[1] !== null);
  if (playing.length === 0) return 0;
  for (const [i, [, end]] of playing) if (vh < end) return i;
  return playing[playing.length - 1][0];
}

/** A layer's drift at `progress` (0–1 over the scene): y in vh, and its scale. */
export function layerDrift(depth: number, push: number, progress: number): { y: number; scale: number } {
  return { y: depth === 0 ? 0 : -depth * DRIFT_VH * progress, scale: 1 + push * progress };
}

/** GSAP "from" values for an entering layer; `dir` is 1 for LTR and −1 for RTL (inline x mirrors). */
export function enterFrom(from: EnterFrom, dir: 1 | -1) {
  return { xPercent: (from.x ?? 0) * dir, yPercent: from.y ?? 0, opacity: from.opacity ?? 0, scale: from.scale ?? 1 };
}

/** A mask wipe's clip-path (D109): 0 is closed to a vertical line at the centre, 1 is open. Symmetric, so RTL needs nothing. */
export function wipeInset(wipe: number): string {
  const side = Math.round((1 - Math.min(1, Math.max(0, wipe))) * 5000) / 100;
  return `inset(0% ${side}% 0% ${side}%)`;
}

/** The end frame of a layer (reduced motion and the still): its last key's values. */
export function stillState(layer: SceneLayer): { opacity?: number; scale?: number; wipe?: number } {
  return layer.keys?.length ? { ...layer.keys[layer.keys.length - 1].to } : {};
}

/**
 * Everything that breaks the scene rules (D64, storyboards README §3); empty when the scene is valid.
 * `limits` is the pin limit per width: an opening's (PIN_LIMIT) or a section scene's (SECTION_PIN_LIMIT).
 */
export function sceneProblems(scene: SceneConfig, limits: Record<Viewport, number> = PIN_LIMIT): string[] {
  const problems: string[] = [];
  for (const viewport of ["desktop", "mobile"] as const) {
    const pass = sceneMode(scene, viewport) === "pass";
    const pin = Math.round(pinLength(scene.shots, viewport) * 100) / 100;
    if (!pass && pin > limits[viewport]) problems.push(`${viewport} pin ${pin} vh > ${limits[viewport]} vh`);
    let prev: SceneShot | undefined;
    for (const shot of scene.shots) {
      const range = shot[viewport];
      if (!range) continue;
      if (pass && range[1] > 1) problems.push(`${viewport} shot ${shot.id} ends past the crossing (${range[1]} > 1)`);
      const prevEnd = prev?.[viewport]?.[1];
      if (prev && prevEnd !== undefined && range[0] < prevEnd) problems.push(`${viewport} shot ${shot.id} starts before shot ${prev.id} ends`);
      prev = shot;
    }
  }

  const images = scene.layers.filter((l) => l.slot);
  if (images.length > MAX_IMAGE_LAYERS) problems.push(`${images.length} image layers > ${MAX_IMAGE_LAYERS}`);
  const mobileImages = images.filter((l) => l.mobile).length;
  if (mobileImages > MAX_MOBILE_IMAGE_LAYERS) problems.push(`${mobileImages} mobile image layers > ${MAX_MOBILE_IMAGE_LAYERS}`);

  const seen = new Set<string>();
  for (const l of scene.layers) {
    if (seen.has(l.id)) problems.push(`duplicate layer id ${l.id}`);
    seen.add(l.id);
    if (l.level === 3 && l.slot) problems.push(`layer ${l.id}: L3 is code only`);
    for (const shot of [l.enter?.shot, ...(l.keys ?? []).map((k) => k.shot)]) {
      if (shot !== undefined && !scene.shots[shot]) problems.push(`layer ${l.id}: shot ${shot + 1} does not exist`);
    }
    if (l.eager && l.enter && l.enter.shot > 0) problems.push(`layer ${l.id}: eager but enters in shot ${l.enter.shot + 1}`);
  }
  return problems;
}

/**
 * How a scene layer's image loads: eagerly or lazily, with high fetch priority or not, and
 * `phoneGate`: an eager image of a desktop-only layer, which phones must not fetch (SceneImage
 * gives them a placeholder source; its box is `display: none` there anyway).
 */
export interface ImageLoading {
  eager: boolean;
  high: boolean;
  phoneGate: boolean;
}

/**
 * How each image layer of a scene loads (N06), by layer id; layers without a file are left out.
 * The still (a category's hero) is the first paint: the first image its end frame shows is the
 * LCP candidate, eager with high priority at every width it shows (gated from phones when the
 * layer is desktop-only); the other phone layers it shows load eagerly, desktop-only or hidden
 * ones lazily (a lazy image in a `display: none` box is never fetched). The build scene follows
 * the hero and reuses its files from the cache, so it never competes: all lazy.
 */
/** How a LayeredScene renders (D154): `build` scrubs a pinned scene (lazy images); `still` is its end
 * frame at every width; `hero` pins from PIN_MIN_WIDTH and is the still below it. */
export type RenderMode = "build" | "still" | "hero";

export function imageLoading(scene: SceneConfig, mode: RenderMode, hasFile: (slot: string) => boolean): Record<string, ImageLoading> {
  const out: Record<string, ImageLoading> = {};
  let firstStill = true;
  let firstRest = true;
  for (const layer of scene.layers) {
    if (!layer.slot || !hasFile(layer.slot)) continue;
    const end = { ...layer.style, ...stillState(layer) };
    // The still shows on phones in a hero (D154) and at every width in a still.
    const atStill = mode !== "build" && end.opacity !== 0 && end.wipe !== 0 && (mode === "still" || layer.mobile);
    // A hero's first desktop frame: the rest state, before any entrance.
    const atRest = mode === "hero" && !layer.enter && layer.style?.opacity !== 0 && layer.style?.wipe !== 0;
    const high = (atStill && firstStill) || (atRest && firstRest);
    const eager = high || ((atStill || atRest) && layer.mobile);
    out[layer.id] = { eager, high, phoneGate: eager && !layer.mobile };
    if (atStill) firstStill = false;
    if (atRest) firstRest = false;
  }
  return out;
}

/** The copy key of the last shot with a line: the still's lead, the scene's promise (N06). */
export function stillLead(shots: SceneShot[]): string | undefined {
  return shots.findLast((s) => s.copyKey)?.copyKey;
}

/**
 * The `sizes` a layer's image asks for: its share of the viewport's width, read from the layer's
 * inline insets ("start end", or one value for both, in %). A full-frame layer is "100vw". An
 * inset it can't read falls back to "100vw": a file too large costs bytes, one too small looks soft
 * (self-audit B10: every layer above the ground asked for "50vw").
 */
export function layerSizes(box: { inline: string; block?: string }): string {
  const parts = box.inline.trim().split(/\s+/);
  const pct = parts.map((p) => (p === "0" ? 0 : /^\d+(\.\d+)?%$/.test(p) ? parseFloat(p) : NaN));
  const [start, end = start] = pct;
  if (Number.isNaN(start) || Number.isNaN(end)) return "100vw";
  const share = Math.max(1, Math.round(100 - start - end));
  return `${share}vw`;
}

/**
 * The scene as a page shows it: image layers whose picture is hidden or missing are dropped (fill
 * or hide, D78; media.ts `hidden`), so a beat without its photo simply doesn't play. Code-only
 * layers (L3 light) and the shots stay.
 */
export function visibleLayers(scene: SceneConfig, has: (slot: string) => boolean): SceneConfig {
  const layers = scene.layers.filter((l) => !l.slot || has(l.slot));
  return layers.length === scene.layers.length ? scene : { ...scene, layers };
}
