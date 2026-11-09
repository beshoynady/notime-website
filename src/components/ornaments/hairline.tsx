import "./ornaments.css";
import { cn } from "@/lib/utils";

/**
 * A 1px rule in the current text colour at a quarter strength: the site's quiet divider.
 * `mark` adds the taupe diamond the marquee uses, at the reading start. Decorative only.
 */
export function Hairline({ mark = false, className }: { mark?: boolean; className?: string }) {
  return <span aria-hidden="true" data-ornament="hairline" className={cn("hairline", mark && "hairline-mark", className)} />;
}
