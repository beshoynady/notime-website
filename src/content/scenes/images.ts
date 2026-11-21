import type { CategorySlug } from "../types";
import { media } from "../media";
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
      // The room, dressed (batch 2): a real photo as a plate, graded with scripts/grade.mjs. It
      // fades in over the drawn hall on the same vanishing point (scenes/events-hospitality.ts).
      {
        id: "ev-open-room",
        source: { kind: "real", from: "private-celebrations-1" },
        src: "/images/scenes/events-hospitality/ev-open-room.webp",
        width: 1600,
        height: 900,
        mobile: { src: "/images/scenes/events-hospitality/ev-open-room-9x16.webp", width: 600, height: 1066 },
      },
      // The near tables (D109): cut from the room's own photo along the aisle, full-frame on both crops.
      {
        id: "ev-open-table",
        source: { kind: "real", from: "private-celebrations-1" },
        src: "/images/scenes/events-hospitality/ev-open-table.webp",
        width: 1600,
        height: 900,
        mobile: { src: "/images/scenes/events-hospitality/ev-open-table-9x16.webp", width: 600, height: 1066 },
      },
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
    slots: [
      plate("pg-open-bench"),
      ai("pg-open-paper"),
      ai("pg-open-ribbon"),
      ai("pg-open-box-base"),
      ai("pg-open-box-lid"),
      // The finished gift (D109): NO TIME's gold Dubai-skyline piece, a rembg cutout of gifts-1, graded.
      {
        id: "pg-open-gift",
        source: { kind: "real", from: "gifts-1" },
        src: "/images/scenes/production-print-gifts/pg-open-gift.webp",
        width: 1034,
        height: 616,
        alt: {
          en: "A Dubai skyline cut in gold-finished metal, made as a corporate gift.",
          ar: "أفق دبي مقصوص من معدن بلمسة ذهبية، صُنع هديةً لإحدى الشركات.",
        },
      },
    ],
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
      // Graded from catering-4 (step 3): the frame that develops in shot 4.
      {
        id: "cp-open-frame",
        source: { kind: "real", from: "catering-4" },
        src: "/images/scenes/creative-production/cp-open-frame.webp",
        width: 1187,
        height: 668,
        alt: {
          en: "Dessert boards styled and photographed for an event.",
          ar: "ألواح حلويات منسّقة ومصوّرة لإحدى الفعاليات.",
        },
      },
    ],
  },
];

export const SCENE_IMAGES: SceneImageSlot[] = BY_CATEGORY.flatMap(({ category, grade, slots }) => slots.map((s) => ({ ...s, category, grade })));

/**
 * A layer's image: a storyboard slot above, else the image registry (media.ts, D152), where the
 * photo-beat scenes keep their layers. A hidden or unknown registry id resolves to nothing, so
 * its layer renders no image.
 */
export function getSceneImage(id: string): SceneImageSlot | undefined {
  const slot = SCENE_IMAGES.find((s) => s.id === id);
  if (slot) return slot;
  const m = media(id);
  if (!m) return undefined;
  return {
    id,
    category: "events-hospitality",
    grade: m.grade ?? "evening",
    source: m.source === "stock" || m.source === "ai" ? { kind: "ai", from: m.from } : { kind: "real", from: m.from ?? id },
    src: m.file,
    width: m.width,
    height: m.height,
    mobile: m.mobile && { src: m.mobile.file, width: m.mobile.width, height: m.mobile.height },
    alt: m.alt ?? undefined,
  };
}
