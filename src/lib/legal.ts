/**
 * The legal pages' renderer logic (D78, fill or hide). A block or list item that needs a config
 * value renders only when that value exists; tokens like {legalName} are then filled. A section
 * left with no blocks disappears. Pure, so the hide rules are unit-tested.
 */
import type { Locale, Localized } from "@/content/types";

export type LegalNeed = "legalName" | "address" | "dataRequestContact" | "whatsapp" | "analytics";
export type LegalValues = Record<LegalNeed | "courts" | "prevailingLanguage", string>;

/** `needs`: shown once every value is set. `absent`: shown only while every value is unset (the
 *  line that a filled value replaces, e.g. "no analytics" until the analytics provider is set). */
type Gate = { needs?: LegalNeed[]; absent?: LegalNeed[] };
export type LegalBlock =
  | ({ p: Localized<string> } & Gate)
  | ({ list: ({ text: Localized<string> } & Gate)[] } & Gate)
  | ({ table: { head: Localized<string[]>; rows: Localized<string[]>[] } } & Gate);

export type LegalDoc = {
  slug: "privacy" | "terms" | "cookies";
  title: Localized<string>;
  /** "Last updated", ISO date. */
  updated: string;
  sections: { heading: Localized<string>; blocks: LegalBlock[] }[];
};

export type ResolvedBlock = { p: string } | { list: string[] } | { table: { head: string[]; rows: string[][] } };
export type ResolvedDoc = { title: string; updated: string; sections: { id: string; heading: string; blocks: ResolvedBlock[] }[] };

/** A section's anchor: from its English heading, so it is the same in EN and AR. */
const anchorOf = (en: string) => en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const shown = (g: Gate, v: LegalValues) =>
  (g.needs ?? []).every((k) => v[k].trim() !== "") && (g.absent ?? []).every((k) => v[k].trim() === "");
const fill = (s: string, v: LegalValues) => s.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? v[k as keyof LegalValues] : m));

export function resolveLegal(doc: LegalDoc, v: LegalValues, locale: Locale): ResolvedDoc {
  const sections = doc.sections
    .map((s) => ({
      id: anchorOf(s.heading.en),
      heading: s.heading[locale],
      blocks: s.blocks.filter((b) => shown(b, v)).flatMap((b): ResolvedBlock[] => {
        if ("p" in b) return [{ p: fill(b.p[locale], v) }];
        if ("list" in b) {
          const items = b.list.filter((i) => shown(i, v)).map((i) => fill(i.text[locale], v));
          return items.length ? [{ list: items }] : [];
        }
        return [{ table: { head: b.table.head[locale], rows: b.table.rows.map((r) => r[locale].map((c) => fill(c, v))) } }];
      }),
    }))
    .filter((s) => s.blocks.length > 0);
  return { title: doc.title[locale], updated: doc.updated, sections };
}
