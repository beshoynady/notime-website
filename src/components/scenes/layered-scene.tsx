import type { CSSProperties, ReactNode } from "react";
import { getSceneImage, type SceneConfig, type SceneLayer } from "@/content/scenes";
import { imageLoading, layerSizes, pinLength, sceneMode, stillState, visibleLayers, wipeInset, type ImageLoading, type RenderMode } from "@/lib/scene-math";
import { cn } from "@/lib/utils";
import { SceneDirector } from "./scene-director";
import { SceneImage } from "./scene-image";
import "./layered-scene.css";

/**
 * A cinematic opening (D64; docs/design/storyboards/README.md): L0–L3 layers in a full-viewport
 * stage, the shot lines, and `children` (eyebrow, H1, skip control) on top.
 *
 * Server-rendered, so it reads without JS: without JS or under reduced motion it is the still
 * (the end frame, every line visible). With JS and motion, CSS shows shot 1 from the first
 * paint and SceneDirector scrubs the shots against a pinned scroll (GSAP).
 *
 * Each layer has three nested boxes, one per kind of motion, so no two tweens share an element:
 * `.scene-layer` drift (depth) › `.scene-enter` entrance › `.scene-light` keys (light, overlay).
 *
 * `mode="still"` (N06, a category's hero) renders only that end frame, at every width and with or
 * without JS: no pin, no reservation, no SceneDirector, so no ScrollTrigger. Its first image is
 * fetched with high priority. `mode="build"` (the default) is the scrubbed scene above; its images
 * are lazy. `mode="hero"` (D154, a category opening that plays its film) is both: the pinned build
 * where scenes pin (≥ PIN_MIN_WIDTH), the still below it, with no mobile reservation or timeline.
 * Its first desktop frame and its phone still load first (imageLoading).
 *
 * A layer whose picture is hidden or missing is dropped (visibleLayers, D78), so its beat doesn't play.
 *
 * `variant="animatic"` draws each layer as a labelled flat box (the grey-box animatic, Task 2.9).
 */
export function LayeredScene({
  scene: config,
  lines,
  variant,
  mode = "build",
  label,
  overlayClassName,
  pinUnderBars,
  children,
}: {
  scene: SceneConfig;
  /** The shots' lines, already translated, in shot order; "" for a shot without one. */
  lines: string[];
  variant: "live" | "animatic";
  mode?: RenderMode;
  /** Names the scene as a region; leave it out when the scene sits inside a named section. */
  label?: string;
  /** Sets the overlay's inline box (e.g. `frame`); the overlay itself has no inline padding. */
  overlayClassName?: string;
  /** Pins under the fixed header (a scene inside a section), not at the viewport's top. */
  pinUnderBars?: boolean;
  children?: ReactNode;
}) {
  const has = (slot: string) => !!getSceneImage(slot)?.src;
  const scene = visibleLayers(config, has);
  const still = mode === "still";
  const hero = mode === "hero";
  const loading = imageLoading(scene, mode);
  const stage = (
    <div
      className="scene"
      data-scene={scene.id}
      data-variant={variant}
      data-mode={mode === "build" ? undefined : mode}
      data-shot-active={still ? undefined : "0"}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div className="scene-layers" aria-hidden="true">
        {scene.layers.map((layer) => {
          const sizedBy = (layer.sizesOf && scene.layers.find((l) => l.id === layer.sizesOf)) || layer;
          return <Layer key={layer.id} layer={layer} sizes={layerSizes(sizedBy.box)} variant={variant} loading={loading[layer.id]} />;
        })}
      </div>
      <div className={cn("scene-overlay", overlayClassName)}>
        {children}
        {lines.some(Boolean) && (
          <div className="scene-copy">
            {scene.shots.map((shot, i) =>
              lines[i] ? (
                <p
                  key={shot.id}
                  className="scene-line"
                  data-shot={i}
                  data-desktop={shot.desktop ? "" : undefined}
                  data-mobile={shot.mobile ? "" : undefined}
                >
                  {lines[i]}
                </p>
              ) : null,
            )}
          </div>
        )}
      </div>
      {!still && <SceneDirector scene={scene} pinUnderBars={pinUnderBars} desktopOnly={hero} />}
    </div>
  );
  if (still) return stage;
  // The pin's scroll distance per width, reserved from the server render (globals.css, "Pin
  // reservations"): ScrollTrigger adopts this wrapper as its spacer, so its spacing replaces the
  // reservation in the same task and a landing on a section below never moves (M1).
  const reserve = (v: "desktop" | "mobile") => (sceneMode(scene, v) === "pass" || (hero && v === "mobile") ? 0 : pinLength(scene.shots, v));
  return (
    <div className="scene-pin" style={{ "--pin-d": reserve("desktop"), "--pin-m": reserve("mobile") } as CSSProperties}>
      {stage}
    </div>
  );
}

function Layer({ layer, sizes, variant, loading }: { layer: SceneLayer; sizes: string; variant: "live" | "animatic"; loading?: ImageLoading }) {
  const still = stillState(layer);
  const light = {
    "--rest-opacity": layer.style?.opacity,
    "--still-opacity": still.opacity,
    "--still-scale": still.scale,
    "--rest-clip": layer.style?.wipe === undefined ? undefined : wipeInset(layer.style.wipe),
    "--still-clip": still.wipe === undefined ? undefined : wipeInset(still.wipe),
  } as CSSProperties;
  return (
    <div
      className="scene-layer"
      data-layer={layer.id}
      data-level={layer.level}
      data-mobile={layer.mobile ? "" : undefined}
      data-phone-only={layer.desktop === false ? "" : undefined}
      style={{ insetBlock: layer.box.block, insetInline: layer.box.inline }}
    >
      <div className="scene-enter" data-enter={layer.enter ? "" : undefined}>
        <div className={cn("scene-light", layer.fx && `fx-${layer.fx}`)} data-keys={layer.keys?.length ? "" : undefined} style={light}>
          {variant === "animatic" ? (
            <span className="scene-box">
              <span>{layer.slot ?? layer.id}</span>
              <span>
                L{layer.level} · depth {layer.depth}
                {layer.mobile ? "" : " · desktop"}
              </span>
            </span>
          ) : layer.slot ? (
            <SceneImage
              slot={layer.slot}
              sizes={sizes}
              loading={loading}
              fit={layer.fit ?? (layer.box.block === "0" && layer.box.inline === "0" ? "cover" : "contain")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
