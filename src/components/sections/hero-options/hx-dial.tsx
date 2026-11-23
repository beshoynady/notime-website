import { CLOCK, tickGeometry } from "@/lib/hero-math";

const TICKS = Array.from({ length: 60 }, (_, i) => tickGeometry(i));
const C = CLOCK.centre;
/** A watch dial's sunray finish: 180 fine radial lines between two rings (option C's texture). */
const RAYS = Array.from({ length: 180 }, (_, i) => {
  const a = (i / 180) * Math.PI * 2;
  const r = (n: number) => Math.round(n * 100) / 100;
  return { x1: r(C + Math.sin(a) * 70), y1: r(C - Math.cos(a) * 70), x2: r(C + Math.sin(a) * 238), y2: r(C - Math.cos(a) * 238) };
});

/**
 * A clock face (decorative): ring, 60 ticks, an hour and a second hand. `hands` sets their rest
 * angles in degrees (0 = 12 o'clock); the options turn them with CSS or GSAP.
 */
export function HxDial({ className, minute = 0, second = 0, sunray = false }: { className?: string; minute?: number; second?: number; sunray?: boolean }) {
  return (
    <svg className={`hx-dial ${className ?? ""}`} viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      {sunray && (
        <g className="hx-dial-rays">
          {RAYS.map((l, i) => (
            <line key={i} {...l} />
          ))}
          <circle cx={C} cy={C} r="70" />
          <circle cx={C} cy={C} r="160" />
        </g>
      )}
      <circle className="hx-dial-ring2" cx={C} cy={C} r="252" />
      <g className="hx-dial-ticks">
        {TICKS.map((t, i) => (
          <line key={i} className={t.major ? "major" : undefined} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>
      <circle className="hx-dial-ring" cx={C} cy={C} r={CLOCK.ring} />
      <g className="hx-dial-minute" style={{ transform: `rotate(${minute}deg)` }}>
        <line x1={C} y1={C + 24} x2={C} y2="120" />
      </g>
      <g className="hx-dial-second" style={{ transform: `rotate(${second}deg)` }}>
        <line x1={C} y1={C + 32} x2={C} y2="34" />
      </g>
      <circle className="hx-dial-hub" cx={C} cy={C} r="4" />
    </svg>
  );
}
