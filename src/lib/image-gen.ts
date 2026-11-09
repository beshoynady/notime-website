/**
 * Pure helpers for scripts/generate-image.mjs (AI images through an API; DECISIONS D76).
 * Prompts come from the docs, never from the script: site slots from
 * docs/content/image-prompts.md, scene layers from docs/design/storyboards/layers.md.
 */
import type { CategorySlug } from "@/content/types";

export type Aspect = "16:9" | "9:16" | "4:5";
export type SlotSpec = { id: string; kind: "site" | "scene"; aspects: Aspect[]; prompt: string };

const ASPECTS: Aspect[] = ["16:9", "9:16", "4:5"];
const aspectsIn = (text: string): Aspect[] => {
  const found = [...text.matchAll(/(16:9|9:16|4:5)/g)].map((m) => m[1] as Aspect);
  return [...new Set(found)].filter((a) => ASPECTS.includes(a));
};
const stripHouseStyle = (p: string) => p.replace(/^House style\.\s*/, "").trim();

/**
 * The slot's AI prompt and aspects. A site slot is a `### \`<id>\`` entry in image-prompts.md; a
 * scene layer is a row of layers.md whose source is AI. `fallback` reads a real row's
 * "*Fallback:* AI cutout, "…"" prompt (used only when the real cutout fails).
 */
export function findSlot(id: string, promptsDoc: string, layersDoc: string, fallback = false): SlotSpec {
  const entry = promptsDoc.split(/^### /m).find((e) => e.startsWith(`\`${id}\``));
  if (entry) {
    if (/^`[^`]+` \(cancelled/.test(entry)) throw new Error(`${id} is cancelled (image-prompts.md)`);
    const prompt = entry.match(/^- \*\*Prompt(?: \(fallback only\))?:\*\* (.+)$/m)?.[1];
    const aspect = entry.match(/\*\*Aspect:\*\* ([0-9:]+)/)?.[1];
    if (!prompt || !aspect) throw new Error(`${id}: no prompt or aspect in image-prompts.md`);
    return { id, kind: "site", aspects: aspectsIn(aspect), prompt: stripHouseStyle(prompt) };
  }
  const row = layersDoc.split("\n").find((l) => l.startsWith("| `") && l.split("|")[1].includes(`\`${id}\``));
  if (!row) throw new Error(`${id} not found in image-prompts.md or layers.md`);
  const [, , , size, source, prompt] = row.split("|").map((c) => c.trim());
  if (/^AI\b/.test(source)) return { id, kind: "scene", aspects: aspectsIn(size).length ? aspectsIn(size) : ["4:5"], prompt: stripHouseStyle(prompt) };
  const quoted = prompt.match(/\*Fallback:\* AI cutout,? "([^"]+)"/)?.[1];
  if (fallback && quoted) return { id, kind: "scene", aspects: ["4:5"], prompt: quoted.replace(/…$/, "") + " Isolated subject, centred, on a plain neutral warm-grey background, soft even light, clean edges, nothing else in frame." };
  throw new Error(`${id} has a real source${quoted ? " (an AI fallback exists: pass --fallback only if the real cutout failed)" : ""}`);
}

/** A blockquote paragraph under a `## <heading>` of image-prompts.md, without the `> `. */
function quoteUnder(doc: string, heading: string): string {
  const section = doc.split(/^## /m).find((s) => s.startsWith(heading));
  const quote = section?.split("\n").filter((l) => l.startsWith("> ")).map((l) => l.slice(2)).join(" ");
  if (!quote) throw new Error(`no quoted "${heading}" in image-prompts.md`);
  return quote.trim();
}

/**
 * House style + the slot's prompt + the shared negative prompt. The model takes no negative
 * prompt, so it goes in as an explicit avoid list.
 */
export function buildPrompt(promptsDoc: string, slotPrompt: string): string {
  const house = quoteUnder(promptsDoc, "House style");
  const negative = quoteUnder(promptsDoc, "Shared negative prompt");
  return `${house} ${slotPrompt} Avoid: ${negative}.`;
}

/** The approved delivery size per aspect (D51): downscaled to, never upscaled. */
export function deliverySize(aspect: Aspect): { width: number; height: number } {
  return { "16:9": { width: 1680, height: 944 }, "9:16": { width: 944, height: 1680 }, "4:5": { width: 1136, height: 1408 } }[aspect];
}

const PREFIX: Record<string, CategorySlug> = {
  ev: "events-hospitality",
  pg: "production-print-gifts",
  mb: "marketing-brand",
  cp: "creative-production",
};
export function sceneCategory(id: string): CategorySlug {
  const c = PREFIX[id.split("-")[0]];
  if (!c) throw new Error(`${id} is not a scene layer`);
  return c;
}

/** Sum of the estimated costs (column 7, USD) of the generation rows in the log. */
export function loggedSpend(log: string): number {
  return log
    .split("\n")
    .filter((l) => /^\| \d{4}-\d{2}-\d{2} \|/.test(l))
    .reduce((sum, l) => sum + (Number(l.split("|")[7]?.trim()) || 0), 0);
}

/** Why a request costing `cost` may not run, or null. The budget line is set only by the user's OK. */
export function budgetProblem(log: string, cost: number): string | null {
  const budget = Number(log.match(/^Approved budget: USD ([0-9.]+)/m)?.[1]);
  if (!budget) return "no approved budget in the log (the user approves one before any request)";
  const spent = loggedSpend(log);
  if (spent + cost > budget + 1e-9) return `USD ${(spent + cost).toFixed(2)} would be over the approved budget of USD ${budget.toFixed(2)} (spent ${spent.toFixed(2)})`;
  return null;
}

/**
 * AI-provenance markers in a generated file, checked before anything converts it (D77).
 * c2pa: a C2PA manifest (Content Credentials): a PNG `caBX` chunk, or a JUMBF box (`jumb` →
 * `jumd`) labelled `c2pa`, as JPEG APP11 carries it. iptcAi: the IPTC digital source type
 * "trainedAlgorithmicMedia" in XMP. A byte scan, not a validator: c2patool verifies signatures.
 */
export function provenance(file: Uint8Array): { c2pa: boolean; iptcAi: boolean } {
  const text = new TextDecoder("latin1").decode(file);
  const jumbf = text.indexOf("jumb");
  const c2pa = text.includes("caBX") || (jumbf >= 0 && /jumd[\s\S]{0,64}c2pa/.test(text.slice(jumbf)));
  return { c2pa, iptcAi: text.includes("digitalsourcetype/trainedAlgorithmicMedia") };
}
