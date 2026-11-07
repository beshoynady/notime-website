/**
 * WCAG 2.x contrast ratio between two hex colours (#rgb or #rrggbb), 1–21.
 * Used at build time by the styleguide's contrast badges, so the page shows computed values
 * rather than hand-typed ones (the reference prototype showed 13.6 for espresso/ivory; it is ~13.1).
 */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Level for normal-size text: AAA ≥ 7, AA ≥ 4.5. */
export function wcagLevel(ratio: number): "AAA" | "AA" | "fail" {
  return ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "fail";
}

function luminance(hex: string): number {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Not a hex colour: ${hex}`);
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
