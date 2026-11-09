import "./ornaments.css";
import { cn } from "@/lib/utils";

const CORNERS = ["start-start", "start-end", "end-start", "end-end"] as const;

/**
 * Four L-shaped corner marks, like the crop marks on a print. Placed inside a `position: relative`
 * box; `out` sets them just outside it (the box must not clip them); logical insets, so they mirror in Arabic. Decorative only.
 */
export function FrameCorners({ tone = "champagne", inset = "sm", className }: { tone?: "champagne" | "espresso"; inset?: "sm" | "md" | "out"; className?: string }) {
  return (
    <span aria-hidden="true" data-ornament="frame-corners" className={cn("frame-corners", `fc-${tone}`, `fc-${inset}`, className)}>
      {CORNERS.map((c) => (
        <span key={c} className="fc-corner" data-corner={c} />
      ))}
    </span>
  );
}
