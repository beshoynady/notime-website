import "./ornaments.css";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The Gulf 8-fold tile (a khatam star from two squares, joined to its neighbours), repeated as a
 * background. Dark sections only, at a whisper (4% by default): a texture, never a picture.
 * Symmetric, so it needs no RTL mirroring. Fills its `position: relative` parent.
 */
export function GeometricPattern({ opacity = 0.04, className }: { opacity?: number; className?: string }) {
  return <span aria-hidden="true" data-ornament="geometric" className={cn("geo-pattern", className)} style={{ "--geo-opacity": opacity } as CSSProperties} />;
}
