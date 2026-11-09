import "./ornaments.css";
import { cn } from "@/lib/utils";

export type LeakPosition = "start-top" | "end-top" | "start-bottom" | "end-bottom";

/**
 * A soft warm bloom at one corner, like stage light spilling past a flat. Static (no motion),
 * logical insets so it mirrors in Arabic. Fills its `position: relative, overflow: hidden` parent.
 */
export function LightLeak({ position = "start-top", className }: { position?: LeakPosition; className?: string }) {
  return <span aria-hidden="true" data-ornament="light-leak" data-position={position} className={cn("light-leak", className)} />;
}
