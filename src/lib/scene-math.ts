import type { EnterFrom, SceneConfig, SceneLayer, SceneMode, SceneShot, Viewport } from "@/content/scenes/types";

/** The opening's pinned scroll, at most (D64): vh of scroll per viewport. */
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

/** The end frame of a layer (reduced motion and the still): its last key's values. */
export function stillState(layer: SceneLayer): { opacity?: number; scale?: number } {
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
