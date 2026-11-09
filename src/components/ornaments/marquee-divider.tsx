import "./ornaments.css";
import { cn } from "@/lib/utils";

/**
 * A slim moving band between two sections: small caps words with the taupe diamond between them.
 * Decorative (the words repeat content already on the page), so it is hidden from assistive tech.
 * The `.marquee-track` animation reverses in Arabic and holds still under reduced motion.
 */
export function MarqueeDivider({ items, durationSec = 60, className }: { items: string[]; durationSec?: number; className?: string }) {
  const list = (hidden: boolean) => (
    <ul className="marquee-list" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  return (
    <div aria-hidden="true" data-ornament="marquee-divider" className={cn("marquee marquee-divider", className)}>
      <div className="marquee-track" style={{ animationDuration: `${durationSec}s` }}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
