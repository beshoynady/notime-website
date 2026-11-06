"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createSceneState } from "./scene-state";

// Client-only: the canvas has nothing to server-render (the CSS gradient on .hero is the
// same picture), and keeping it out of the server bundle keeps the hero's HTML light.
const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), { ssr: false });

/**
 * Client half of the hero. Owns the SceneState shared by reference with the canvas,
 * the clock hand and (Task 11) the GSAP intro/scroll timelines.
 */
export function HeroController() {
  const [state] = useState(createSceneState);

  // Pointer parallax: mouse only; touch and pen leave the scene centred.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.pointer.x = (e.clientX / innerWidth) * 2 - 1;
      state.pointer.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, [state]);

  return <HeroScene state={state} />;
}
