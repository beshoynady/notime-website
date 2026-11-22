import type { ReactNode } from "react";
import type { DrawingKey } from "@/content/service-visuals";

/**
 * Hairline compositions for the service sections without a module yet (D100). One 640 × 360
 * viewBox each, no text, drawn in `currentColor` (the theme's accent) with `.dim` lines in the
 * theme's rule colour and `.tint` fills at low opacity. Decorative: the section's H2 names it.
 */
const DRAWINGS: Record<DrawingKey, ReactNode> = {
  // Stand fabrication: an exhibition stand, its layers pulled apart as built.
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
  // Packaging: a box's dieline, cut lines solid and folds dashed.
  dieline: (
    <>
      <path d="M220 40 H420 V100 H520 V200 H420 V320 H220 V200 H120 V100 H220 Z" />
      <path d="M220 100 H420 M220 200 H420 M220 100 V200 M420 100 V200" className="dim" strokeDasharray="6 6" />
      <path d="M220 40 L236 20 H404 L420 40" />
      <path d="M520 112 L540 124 V176 L520 188" />
      <path d="M120 112 L100 124 V176 L120 188" />
      <rect x="250" y="122" width="140" height="56" className="tint" />
      <path d="M80 240 h40 M100 220 v40 M520 300 h40 M540 280 v40" className="dim" />
      <circle cx="100" cy="240" r="8" className="dim" />
      <circle cx="540" cy="300" r="8" className="dim" />
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
  // Merchandise: a tote, a tee and a mug, each with its logo zone marked.
  merch: (
    <>
      <path d="M64 120 H204 L214 310 H54 Z" />
      <path d="M100 120 C100 70 168 70 168 120" />
      <rect x="104" y="190" width="60" height="44" className="tint" strokeDasharray="4 4" />
      <path d="M250 96 L302 70 C316 92 364 92 378 70 L430 96 L410 150 L384 140 V316 H296 V140 L270 150 Z" />
      <rect x="318" y="140" width="44" height="36" className="tint" strokeDasharray="4 4" />
      <path d="M470 150 H570 V300 C570 316 470 316 470 300 Z" />
      <path d="M570 180 C610 180 610 260 570 260" />
      <rect x="496" y="196" width="48" height="40" className="tint" strokeDasharray="4 4" />
      <line x1="40" y1="330" x2="600" y2="330" className="dim" />
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
