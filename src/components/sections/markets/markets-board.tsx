"use client";

import { useEffect, useState } from "react";
import { marketTime } from "@/lib/market-time";

interface Row {
  key: string;
  timeZone: string;
  base: boolean;
  name: string;
  offset: string;
}

/** The current time, refreshed at each new minute; `null` until mounted (no hydration mismatch). */
function useMinute(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);
  return now;
}

/**
 * The board: one row per market. The dial's hands are set (not animated) at each minute, so
 * reduced motion needs nothing extra. Clocks turn clockwise in both languages: a clock face isn't
 * a reading-direction element, so it doesn't mirror.
 */
export function MarketsBoard({ rows, labels }: { rows: Row[]; labels: { base: string; localTime: string } }) {
  const now = useMinute();
  return (
    <div className="markets-board">
      <p className="markets-caption text-eyebrow" aria-hidden="true">
        {labels.localTime}
      </p>
      <ul className="markets-list">
        {rows.map((r) => {
          const live = now ? marketTime(now, r.timeZone) : null;
          const [h, m] = live ? live.time.split(":").map(Number) : [0, 0];
          return (
            <li key={r.key} className="market" data-base={r.base ? "" : undefined}>
              <Dial hours={h} minutes={m} visible={!!live} />
              <span className="market-name">
                {r.name}
                {r.base && <span className="market-base text-eyebrow">{labels.base}</span>}
              </span>
              <span className="market-time tabular">
                {live && <time>{live.time}</time>}
              </span>
              <span className="market-offset tabular" dir="ltr">
                {live?.offset ?? r.offset}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Dial({ hours, minutes, visible }: { hours: number; minutes: number; visible: boolean }) {
  const hourDeg = ((hours % 12) + minutes / 60) * 30;
  const minuteDeg = minutes * 6;
  return (
    <svg className="market-dial" viewBox="0 0 40 40" aria-hidden="true" data-visible={visible ? "" : undefined}>
      <circle cx="20" cy="20" r="18.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="20" y1="3.5" x2="20" y2={i % 3 === 0 ? 7 : 5.5} transform={`rotate(${i * 30} 20 20)`} />
      ))}
      <g className="market-hands">
        <line className="market-hour" x1="20" y1="20" x2="20" y2="11" transform={`rotate(${hourDeg} 20 20)`} />
        <line className="market-minute" x1="20" y1="20" x2="20" y2="6.5" transform={`rotate(${minuteDeg} 20 20)`} />
        <circle cx="20" cy="20" r="1.4" />
      </g>
    </svg>
  );
}
