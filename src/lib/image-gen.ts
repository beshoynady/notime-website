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

const ASPECT_SUFFIX = /-(\d+)x(\d+)$/;

/**
 * Which slot a file dropped in assets-inbox/ is for (D79). Site slots are named by their full
 * id (`hero-fallback-16x9.png`); scene layers by id plus aspect (`ev-open-hall-9x16.png`). A layer
 * is a cutout when its "BG removal" column in layers.md isn't "none"; a real-source layer's AI
 * fallback is always a cutout. `master` is the graded file's name (a plate's 9:16 keeps the suffix).
 */
export function inboxTarget(
  filename: string,
  promptsDoc: string,
  layersDoc: string,
): { slot: string; kind: "site" | "scene"; aspect: Aspect; cutout: boolean; master: string } {
  const base = filename.replace(/\.[a-z0-9]+$/i, "");
  const m = base.match(ASPECT_SUFFIX);
  if (!m) throw new Error(`${filename}: the name must end with its aspect, e.g. -16x9`);
  const aspect = `${m[1]}:${m[2]}` as Aspect;
  const isSite = promptsDoc.split(/^### /m).some((e) => e.startsWith(`\`${base}\``));
  if (isSite) {
    findSlot(base, promptsDoc, layersDoc);
    return { slot: base, kind: "site", aspect, cutout: false, master: base };
  }
  const id = base.replace(ASPECT_SUFFIX, "");
  let spec: SlotSpec;
  let fallback = false;
  try {
    spec = findSlot(id, promptsDoc, layersDoc);
  } catch (e) {
    if (!/real source/.test((e as Error).message)) throw e;
    spec = findSlot(id, promptsDoc, layersDoc, true);
    fallback = true;
  }
  if (!spec.aspects.includes(aspect)) throw new Error(`${filename}: ${id} has no ${aspect} aspect (${spec.aspects.join(", ")})`);
  const row = layersDoc.split("\n").find((l) => l.startsWith("| `") && l.split("|")[1].includes(`\`${id}\``))!;
  const cutout = fallback || !/^none\b/i.test(row.split("|")[6].trim());
  const master = aspect === "16:9" || spec.aspects.length === 1 ? id : `${id}-${m[1]}x${m[2]}`;
  return { slot: id, kind: "scene", aspect, cutout, master };
}

/** The largest centred crop of a w × h image at the aspect, even-sized, never enlarged (D51). */
export function centreCrop(w: number, h: number, aspect: Aspect): { left: number; top: number; width: number; height: number } {
  const [aw, ah] = aspect.split(":").map(Number);
  const even = (n: number) => n - (n % 2);
  let width = w;
  let height = Math.round((w * ah) / aw);
  if (height > h) {
    height = h;
    width = Math.round((h * aw) / ah);
  }
  width = even(width);
  height = even(height);
  return { left: Math.floor((w - width) / 2), top: Math.floor((h - height) / 2), width, height };
}
