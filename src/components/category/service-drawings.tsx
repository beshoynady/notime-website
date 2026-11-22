import type { ReactNode } from "react";
import type { DrawingKey } from "@/content/service-visuals";

/**
 * Hairline compositions for the service sections without a module yet (D100). One 640 × 360
 * viewBox each, no text, drawn in `currentColor` (the theme's accent) with `.dim` lines in the
 * theme's rule colour and `.tint` fills at low opacity. Decorative: the section's H2 names it.
 */
const DRAWINGS: Record<DrawingKey, ReactNode> = {
  // An exhibition stand, its layers pulled apart as built (Work, until Task C3 gives it a photo).
  stand: (
    <>
      <path d="M120 270 L320 330 L540 260 L340 206 Z" />
      <path d="M120 250 L320 310 L540 240 L340 186 Z" className="dim" />
      <path d="M140 230 V84 L340 34 V180" />
      <path d="M340 34 L520 86 V226" />
      <path d="M160 214 V104 L320 64 V170 Z" className="tint" />
      <path d="M200 66 L340 30 L480 70" className="dim" />
      <path d="M280 244 L380 272 L440 254 L340 228 Z M280 244 V204 L340 188 L440 214 V254" />
      <path d="M340 188 V228" className="dim" />
      <line x1="420" y1="120" x2="420" y2="200" className="dim" />
      <line x1="460" y1="132" x2="460" y2="212" className="dim" />
    </>
  ),
  // An award night (Work, D106): a stage under a lighting truss, three beams down onto the podium,
  // the audience's rows in front.
  stage: (
    <>
      <line x1="80" y1="44" x2="560" y2="44" />
      <line x1="80" y1="56" x2="560" y2="56" className="dim" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`k${i}`} x1={80 + i * 40} y1="44" x2={100 + i * 40} y2="56" className="dim" />
      ))}
      {[200, 320, 440].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="58" width="18" height="14" rx="2" />
          <path d={`M${x - 6} 72 L${x - 70} 250 H${x + 70} L${x + 6} 72 Z`} className="tint" stroke="none" />
        </g>
      ))}
      <path d="M120 250 H520 L560 280 H80 Z" />
      <path d="M80 280 V292 H560 V280" className="dim" />
      <path d="M290 250 V214 H350 V250" />
      <path d="M306 214 V198 H334 V214" className="dim" />
      <path d="M320 198 V176 M310 186 Q320 168 330 186" />
      {[312, 326, 340].map((y, r) => (
        <path key={y} d={`M${100 + r * 20} ${y} Q320 ${y + 14} ${540 - r * 20} ${y}`} className="dim" strokeDasharray="2 10" />
      ))}
    </>
  ),
};

export function ServiceDrawing({ drawing, className = "svc-drawing" }: { drawing: DrawingKey; className?: string }) {
  return (
    <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false" className={className}>
      {DRAWINGS[drawing]}
    </svg>
  );
}
