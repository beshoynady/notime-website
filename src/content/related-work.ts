import type { CategorySlug, Localized } from "./types";
import { workItems, workView, type WorkView } from "./work";

/**
 * Related work on a category page (v1 plan, Phase C): the anonymised cases whose categories
 * include it, from `work.ts`, each in the version its client allows (WORK_NAMED), with the other
 * categories it spans (`also`). Empty when the
 * category has none, and the block is then hidden (fill or hide, D78).
 */
export function relatedWork(category: CategorySlug): { view: WorkView; also: CategorySlug[] }[] {
  return workItems
    .filter((w) => w.categories.includes(category))
    .map((w) => ({ view: workView(w), also: w.categories.filter((c) => c !== category) }));
}

export const RELATED_WORK_COPY = {
  eyebrow: { en: "Related work", ar: "أعمال ذات صلة" },
  title: { en: "Delivered for national organisations", ar: "أعمال نفّذناها لجهات وطنية" },
  note: {
    en: "Shown without the client's name until they approve it.",
    ar: "نعرضها دون ذكر العميل حتى يوافق على تسميته.",
  },
  illustrative: {
    en: "Images marked Illustrative stand in for the project's own photos.",
    ar: "الصور المعلَّمة بعبارة «صورة توضيحية» تحلّ محل صور المشروع نفسه.",
  },
} satisfies Record<string, Localized<string>>;
