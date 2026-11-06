import { CLOCK, tickGeometry } from "@/lib/hero-math";

const TICKS = Array.from({ length: 60 }, (_, i) => tickGeometry(i));
const { centre: C } = CLOCK;

/**
 * The live clock behind the title (decorative). Server-rendered at rest: ring drawn,
 * ticks shown, hand at 12. The canvas loop (HeroScene) turns the hand to real time;
 * the intro (HeroController) draws the ring on and sweeps the hand in.
 */
export function HeroClock() {
  return (
    <svg className="hero-clock" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <circle className="hero-clock-ring2" cx={C} cy={C} r="252" />
      <g className="hero-clock-ticks">
        {TICKS.map((t, i) => (
          <line key={i} className={t.major ? "major" : undefined} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>
      <circle
        className="hero-clock-ring"
        cx={C}
        cy={C}
        r={CLOCK.ring}
        pathLength={1}
        transform={`rotate(-90 ${C} ${C})`}
      />
      <line className="hero-clock-hand" data-hero-hand="" x1={C} y1="332" x2={C} y2="30" />
      <circle className="hero-clock-hub" cx={C} cy={C} r="3.5" />
    </svg>
  );
}
