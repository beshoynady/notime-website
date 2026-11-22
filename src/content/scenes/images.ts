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
const real = (id: string, from: string, alt?: Entry["alt"]): Entry => ({ id, source: { kind: "real", from }, src: null, alt });

const BY_CATEGORY: { category: CategorySlug; grade: SceneImageSlot["grade"]; slots: Entry[] }[] = [
  {
    category: "events-hospitality",
    grade: "evening",
    slots: [
      plate("ev-open-hall"),
      // The room, dressed (batch 2): a real photo as a plate, graded with scripts/grade.mjs. It wipes
      // in over the same room at night (ev-open-night, scenes/events-hospitality.ts). The ev-open-hall,
      // -florals, -candles, -glasses and ev-majlis-* slots below are from the drawn scenes and unused
      // since D153; they leave with the move into media.ts (D152).
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
