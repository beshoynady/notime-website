import type { CategorySlug } from "../types";
import type { SceneImageSlot } from "./types";

/**
 * Scene layer images, one entry per row of docs/design/storyboards/layers.md (tested one to
 * one). No file exists yet: each category's images are made after its animatic is approved
 * (D64), graded with scripts/grade.mjs, and filled in here with their native size.
 * TODO: replace placeholder — every `src: null` until its graded file passes the contact sheet.
 */
type Entry = Omit<SceneImageSlot, "category" | "grade">;

/** Plates have a 16:9 file and a 9:16 one for widths below 900px. */
const plate = (id: string): Entry => ({ id, source: { kind: "ai" }, src: null, mobile: { src: null } });
const ai = (id: string, from?: string): Entry => ({ id, source: { kind: "ai", from }, src: null });
const real = (id: string, from: string, alt?: Entry["alt"]): Entry => ({ id, source: { kind: "real", from }, src: null, alt });

const BY_CATEGORY: { category: CategorySlug; grade: SceneImageSlot["grade"]; slots: Entry[] }[] = [
  {
    category: "events-hospitality",
    grade: "evening",
    slots: [
      plate("ev-open-hall"),
      real("ev-open-table", "catering-2"),
      real("ev-open-florals", "private-celebrations-2"),
      real("ev-open-candles", "private-celebrations-4"),
      real("ev-open-glasses", "catering-1"),
      plate("ev-majlis-dusk"),
      real("ev-majlis-tent", "heritage-5"),
      real("ev-majlis-dallah", "heritage-4"),
      real("ev-majlis-cup", "heritage-2"),
    ],
  },
  {
    category: "production-print-gifts",
    grade: "workshop",
    slots: [plate("pg-open-bench"), ai("pg-open-paper"), ai("pg-open-ribbon"), ai("pg-open-box-base"), ai("pg-open-box-lid")],
  },
  {
    category: "marketing-brand",
    grade: "editorial",
    slots: [plate("mb-open-paper"), ai("mb-open-board", "cat-marketing-brand-4x5"), ai("mb-open-swatches"), ai("mb-open-pen")],
  },
  {
    category: "creative-production",
    grade: "studio",
    slots: [
      plate("cp-open-studio"),
      ai("cp-open-slate"),
      ai("cp-open-slate-stick"),
      ai("cp-open-camera", "cat-creative-production-4x5"),
      // Real work shown as evidence, so it has alt text (layers.md).
      real("cp-open-frame", "catering-4", {
        en: "Dessert boards styled and photographed for an event.",
        ar: "ألواح حلويات منسّقة ومصوّرة لإحدى الفعاليات.",
      }),
    ],
  },
];

export const SCENE_IMAGES: SceneImageSlot[] = BY_CATEGORY.flatMap(({ category, grade, slots }) => slots.map((s) => ({ ...s, category, grade })));

export function getSceneImage(id: string): SceneImageSlot | undefined {
  return SCENE_IMAGES.find((s) => s.id === id);
}
