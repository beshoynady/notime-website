import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Laptop and phone frames drawn in CSS (category-pages.md §5.5): espresso bezels, a hairline
 * highlight and a soft floor shadow. The screen keeps the content's aspect (16:9, 9:16), so a
 * real screenshot or an HTML redraw fits with no crop.
 */
export function Laptop({ children, className, screenClassName }: { children: ReactNode; className?: string; screenClassName?: string }) {
  return (
    <div className={cn("sw-laptop", className)}>
      <div className="sw-laptop-lid">
        <span className="sw-laptop-cam" aria-hidden="true" />
        <div className={cn("sw-laptop-screen", screenClassName)}>{children}</div>
      </div>
      <div className="sw-laptop-base" aria-hidden="true" />
    </div>
  );
}

export function Phone({ children, className, screenClassName }: { children: ReactNode; className?: string; screenClassName?: string }) {
  return (
    <div className={cn("sw-phone", className)}>
      <span className="sw-phone-notch" aria-hidden="true" />
      <div className={cn("sw-phone-screen", screenClassName)}>{children}</div>
    </div>
  );
}

/** The "Preview" / "Example" tags on concept screens and example data (category-pages.md §1). */
export function Tag({ children, tone = "line" }: { children: ReactNode; tone?: "line" | "fill" }) {
  return <span className={cn("sw-tag", tone === "fill" && "sw-tag-fill")}>{children}</span>;
}

/** The theme's signature: a visible state label that switches as the visitor acts (§5.5). */
export function StateLabel({ rest, active }: { rest: string; active: string }) {
  return (
    <span className="sw-state" aria-hidden="true">
      <span className="sw-state-dot" />
      <span className="sw-state-rest">{rest}</span>
      <span className="sw-state-active">{active}</span>
    </span>
  );
}
