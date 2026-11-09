#!/usr/bin/env node
/**
 * AI images through the Replicate API (D76): one model for every slot, prompts from the docs.
 *
 *   node scripts/generate-image.mjs <slot> --aspect 16:9 [--seed N] [--fallback] [--dry-run]
 *     Builds the prompt (house style + the slot's prompt + the shared negative prompt as an
 *     avoid list), checks the approved budget in the log, calls the model, saves the original to
 *     raw/ai/<slot>/ (gitignored) and logs the request. --dry-run prints the request and spends
 *     nothing (no key needed).
 *
 *   node scripts/generate-image.mjs --install <slot> --aspect 16:9 --file raw/ai/<slot>/<file>.png
 *     After the full-size inspection passed: crops to the aspect and downscales to the approved
 *     delivery size (never upscales, D51), then runs the pipeline into the slot: scene layers
 *     through scripts/grade.mjs (the category's grade) into public/images/scenes/<category>;
 *     site slots through scripts/convert-ai.mjs (which converts only slots listed in PASSED).
 *
 *   node scripts/generate-image.mjs --verdict <slot> accepted|rejected "<reason>"
 *     Records the inspection result in the log.
 *
 * Generation is refused unless docs/content/image-generation-log.md carries "Approved budget:
 * USD <n>" (set only after the user's OK) and the logged spend plus this request stays within it.
 * The token is read from REPLICATE_API_TOKEN (environment or .env.local) and never printed.
 */
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

process.removeAllListeners("warning");
process.on("warning", (w) => w.code !== "MODULE_TYPELESS_PACKAGE_JSON" && console.warn(w));
const { budgetProblem, buildPrompt, deliverySize, findSlot, sceneCategory } = await import("../src/lib/image-gen.ts");
const sharp = createRequire(import.meta.url)("sharp");

/** One model for all slots (house-style consistency). Price per output image, USD, from replicate.com (2026-11-09). */
const MODEL = { id: "black-forest-labs/flux-1.1-pro-ultra", costPerImage: 0.06, raw: true };
const LOG = path.join("docs", "content", "image-generation-log.md");
const RAW = path.join("raw", "ai");
const read = (p) => readFileSync(p, "utf8");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const has = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? (args.splice(i, 1), true) : false;
};

function token() {
  if (process.env.REPLICATE_API_TOKEN) return process.env.REPLICATE_API_TOKEN;
  const env = existsSync(".env.local") ? read(".env.local") : "";
  const value = env.match(/^REPLICATE_API_TOKEN=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
  if (!value) throw new Error("REPLICATE_API_TOKEN is not set (environment or .env.local)");
  return value;
}

const today = () => new Date().toISOString().slice(0, 10);
const logRow = (cells) => appendFileSync(LOG, `| ${cells.join(" | ")} |\n`);

async function replicate(input, auth) {
  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL.id}/predictions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json", Prefer: "wait=60" },
    body: JSON.stringify({ input }),
  });
  let p = await res.json();
  if (!res.ok) throw new Error(`Replicate ${res.status}: ${p.detail ?? p.title ?? "request failed"}`);
  while (p.status === "starting" || p.status === "processing") {
    await new Promise((r) => setTimeout(r, 2000));
    p = await (await fetch(p.urls.get, { headers: { Authorization: `Bearer ${auth}` } })).json();
  }
  if (p.status !== "succeeded") throw new Error(`prediction ${p.id} ${p.status}: ${p.error ?? ""}`);
  return p;
}

async function generate(slot) {
  const aspect = flag("--aspect");
  const seed = Number(flag("--seed") ?? Math.floor(Math.random() * 2 ** 31));
  const dry = has("--dry-run");
  const spec = findSlot(slot, read("docs/content/image-prompts.md"), read("docs/design/storyboards/layers.md"), has("--fallback"));
  if (!aspect || !spec.aspects.includes(aspect)) throw new Error(`--aspect must be one of ${spec.aspects.join(", ")} for ${slot}`);
  const input = { prompt: buildPrompt(read("docs/content/image-prompts.md"), spec.prompt), aspect_ratio: aspect, raw: MODEL.raw, seed, output_format: "png", safety_tolerance: 2 };
  const problem = budgetProblem(existsSync(LOG) ? read(LOG) : "", MODEL.costPerImage);
  if (dry) {
    console.log(JSON.stringify({ slot, kind: spec.kind, model: MODEL.id, costUSD: MODEL.costPerImage, delivery: deliverySize(aspect), budget: problem ?? "ok", input }, null, 2));
    return;
  }
  if (problem) throw new Error(`refused: ${problem}`);
  const p = await replicate(input, token());
  const url = Array.isArray(p.output) ? p.output[0] : p.output;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const dir = path.join(RAW, slot);
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${today()}-${aspect.replace(":", "x")}-${seed}.png`);
  writeFileSync(file, buf);
  writeFileSync(file.replace(/\.png$/, ".json"), JSON.stringify({ slot, model: MODEL.id, prediction: p.id, input }, null, 2));
  const { width, height } = await sharp(buf).metadata();
  logRow([today(), slot, aspect, MODEL.id, `${width}×${height}`, seed, MODEL.costPerImage.toFixed(2), p.id, "generated, to inspect"]);
  console.log(`saved ${file} (${width}×${height}); inspect it at full size, then --verdict and --install`);
}

async function install(slot) {
  const aspect = flag("--aspect");
  const file = flag("--file");
  if (!aspect || !file) throw new Error("--install needs --aspect and --file");
  const spec = findSlot(slot, read("docs/content/image-prompts.md"), read("docs/design/storyboards/layers.md"), true);
  const { width, height } = deliverySize(aspect);
  const meta = await sharp(file).metadata();
  if (meta.width < width || meta.height < height) throw new Error(`${file} is ${meta.width}×${meta.height}, smaller than ${width}×${height}: never upscaled (D51)`);
  const stage = path.join(RAW, "masters", spec.kind === "scene" ? sceneCategory(slot) : "site");
  mkdirSync(stage, { recursive: true });
  const name = spec.kind === "site" || aspect === "16:9" || spec.aspects.length === 1 ? slot : `${slot}-${aspect.replace(":", "x")}`;
  const master = path.join(stage, `${name}.png`);
  await sharp(file).resize(width, height, { fit: "cover", position: "centre", withoutEnlargement: true }).png().toFile(master);
  if (spec.kind === "scene") {
    const cat = sceneCategory(slot);
    execFileSync(process.execPath, ["scripts/grade.mjs", cat, master, path.join("public", "images", "scenes", cat)], { stdio: "inherit" });
  } else {
    execFileSync(process.execPath, ["scripts/convert-ai.mjs", stage], { stdio: "inherit" });
  }
}

const cmd = args[0];
if (cmd === "--install") await install(args[1]);
else if (cmd === "--verdict") {
  const [, slot, verdict, reason = ""] = args;
  if (!["accepted", "rejected"].includes(verdict)) throw new Error("--verdict <slot> accepted|rejected \"<reason>\"");
  logRow([`${today()} (inspection)`, slot, "", "", "", "", "", "", `${verdict}${reason ? `: ${reason}` : ""}`]);
} else if (cmd && !cmd.startsWith("--")) await generate(cmd);
else throw new Error("usage: see the header of scripts/generate-image.mjs");
