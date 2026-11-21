"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";

/** Pauses its marquee (`data-paused` on the closest `.marquee`; the CSS stops the track). */
export function MarqueeToggle({ pause, play }: { pause: string; play: string }) {
  const [paused, setPaused] = useState(false);
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !paused;
    e.currentTarget.closest(".marquee")?.toggleAttribute("data-paused", next);
    setPaused(next);
  };
  const Icon = paused ? Play : Pause;
  return (
    <button type="button" className="marquee-toggle" onClick={toggle} aria-label={paused ? play : pause}>
      <Icon aria-hidden="true" strokeWidth={1.25} className="size-4" />
    </button>
  );
}
