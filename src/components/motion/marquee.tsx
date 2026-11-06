import { cn } from "@/lib/utils";

/**
 * Endless marquee (CSS, not GSAP/Motion: it is neither scroll- nor pointer-driven).
 * The list is rendered twice for a seamless loop; the copy is hidden from assistive tech.
 * Direction reverses in RTL, hover pauses it, reduced motion holds it still.
 */
export function Marquee({ items, label, durationSec = 50, className }: { items: string[]; label: string; durationSec?: number; className?: string }) {
  return (
    <div className={cn("marquee", className)} role="region" aria-label={label}>
      <div className="marquee-track" style={{ animationDuration: `${durationSec}s` }}>
        <ul className="marquee-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul className="marquee-list" aria-hidden="true">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
