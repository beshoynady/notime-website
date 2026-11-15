import type { StandPartId } from "@/content/modules/stand-assembly";
import { boxFaces, face, iso, type P3 } from "./iso";

const C = { night: "#0D0805", esp: "#2E2017", cocoa: "#634731", taupe: "#BB9A79", champ: "#EAD4AB", ivory: "#F5E9D3" };
const S = 46;
const O: [number, number] = [190, 150];
const pt = (p: P3) => iso(p, S, O).map((v) => Math.round(v * 10) / 10) as [number, number];
const f = (pts: P3[]) => face(pts, S, O);

// A 6 m × 4 m corner stand (x along the back wall, y toward the aisle, z up), metres.
const floor = boxFaces([0, 0, 0], [6, 4, 0.15], S, O);
const back = boxFaces([0, 0, 0.15], [6, 0.12, 2.45], S, O);
const side = boxFaces([0, 0.12, 0.15], [0.12, 3.88, 2.45], S, O);
const counter = boxFaces([3.6, 2.5, 0.15], [1.8, 0.7, 1.05], S, O);
const beam = boxFaces([0, 0.12, 2.6], [6, 0.5, 0.22], S, O);

/** Where each step's number sits on the drawing. */
const MARKS: Record<StandPartId, P3> = {
  floor: [5.6, 3.7, 0.15],
  walls: [5.6, 0.12, 0.9],
  counter: [4.5, 3.2, 1.0],
  lighting: [3.2, 0.62, 2.7],
  graphics: [1.4, 0.12, 1.55],
  screen: [0.12, 2.2, 1.65],
};

/**
 * The stand as an isometric drawing, one `<g data-part>` per build step (GSAP moves whole groups,
 * never paths; well under 150 paths). Generic: no logo, no brand, graphics as abstract panels.
 * The drawing mirrors in Arabic (CSS), its step numbers counter-flipped so they read.
 */
export function StandSvg({ order }: { order: StandPartId[] }) {
  const n = (id: StandPartId) => order.indexOf(id) + 1;
  const mark = (id: StandPartId) => {
    const [x, y] = pt(MARKS[id]);
    return (
      <g className="sa-num" transform={`translate(${x} ${y})`}>
        <circle r="10" fill={C.night} stroke={C.champ} strokeWidth="1" />
        <text className="sa-num-text" y="3.5" textAnchor="middle" fontSize="10" fontWeight="500" fill={C.champ} fontFamily="var(--font-en)">
          {n(id)}
        </text>
      </g>
    );
  };
  const cone = (x: number) => {
    const [ax, ay] = pt([x, 0.5, 2.6]);
    const [bx, by] = pt([x - 0.45, 1.9, 0.15]);
    const [cx, cy] = pt([x + 0.45, 1.9, 0.15]);
    return <polygon key={x} points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="url(#sa-cone)" />;
  };
  return (
    <svg className="sa-svg" viewBox="0 0 440 400" aria-hidden="true">
      <defs>
        <linearGradient id="sa-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.champ} stopOpacity=".55" />
          <stop offset="1" stopColor={C.champ} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sa-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.cocoa} />
          <stop offset="1" stopColor={C.champ} />
        </linearGradient>
      </defs>
      <g data-part="floor">
        <polygon points={floor.top} fill={C.taupe} opacity=".55" />
        <polygon points={floor.front} fill={C.cocoa} />
        <polygon points={floor.side} fill={C.esp} />
        <path d={`M${pt([0, 2, 0.15]).join(" ")}L${pt([6, 2, 0.15]).join(" ")}M${pt([3, 0, 0.15]).join(" ")}L${pt([3, 4, 0.15]).join(" ")}`} stroke={C.champ} strokeWidth=".6" opacity=".35" />
        {mark("floor")}
      </g>
      <g data-part="walls">
        <polygon points={side.side} fill={C.champ} opacity=".88" />
        <polygon points={side.front} fill={C.taupe} />
        <polygon points={side.top} fill={C.ivory} />
        <polygon points={back.front} fill={C.ivory} opacity=".92" />
        <polygon points={back.top} fill={C.ivory} />
        <polygon points={back.side} fill={C.taupe} />
        {mark("walls")}
      </g>
      <g data-part="graphics">
        <polygon points={f([[0.5, 0.12, 0.7], [2.6, 0.12, 0.7], [2.6, 0.12, 2.3], [0.5, 0.12, 2.3]])} fill={C.taupe} />
        <polygon points={f([[0.5, 0.12, 0.7], [1.5, 0.12, 0.7], [2.6, 0.12, 1.8], [2.6, 0.12, 2.3], [2.1, 0.12, 2.3], [0.5, 0.12, 0.9]])} fill={C.cocoa} />
        <polygon points={f([[3.0, 0.12, 1.5], [5.6, 0.12, 1.5], [5.6, 0.12, 2.3], [3.0, 0.12, 2.3]])} fill={C.cocoa} />
        <path d={`M${pt([3.2, 0.12, 1.9]).join(" ")}L${pt([5.4, 0.12, 1.9]).join(" ")}`} stroke={C.champ} strokeWidth="2" />
        {mark("graphics")}
      </g>
      <g data-part="screen">
        <polygon points={f([[0.12, 1.1, 1.05], [0.12, 3.3, 1.05], [0.12, 3.3, 2.25], [0.12, 1.1, 2.25]])} fill={C.night} />
        <polygon points={f([[0.12, 1.2, 1.12], [0.12, 3.2, 1.12], [0.12, 3.2, 2.18], [0.12, 1.2, 2.18]])} fill="url(#sa-screen)" opacity=".85" />
        {mark("screen")}
      </g>
      <g data-part="counter">
        <polygon points={counter.front} fill={C.taupe} />
        <polygon points={counter.side} fill={C.cocoa} />
        <polygon points={counter.top} fill={C.ivory} />
        <path d={`M${pt([3.6, 3.2, 0.7]).join(" ")}L${pt([5.4, 3.2, 0.7]).join(" ")}`} stroke={C.champ} strokeWidth="1.5" />
        {mark("counter")}
      </g>
      <g data-part="lighting">
        {[1.5, 3.2, 4.5].map(cone)}
        <polygon points={beam.front} fill={C.esp} />
        <polygon points={beam.top} fill={C.cocoa} />
        <polygon points={beam.side} fill={C.night} />
        {[1.5, 3.2, 4.5].map((x) => {
          const [cx, cy] = pt([x, 0.5, 2.6]);
          return <circle key={x} cx={cx} cy={cy} r="2.5" fill={C.ivory} />;
        })}
        {mark("lighting")}
      </g>
    </svg>
  );
}
