import type { CategorySlug } from "../content/types";

/**
 * Colour grades for scene layers (D64; layers.md "Colour unity"): one per category scene, baked
 * into every layer's file at export by scripts/grade.mjs, so real and AI layers match with no
 * runtime filter. Plain, erasable TypeScript: Node runs this file directly from the script.
 *
 * `matrix` is sharp's `recomb` (rows give output R, G, B from input R, G, B); `modulate` follows.
 * TODO: replace placeholder — starting values; tuned on the graded/ungraded contact sheet
 * (stop point 3) before any layer ships.
 */
export type Grade = "evening" | "workshop" | "editorial" | "studio";
export type Matrix = [[number, number, number], [number, number, number], [number, number, number]];

export const GRADES: Record<Grade, { matrix: Matrix; modulate: { brightness: number; saturation: number } }> = {
  /** Warm espresso shadows, champagne highlights. */
  evening: {
    matrix: [
      [0.95, 0.12, 0.03],
      [0.06, 0.86, 0.06],
      [0.04, 0.1, 0.7],
    ],
    modulate: { brightness: 0.96, saturation: 0.9 },
  },
  /** Champagne paper, cocoa ink. */
  workshop: {
    matrix: [
      [0.98, 0.06, 0.02],
      [0.04, 0.92, 0.04],
      [0.02, 0.08, 0.82],
    ],
    modulate: { brightness: 1, saturation: 0.92 },
  },
  /** Ivory paper, espresso ink. */
  editorial: {
    matrix: [
      [1, 0.03, 0],
      [0.02, 0.96, 0.02],
      [0, 0.05, 0.88],
    ],
    modulate: { brightness: 1.02, saturation: 0.85 },
  },
  /** Night blacks, one warm key. */
  studio: {
    matrix: [
      [0.92, 0.1, 0.02],
      [0.05, 0.82, 0.05],
      [0.02, 0.08, 0.66],
    ],
    modulate: { brightness: 0.9, saturation: 0.85 },
  },
};

/** The storyboards' grade per category. Software & Digital has no image layers (drawn in code). */
export const CATEGORY_GRADE: Partial<Record<CategorySlug, Grade>> = {
  "events-hospitality": "evening",
  "production-print-gifts": "workshop",
  "marketing-brand": "editorial",
  "creative-production": "studio",
};

/** `matrix × rgb`, rounded and clamped to 0–255, as sharp's recomb gives it. */
export function recomb(matrix: Matrix, [r, g, b]: [number, number, number]): [number, number, number] {
  return matrix.map((row) => Math.min(255, Math.max(0, Math.round(row[0] * r + row[1] * g + row[2] * b)))) as [number, number, number];
}

/** Where a scene layer's file lives (repo-relative). Its URL is the same path without `public`. */
export function sceneImageFile(category: CategorySlug, slot: string, ext: "avif" | "webp"): string {
  return `public/images/scenes/${category}/${slot}.${ext}`;
}

/** A resize target wider than the source is refused (D51: native pixels only). */
export function upscaleProblem(sourceWidth: number, targetWidth?: number): string | null {
  return targetWidth !== undefined && targetWidth > sourceWidth
    ? `refusing to upscale: source is ${sourceWidth}px wide, target ${targetWidth}px`
    : null;
}
