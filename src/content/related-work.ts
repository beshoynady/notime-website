import type { CategorySlug, Localized } from "./types";
import { workCards, type WorkCard } from "./work";

/**
 * Related work on a category page (v1 plan, Phase C): the anonymised cases whose categories
 * include it, from `work.ts`, each in the version its client allows (WORK_NAMED), with the other
 * categories it spans (`also`), from the Work cards (cover included). Empty when the
 * category has none, and the block is then hidden (fill or hide, D78).
 */
export function relatedWork(category: CategorySlug): { card: WorkCard; also: CategorySlug[] }[] {
  return workCards()
    .filter((c) => c.kind === "case" && c.categories.includes(category))
    .map((card) => ({ card, also: card.categories.filter((c) => c !== category) }));
}

export const RELATED_WORK_COPY = {
  eyebrow: { en: "Related work", ar: "أعمال ذات صلة" },
  title: { en: "Delivered for national organisations", ar: "أعمال نفّذناها لجهات وطنية" },
  note: {
    en: "We don't write the client's name until they approve it.",
    ar: "لا نكتب اسم أي عميل قبل موافقته.",
  },
} satisfies Record<string, Localized<string>>;
