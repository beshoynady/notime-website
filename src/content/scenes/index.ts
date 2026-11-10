import type { CategorySlug, Service } from "../types";
import { STUDIO_OPENING } from "./creative-production";
import { EVENTS_MAJLIS, EVENTS_OPENING } from "./events-hospitality";
import { EDITORIAL_OPENING } from "./marketing-brand";
import { WORKSHOP_OPENING } from "./production-print-gifts";
import type { SceneConfig } from "./types";

export type * from "./types";

/**
 * The opening scene of each category, once its animatic is approved (Task 3.0 and later).
 * A category without one renders a static opening (H1, intro, skip control) and no pin.
 */
const SCENES: Partial<Record<CategorySlug, SceneConfig>> = definedOnly({
  // Built from the storyboards with no animatic (D82, D83).
  "creative-production": STUDIO_OPENING,
  "marketing-brand": EDITORIAL_OPENING,
  "production-print-gifts": WORKSHOP_OPENING,
});

function definedOnly<K extends string>(m: Record<K, SceneConfig | undefined>): Partial<Record<K, SceneConfig>> {
  return Object.fromEntries(Object.entries(m).filter(([, v]) => v)) as Partial<Record<K, SceneConfig>>;
}

export function getScene(slug: CategorySlug): SceneConfig | undefined {
  return SCENES[slug];
}

/**
 * Scenes in review: their animatic shows on the lab route only. On approval a scene moves to
 * SCENES (the opening) or SECTION_SCENES (a section's scene) and the public page shows it.
 */
const LAB_SCENES: Partial<Record<CategorySlug, SceneConfig>> = {
  "events-hospitality": EVENTS_OPENING, // Task 3.0, awaiting approval
};
/** Scenes inside a service section, by service slug: public once approved, and those in review. */
const SECTION_SCENES: Record<string, SceneConfig> = {};
const LAB_SECTION_SCENES: Record<string, SceneConfig> = {
  "catering-heritage-hospitality": EVENTS_MAJLIS, // the majlis (Task 3.0, awaiting approval)
};

/** The opening the lab route shows: the approved scene, else the one in review, else the draft. */
export function getLabScene(slug: CategorySlug): SceneConfig {
  return SCENES[slug] ?? LAB_SCENES[slug] ?? DRAFT_SCENE;
}

/** A service section's own scene (the Events majlis); `lab` includes those in review. */
export function getSectionScene(service: Pick<Service, "slug">, lab: boolean): SceneConfig | undefined {
  return SECTION_SCENES[service.slug] ?? (lab ? LAB_SECTION_SCENES[service.slug] : undefined);
}

/** Every section scene, approved or in review, for the section pin limit (scenes.test.ts). */
export function allSectionScenes(): SceneConfig[] {
  return [...new Set([...Object.values(SECTION_SCENES), ...Object.values(LAB_SECTION_SCENES)])];
}

/** Every scene, once, for the rule and asset checks (scenes.test.ts, images.test.ts). */
export function allScenes(): SceneConfig[] {
  const all = [DRAFT_SCENE, ...Object.values(SCENES), ...Object.values(LAB_SCENES), ...Object.values(SECTION_SCENES), ...Object.values(LAB_SECTION_SCENES)];
  return [...new Set(all)];
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

export { getSceneImage, SCENE_IMAGES } from "./images";
