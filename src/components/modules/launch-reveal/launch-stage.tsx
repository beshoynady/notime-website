import type { LaunchFormatId } from "@/content/modules/launch-reveal";

const C = { esp: "#2E2017", cocoa: "#634731", taupe: "#BB9A79", champ: "#EAD4AB", ivory: "#F5E9D3" };

/**
 * The setting behind the plinth, one line drawing per format: a mall atrium (galleries on every
 * level), a seated venue (rows of chairs from behind), an exhibition hall (truss and stands).
 * Symmetric, so it needs no mirroring.
 */
export function LaunchSetting({ format }: { format: LaunchFormatId }) {
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke={C.taupe} strokeWidth="1" opacity=".38">
        {format === "mall" && (
          <>
            <path d="M0 70H640M0 140H640M0 210H640" />
            <path d="M0 76H640M0 146H640M0 216H640" opacity=".6" />
            {[40, 110, 180, 460, 530, 600].map((x) => (
              <path key={x} d={`M${x} 70V290`} />
            ))}
            <path d="M200 0V290M440 0V290" />
            <path d="M260 0C260 40 380 40 380 0" />
          </>
        )}
        {format === "venue" && (
          <>
            <path d="M0 40C200 70 440 70 640 40" />
            {[250, 278, 306, 334].map((y, i) => (
              <path key={y} d={Array.from({ length: 16 - i * 2 }, (_, k) => `M${20 + i * 40 + k * 40} ${y}h26v14`).join("")} />
            ))}
            <path d="M120 0V200M520 0V200" opacity=".5" />
          </>
        )}
        {format === "exhibition" && (
          <>
            <path d="M0 30H640M0 42H640" />
            <path d="M0 30L12 42L24 30L36 42L48 30L60 42L72 30L84 42L96 30L108 42L120 30L132 42L144 30L156 42L168 30L180 42L192 30L204 42L216 30L228 42L240 30L252 42L264 30L276 42L288 30L300 42L312 30L324 42L336 30L348 42L360 30L372 42L384 30L396 42L408 30L420 42L432 30L444 42L456 30L468 42L480 30L492 42L504 30L516 42L528 30L540 42L552 30L564 42L576 30L588 42L600 30L612 42L624 30L636 42" opacity=".6" />
            <path d="M30 140h110v150M30 140v150M500 140h110v150M500 140v150M60 170h50v40h-50z M530 170h50v40h-50z" />
          </>
        )}
        <path d="M0 290H640" opacity=".8" />
      </g>
    </svg>
  );
}

/** The plinth and the product: a faceted champagne form, no brand, no product named. */
export function LaunchPlinth() {
  return (
    <svg viewBox="0 0 200 260" aria-hidden="true">
      <defs>
        <linearGradient id="lr-face-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.ivory} />
          <stop offset="1" stopColor={C.champ} />
        </linearGradient>
        <linearGradient id="lr-face-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.taupe} />
          <stop offset="1" stopColor={C.cocoa} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="250" rx="86" ry="9" fill="#0D0805" opacity=".6" />
      {/* the plinth */}
      <path d="M40 160H160V246H40Z" fill={C.esp} />
      <ellipse cx="100" cy="160" rx="60" ry="10" fill={C.cocoa} />
      <path d="M40 160V246C40 252 160 252 160 246V160" fill="none" stroke={C.cocoa} />
      {/* the product: a tall faceted form */}
      <path d="M100 30L132 58L124 150H76L68 58Z" fill="url(#lr-face-a)" />
      <path d="M100 30L132 58L124 150H100Z" fill="url(#lr-face-b)" opacity=".75" />
      <path d="M68 58L100 74L132 58M100 74V150" fill="none" stroke={C.ivory} strokeWidth="1" opacity=".6" />
      <ellipse cx="100" cy="152" rx="26" ry="4" fill={C.champ} opacity=".5" />
    </svg>
  );
}
