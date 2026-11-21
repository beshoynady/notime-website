import { cn } from "@/lib/utils";
import { MarqueeToggle } from "./marquee-toggle";

/**
 * Endless marquee (CSS, not GSAP/Motion: it is neither scroll- nor pointer-driven).
 * The list is rendered twice for a seamless loop; the copy is hidden from assistive tech.
 * Direction reverses in RTL; hover and focus pause it, and with `controls` a button pauses it
 * (WCAG 2.2.2: it moves for longer than 5 s beside other content); reduced motion holds it still.
 */
export function Marquee({
  items,
  label,
  durationSec = 50,
  className,
  controls,
}: {
  items: string[];
  label: string;
  durationSec?: number;
  className?: string;
  controls?: { pause: string; play: string };
}) {
  return (
    <div className={cn("marquee", className)} role="region" aria-label={label}>
      {controls && <MarqueeToggle {...controls} />}
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
