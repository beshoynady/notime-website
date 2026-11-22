import { media, type MediaEntry } from "./media";
import type { CategorySlug, Localized } from "./types";
import { workItems, workView, type WorkView } from "./work";

/**
 * Related work on a category page (v1 plan, Phase C): the anonymised cases whose categories
 * include it, from `work.ts`, each in the version its client allows (WORK_NAMED), with the other
 * categories it spans (`also`) and its cover photo (D150, D164; undefined when hidden). Empty when the
 * category has none, and the block is then hidden (fill or hide, D78).
 */
export function relatedWork(category: CategorySlug): { view: WorkView; also: CategorySlug[]; cover?: MediaEntry }[] {
  return workItems
    .filter((w) => w.categories.includes(category))
    .map((w) => ({ view: workView(w), also: w.categories.filter((c) => c !== category), cover: media(w.cover) }));
}

export const RELATED_WORK_COPY = {
  eyebrow: { en: "Related work", ar: "أعمال ذات صلة" },
  title: { en: "Delivered for national organisations", ar: "أعمال نفّذناها لجهات وطنية" },
  note: {
    en: "Shown without the client's name until they approve it.",
    ar: "نعرضها دون ذكر العميل حتى يوافق على تسميته.",
  },
} satisfies Record<string, Localized<string>>;
