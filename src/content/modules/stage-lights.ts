import type { Localized } from "../types";

/**
 * Stage & technical production (category-pages.md §6 I.6): a stage drawn in SVG with four light
 * groups the visitor switches, and a four-cue sequence. An example rig (no stock photos, OQ #21;
 * no equipment model or brand named, OQ #22), labelled "Example".
 */
export type LightGroupId = "wash" | "spots" | "back" | "screen";

export const STAGE_LIGHTS = {
  example: true,
  title: { en: "Light the stage", ar: "أضئ المسرح" },
  note: {
    en: "An example rig in four groups. Switch each one, or run the cues as the crew would on the night.",
    ar: "منظومة إضاءة نموذجية من أربع مجموعات. شغّل كل مجموعة بنفسك، أو شغّل الإشارات كما يفعل الفريق ليلة الحدث.",
  },
  groupsLabel: { en: "Light groups", ar: "مجموعات الإضاءة" },
  groups: [
    { id: "wash", label: { en: "Wash", ar: "الإضاءة العامة" } },
    { id: "spots", label: { en: "Spots", ar: "الإضاءة المركّزة" } },
    { id: "back", label: { en: "Back light", ar: "الإضاءة الخلفية" } },
    { id: "screen", label: { en: "Screen", ar: "الشاشة" } },
  ] satisfies { id: LightGroupId; label: Localized<string> }[],
  /** The cue sequence: each cue brings one group up, in this order. */
  cues: [
    { group: "wash", label: { en: "Walk-in: the wash comes up", ar: "دخول الضيوف: الإضاءة العامة" } },
    { group: "screen", label: { en: "Screen up", ar: "تشغيل الشاشة" } },
    { group: "back", label: { en: "Back light for the stage", ar: "الإضاءة الخلفية للمسرح" } },
    { group: "spots", label: { en: "Spot on the speaker", ar: "الإضاءة المركّزة على المتحدث" } },
  ] satisfies { group: LightGroupId; label: Localized<string> }[],
  run: { en: "Run the cues", ar: "شغّل الإشارات" },
  stop: { en: "Stop the cues", ar: "أوقف الإشارات" },
  /** Live region. {group}, {n}, {total} and {cue} are filled in. */
  status: {
    on: { en: "{group} on, {n} of {total} groups", ar: "{group}: تعمل، {n} من {total} مجموعات" },
    off: { en: "{group} off, {n} of {total} groups", ar: "{group}: متوقفة، {n} من {total} مجموعات" },
    start: { en: "Cue sequence running", ar: "تسلسل الإشارات يعمل" },
    cue: { en: "Cue {n} of {total}: {cue}", ar: "الإشارة {n} من {total}: {cue}" },
    stopped: { en: "Cues stopped", ar: "توقّفت الإشارات" },
  },
};
