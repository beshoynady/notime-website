/**
 * Isometric projection for the stand drawing (pure, tested). World units are metres: x runs along
 * the back wall, y toward the aisle, z up. The screen point is
 *   sx = (x − y) · cos 30° · scale,  sy = (x + y) · sin 30° · scale − z · scale,
 * shifted by an origin. Faces are listed as polygons in the order they paint (back to front).
 */
export type P3 = [x: number, y: number, z: number];

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

export function iso([x, y, z]: P3, scale: number, origin: [number, number] = [0, 0]): [number, number] {
  return [origin[0] + (x - y) * COS * scale, origin[1] + (x + y) * SIN * scale - z * scale];
}

/** An SVG `points` string for a face, rounded to 0.1 px. */
export function face(pts: P3[], scale: number, origin: [number, number]): string {
  return pts
    .map((p) => iso(p, scale, origin).map((v) => Math.round(v * 10) / 10).join(","))
    .join(" ");
}

/** The three visible faces of an axis-aligned box (top, front along x, side along y) at its far corner `at`. */
export function boxFaces(at: P3, size: P3, scale: number, origin: [number, number]) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  return {
    top: face([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], scale, origin),
    front: face([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], scale, origin),
    side: face([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], scale, origin),
  };
}
