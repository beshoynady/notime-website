import type { CSSProperties, ReactNode } from "react";
import type { SceneConfig, SceneLayer } from "@/content/scenes";
import { stillState } from "@/lib/scene-math";
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
 * `variant="animatic"` draws each layer as a labelled flat box (the grey-box animatic, Task 2.9).
 */
export function LayeredScene({
  scene,
  lines,
  variant,
  label,
  overlayClassName,
  children,
}: {
  scene: SceneConfig;
  /** The shots' lines, already translated, in shot order; "" for a shot without one. */
  lines: string[];
  variant: "live" | "animatic";
  /** Names the scene as a region; leave it out when the scene sits inside a named section. */
  label?: string;
  /** Sets the overlay's inline box (e.g. `frame`); the overlay itself has no inline padding. */
  overlayClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className="scene" data-scene={scene.id} data-variant={variant} data-shot-active="0" role={label ? "region" : undefined} aria-label={label}>
      <div className="scene-layers" aria-hidden="true">
        {scene.layers.map((layer) => (
          <Layer key={layer.id} layer={layer} variant={variant} />
        ))}
      </div>
      <div className={cn("scene-overlay", overlayClassName)}>
        {children}
        {lines.some(Boolean) && (
          <div className="scene-copy">
            {scene.shots.map((shot, i) =>
              lines[i] ? (
                <p key={shot.id} className="scene-line" data-shot={i} data-desktop={shot.desktop ? "" : undefined} data-mobile={shot.mobile ? "" : undefined}>
                  {lines[i]}
                </p>
              ) : null,
            )}
          </div>
        )}
      </div>
      <SceneDirector scene={scene} />
    </div>
  );
}

function Layer({ layer, variant }: { layer: SceneLayer; variant: "live" | "animatic" }) {
  const still = stillState(layer);
  const light = {
    "--rest-opacity": layer.style?.opacity,
    "--still-opacity": still.opacity,
    "--still-scale": still.scale,
  } as CSSProperties;
  return (
    <div
      className="scene-layer"
      data-layer={layer.id}
      data-level={layer.level}
      data-mobile={layer.mobile ? "" : undefined}
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
            <SceneImage slot={layer.slot} sizes={layer.level === 0 ? "100vw" : "50vw"} eager={layer.eager} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
