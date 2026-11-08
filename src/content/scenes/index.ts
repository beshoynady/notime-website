import type { CategorySlug } from "../types";
import type { SceneConfig } from "./types";

export type * from "./types";

/**
 * The opening scene of each category, once its animatic is approved (Task 3.0 and later).
 * A category without one renders a static opening (H1, intro, skip control) and no pin.
 */
const SCENES: Partial<Record<CategorySlug, SceneConfig>> = {};

export function getScene(slug: CategorySlug): SceneConfig | undefined {
  return SCENES[slug];
}

/**
 * The animatic template (storyboards README §3): four shots on the full pin, every layer level,
 * one entrance from each inline side. The lab route shows it for a category until that
 * category's own scene exists. Never rendered on a public page.
 * TODO: replace placeholder — each category's scene replaces it (Task 3.0, 4.0 and Part 4).
 */
export const DRAFT_SCENE: SceneConfig = {
  id: "draft",
  shots: [
    { id: "s1", copyKey: "draft.s1", desktop: [0, 0.45], mobile: [0, 0.35] },
    { id: "s2", copyKey: "draft.s2", desktop: [0.45, 0.95], mobile: null },
    { id: "s3", copyKey: "draft.s3", desktop: [0.95, 1.5], mobile: [0.35, 0.8] },
    { id: "s4", copyKey: "draft.s4", desktop: [1.5, 2.0], mobile: [0.8, 1.2] },
  ],
  layers: [
    { id: "L0 plate", level: 0, depth: 0.15, push: 0.06, mobile: true, box: { block: "0", inline: "0" } },
    { id: "L3 shade", level: 3, fx: "shade", depth: 0, mobile: true, box: { block: "0", inline: "0" }, style: { opacity: 0.7 }, keys: [{ shot: 1, to: { opacity: 0.4 } }, { shot: 3, to: { opacity: 0.25 } }] },
    { id: "L3 glow", level: 3, fx: "glow", depth: 0.2, mobile: true, box: { block: "15% 40%", inline: "25% 25%" }, style: { opacity: 0 }, keys: [{ shot: 1, to: { opacity: 1, scale: 1.15 } }] },
    { id: "L1 subject", level: 1, depth: 0.5, push: 0.1, mobile: true, box: { block: "48% 6%", inline: "14% 14%" }, enter: { shot: 2, from: { y: 20 } } },
    { id: "L2 from start", level: 2, depth: 1.2, mobile: true, box: { block: "38% 0", inline: "0 66%" }, enter: { shot: 2, from: { x: -40 } } },
    { id: "L2 from end", level: 2, depth: 1.0, mobile: false, box: { block: "52% 0", inline: "70% 0" }, enter: { shot: 2, from: { x: 40 } } },
  ],
};

/** Short ids for the hidden animatic route, `/[locale]/lab/<id>-animatic` (Task 2.9). */
export const LAB_IDS = {
  events: "events-hospitality",
  software: "software-digital",
  workshop: "production-print-gifts",
  editorial: "marketing-brand",
  studio: "creative-production",
} as const satisfies Record<string, CategorySlug>;

export function labCategory(param: string): CategorySlug | undefined {
  const m = /^([a-z]+)-animatic$/.exec(param);
  return m && Object.hasOwn(LAB_IDS, m[1]) ? LAB_IDS[m[1] as keyof typeof LAB_IDS] : undefined;
}
