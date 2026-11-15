import type { ReactNode } from "react";
import type { DrawingKey } from "@/content/service-visuals";

/**
 * Hairline compositions for the service sections without a module yet (D100). One 640 × 360
 * viewBox each, no text, drawn in `currentColor` (the theme's accent) with `.dim` lines in the
 * theme's rule colour and `.tint` fills at low opacity. Decorative: the section's H2 names it.
 */
const DRAWINGS: Record<DrawingKey, ReactNode> = {
  // Video: a film strip over an edit timeline, with the playhead.
  timeline: (
    <>
      <rect x="60" y="48" width="520" height="96" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={76 + i * 100} y="66" width="88" height="60" className={i === 2 ? "tint" : undefined} />
      ))}
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={`p${i}`} x={66 + i * 20} y="54" width="8" height="5" className="dim" />
      ))}
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={`q${i}`} x={66 + i * 20} y="133" width="8" height="5" className="dim" />
      ))}
      <line x1="60" y1="190" x2="580" y2="190" className="dim" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <line key={`t${i}`} x1={60 + i * 52} y1="184" x2={60 + i * 52} y2="196" className="dim" />
      ))}
      <rect x="60" y="210" width="190" height="26" />
      <rect x="258" y="210" width="140" height="26" className="tint" />
      <rect x="406" y="210" width="174" height="26" />
      <rect x="60" y="244" width="300" height="26" className="dim" />
      <rect x="368" y="244" width="212" height="26" className="dim" />
      <path d="M60 300 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" className="dim" />
      <line x1="330" y1="176" x2="330" y2="320" />
      <path d="M322 170 h16 l-8 10 z" className="tint" />
    </>
  ),
  // AI content: a prompt line above a contact sheet of variations, one chosen.
  frames: (
    <>
      <rect x="120" y="36" width="400" height="34" rx="17" />
      <line x1="146" y1="53" x2="330" y2="53" className="dim" />
      <line x1="338" y1="44" x2="338" y2="62" />
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect key={`${c}${r}`} x={120 + c * 136} y={96 + r * 118} width="128" height="106" className={c === 1 && r === 0 ? "tint" : "dim"} />
        )),
      )}
      <path d="M248 88 h-12 v12 M384 88 h12 v12 M248 210 h-12 v-12 M384 210 h12 v-12" />
      <circle cx="320" cy="140" r="22" />
      <path d="M270 194 l30 -28 l22 18 l26 -32 l30 42" />
    </>
  ),
  // Branding: a mark built on its construction grid.
  mark: (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line key={`v${i}`} x1={200 + i * 30} y1="40" x2={200 + i * 30} y2="320" className="dim" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <line key={`h${i}`} x1="170" y1={45 + i * 30} x2="470" y2={45 + i * 30} className="dim" />
      ))}
      <circle cx="320" cy="180" r="120" className="dim" />
      <circle cx="320" cy="180" r="74" />
      <line x1="200" y1="60" x2="440" y2="300" className="dim" />
      <line x1="440" y1="60" x2="200" y2="300" className="dim" />
      {/* An abstract mark (no letter, so it reads the same mirrored): a square over a circle. */}
      <circle cx="290" cy="210" r="44" className="tint" />
      <rect x="290" y="136" width="74" height="74" strokeWidth="3" />
      <circle cx="290" cy="210" r="4" />
      <circle cx="364" cy="136" r="4" />
      <path d="M110 330 h60 M470 330 h60 M110 30 h60 M470 30 h60" className="dim" />
    </>
  ),
  // Social: a phone's feed grid beside the month's posting calendar.
  feed: (
    <>
      <rect x="140" y="24" width="168" height="312" rx="22" />
      <line x1="200" y1="40" x2="248" y2="40" className="dim" />
      <circle cx="170" cy="72" r="12" className="dim" />
      <line x1="192" y1="68" x2="260" y2="68" className="dim" />
      {[0, 1, 2].map((c) =>
        [0, 1, 2, 3].map((r) => (
          <rect key={`${c}${r}`} x={156 + c * 47} y={100 + r * 52} width="43" height="48" className={(c + r) % 3 === 0 ? "tint" : "dim"} />
        )),
      )}
      {[0, 1, 2, 3, 4, 5, 6].map((c) =>
        [0, 1, 2, 3, 4].map((r) => (
          <rect key={`k${c}${r}`} x={350 + c * 34} y={92 + r * 40} width="28" height="32" className="dim" />
        )),
      )}
      {[
        [0, 0], [2, 0], [4, 1], [1, 2], [3, 2], [5, 3], [0, 4], [2, 4], [6, 1],
      ].map(([c, r]) => (
        <circle key={`d${c}${r}`} cx={364 + c * 34} cy={108 + r * 40} r="5" className="tint" />
      ))}
      <line x1="350" y1="70" x2="584" y2="70" />
    </>
  ),
  // Search: a results page beside a speed gauge.
  search: (
    <>
      <rect x="40" y="44" width="330" height="36" rx="18" />
      <circle cx="68" cy="62" r="8" />
      <line x1="74" y1="68" x2="82" y2="76" />
      <rect x="40" y="108" width="330" height="70" className="tint" />
      <line x1="56" y1="128" x2="250" y2="128" />
      <line x1="56" y1="146" x2="340" y2="146" className="dim" />
      <line x1="56" y1="160" x2="300" y2="160" className="dim" />
      {[0, 1].map((i) => (
        <g key={i}>
          <line x1="56" y1={210 + i * 62} x2="230" y2={210 + i * 62} className="dim" />
          <line x1="56" y1={228 + i * 62} x2="340" y2={228 + i * 62} className="dim" />
          <line x1="56" y1={242 + i * 62} x2="280" y2={242 + i * 62} className="dim" />
        </g>
      ))}
      <path d="M430 230 A90 90 0 0 1 610 230" className="dim" />
      <path d="M430 230 A90 90 0 0 1 586 170" strokeWidth="3" />
      <line x1="520" y1="230" x2="578" y2="176" />
      <circle cx="520" cy="230" r="6" className="tint" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`b${i}`} x={440 + i * 34} y={300 - [20, 34, 28, 44, 52][i]} width="22" height={[20, 34, 28, 44, 52][i]} className={i === 4 ? "tint" : "dim"} />
      ))}
    </>
  ),
  // Paid media: the funnel beside the campaign's flighting.
  funnel: (
    <>
      <path d="M60 50 H300 L272 112 H88 Z" />
      <path d="M92 120 H268 L244 182 H116 Z" className="tint" />
      <path d="M120 190 H240 L220 252 H140 Z" />
      <path d="M144 260 H216 L204 312 H156 Z" className="tint" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={350 + i * 32} y1="50" x2={350 + i * 32} y2="312" className="dim" />
      ))}
      <rect x="350" y="70" width="160" height="22" className="tint" />
      <rect x="382" y="118" width="192" height="22" />
      <rect x="414" y="166" width="96" height="22" className="tint" />
      <rect x="446" y="214" width="128" height="22" />
      <path d="M350 300 L398 286 L446 290 L494 262 L542 250 L590 226" />
    </>
  ),
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

export function ServiceDrawing({ drawing }: { drawing: DrawingKey }) {
  return (
    <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false" className="svc-drawing">
      {DRAWINGS[drawing]}
    </svg>
  );
}
