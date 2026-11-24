import { CLOCK, tickGeometry } from "@/lib/hero-math";

const TICKS = Array.from({ length: 60 }, (_, i) => tickGeometry(i));
const C = CLOCK.centre;
const r2 = (n: number) => Math.round(n * 100) / 100;
/** A watch dial's sunray finish: 180 fine radial lines between two rings (D173, after option C). */
const RAYS = Array.from({ length: 180 }, (_, i) => {
  const a = (i / 180) * Math.PI * 2;
  return { x1: r2(C + Math.sin(a) * 70), y1: r2(C - Math.cos(a) * 70), x2: r2(C + Math.sin(a) * 238), y2: r2(C - Math.cos(a) * 238) };
});

/**
 * The dial behind the hero (decorative, D173): the gold sunray engraving, a dotted outer ring, 60
 * ticks, the ring, and the second hand. Server-rendered at its end state: the hand on 12 (zero).
 * HeroController turns the hand back five seconds and counts it down.
 */
export function HeroDial() {
  return (
    <svg className="hero-dial" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <g className="hero-dial-rays">
        {RAYS.map((l, i) => (
          <line key={i} {...l} />
        ))}
        <circle cx={C} cy={C} r="70" />
        <circle cx={C} cy={C} r="160" />
      </g>
      <circle className="hero-dial-ring2" cx={C} cy={C} r="252" />
      <g className="hero-dial-ticks">
        {TICKS.map((t, i) => (
          <line key={i} className={t.major ? "major" : undefined} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>
      <circle className="hero-dial-ring" cx={C} cy={C} r={CLOCK.ring} />
      <g className="hero-dial-hand">
        <line x1={C} y1={C + 32} x2={C} y2="34" />
      </g>
      <circle className="hero-dial-hub" cx={C} cy={C} r="4" />
    </svg>
  );
}
