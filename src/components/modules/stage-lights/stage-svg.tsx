import type { ReactNode } from "react";
import type { LightGroupId } from "@/content/modules/stage-lights";

const C = { night: "#0D0805", esp: "#2E2017", cocoa: "#634731", taupe: "#BB9A79", champ: "#EAD4AB", ivory: "#F5E9D3" };

/** Fixtures on the truss, x positions (the spots hang from the two in the middle). */
const FIXTURES = [110, 190, 270, 370, 450, 530];

/**
 * The stage, drawn (an example rig, no photo): truss, screen frame, platform and lectern are
 * always there; the four light groups are layers whose wrapper the caller provides, so the server
 * renders plain groups and the client renders Motion groups (Motion owns their opacity).
 * Symmetric on purpose: it needs no mirroring in Arabic.
 */
export function StageSvg({ group, title }: { group: (id: LightGroupId, children: ReactNode) => ReactNode; title?: string }) {
  return (
    <svg className="st-svg" viewBox="0 0 640 360" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <radialGradient id="st-wash" cx=".5" cy=".78" r=".62">
          <stop offset="0" stopColor={C.champ} stopOpacity=".42" />
          <stop offset="1" stopColor={C.champ} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="st-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.ivory} stopOpacity=".55" />
          <stop offset="1" stopColor={C.ivory} stopOpacity=".06" />
        </linearGradient>
        <linearGradient id="st-back" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={C.champ} stopOpacity=".5" />
          <stop offset="1" stopColor={C.champ} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="st-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.cocoa} />
          <stop offset=".55" stopColor={C.taupe} />
          <stop offset="1" stopColor={C.champ} />
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill={C.night} />
      {/* back light: beams rising behind the screen */}
      {group(
        "back",
        <g fill="url(#st-back)">
          <polygon points="150,250 110,20 180,20" />
          <polygon points="250,250 225,20 285,20" />
          <polygon points="390,250 355,20 415,20" />
          <polygon points="490,250 460,20 530,20" />
        </g>,
      )}
      {/* the truss */}
      <g stroke={C.cocoa} strokeWidth="1.5" fill="none">
        <path d="M40 22H600M40 36H600" />
        <path d="M40 22L54 36L68 22L82 36L96 22L110 36L124 22L138 36L152 22L166 36L180 22L194 36L208 22L222 36L236 22L250 36L264 22L278 36L292 22L306 36L320 22L334 36L348 22L362 36L376 22L390 36L404 22L418 36L432 22L446 36L460 22L474 36L488 22L502 36L516 22L530 36L544 22L558 36L572 22L586 36L600 22" opacity=".7" />
      </g>
      <g fill={C.cocoa}>
        {FIXTURES.map((x) => (
          <rect key={x} x={x - 7} y="36" width="14" height="12" rx="2" />
        ))}
      </g>
      {/* the screen: a dark frame, lit when its group is on */}
      <rect x="200" y="70" width="240" height="132" fill={C.esp} stroke={C.cocoa} />
      {group(
        "screen",
        <g>
          <rect x="203" y="73" width="234" height="126" fill="url(#st-screen)" />
          <path d="M203 199L280 73M243 199L320 73M283 199L360 73M323 199L400 73M363 199L437 77" stroke={C.ivory} strokeWidth="1" opacity=".35" />
          <circle cx="320" cy="136" r="22" fill="none" stroke={C.ivory} strokeWidth="1.5" opacity=".7" />
          <ellipse cx="320" cy="136" rx="170" ry="96" fill={C.champ} opacity=".08" />
        </g>,
      )}
      {/* the platform and the lectern */}
      <polygon points="60,252 580,252 620,302 20,302" fill={C.esp} />
      <path d="M20 302H620" stroke={C.cocoa} strokeWidth="2" />
      <path d="M60 252H580" stroke={C.taupe} strokeWidth="1" opacity=".4" />
      <polygon points="262,212 302,212 298,252 266,252" fill={C.cocoa} />
      <rect x="258" y="206" width="48" height="8" rx="1" fill={C.taupe} opacity=".8" />
      {/* the wash: a warm fill across the stage */}
      {group(
        "wash",
        <g>
          <ellipse cx="320" cy="262" rx="330" ry="120" fill="url(#st-wash)" />
          <rect x="60" y="252" width="520" height="50" fill={C.champ} opacity=".1" />
        </g>,
      )}
      {/* spots: two cones on the lectern */}
      {group(
        "spots",
        <g>
          <polygon points="263,48 277,48 312,262 238,262" fill="url(#st-cone)" />
          <polygon points="363,48 377,48 330,262 272,262" fill="url(#st-cone)" opacity=".6" />
          <ellipse cx="282" cy="262" rx="58" ry="9" fill={C.ivory} opacity=".35" />
        </g>,
      )}
      {/* the fixtures' lenses glow while any light is on, drawn by the group itself */}
      <g fill={C.taupe} opacity=".5">
        {FIXTURES.map((x) => (
          <circle key={x} cx={x} cy="48" r="3" />
        ))}
      </g>
    </svg>
  );
}
