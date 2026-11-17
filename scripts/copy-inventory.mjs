#!/usr/bin/env node
/**
 * The site's words in one table (docs/review/copy-rewrite.md).
 *   node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --dump <out.json>
 *   node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render <proposals-dir> <out.md> [--head=<file.md>]
 * Every public string, EN + AR, with a stable ID: `m:<namespace.key>` (src/messages) or
 * `c:<file>:<path>` (a localized { en, ar } field in src/content; array items are named by their
 * slug/anchor/id when they have one). The style guide and the review-mode examples are internal and
 * left out. --render merges the proposals (docs/review/copy-rewrite/<page>.json:
 * { "<id>": { rule, en?, ar?, facts? } }) so every string gets a row, "keep" where none is proposed.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(readFileSync(path.join(ROOT, "src/messages/en.json"), "utf8"));
const ar = JSON.parse(readFileSync(path.join(ROOT, "src/messages/ar.json"), "utf8"));

const rows = [];
const SKIP_NS = new Set(["styleguide"]);
const walkMsg = (e, a, p) => {
  if (typeof e === "string") return rows.push({ id: `m:${p}`, en: e, ar: typeof a === "string" ? a : "" });
  for (const k of Object.keys(e ?? {})) if (!(p === "" && SKIP_NS.has(k))) walkMsg(e[k], a?.[k], p ? `${p}.${k}` : k);
};
walkMsg(en, ar, "");

const CONTENT = [
  "categories", "services", "service-hooks", "photo-stories", "form-copy", "forms", "work", "product-pages", "products",
  "markets", "principles", "links", "showreel", "images", "legal", "software/page",
  ...readdirSync(path.join(ROOT, "src/content/modules")).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")).map((f) => `modules/${f.slice(0, -3)}`),
  ...readdirSync(path.join(ROOT, "src/content/scenes")).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && !["index.ts", "types.ts", "images.ts"].includes(f)).map((f) => `scenes/${f.slice(0, -3)}`),
];
const isLoc = (o) => o && typeof o === "object" && !Array.isArray(o) && "en" in o && "ar" in o && Object.keys(o).length <= 3;
const name = (o, i) => (o && typeof o === "object" && (o.slug || o.anchor || o.id || o.key)) || i;
const seen = new WeakSet();
const walkC = (o, p, file) => {
  if (!o || typeof o !== "object" || seen.has(o)) return;
  seen.add(o);
  if (isLoc(o)) {
    if (typeof o.en === "string") rows.push({ id: `c:${file}:${p}`, en: o.en, ar: o.ar ?? "" });
    else if (Array.isArray(o.en)) o.en.forEach((s, i) => typeof s === "string" && rows.push({ id: `c:${file}:${p}[${i}]`, en: s, ar: o.ar?.[i] ?? "" }));
    return;
  }
  if (Array.isArray(o)) o.forEach((x, i) => walkC(x, `${p}[${name(x, i)}]`, file));
  else for (const k of Object.keys(o)) walkC(o[k], p ? `${p}.${k}` : k, file);
};
for (const f of CONTENT) {
  const mod = await import(path.join(ROOT, "src/content", `${f}.ts`).replace(/\\/g, "/").replace(/^([A-Z]):/, "file:///$1:"));
  for (const [k, v] of Object.entries(mod)) if (typeof v === "object") walkC(v, k, f);
}

// ---------------------------------------------------------------- pages
const { services } = await import("file:///" + path.join(ROOT, "src/content/services.ts").replace(/\\/g, "/"));
const catOfService = Object.fromEntries(services.map((s) => [s.slug, s.category]));
const CATS = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"];
const SCENE_CAT = { events: "events-hospitality", creative: "creative-production", marketing: "marketing-brand", print: "production-print-gifts", software: "software-digital" };
const NS_PAGE = {
  meta: "global", brand: "global", common: "global", nav: "global", header: "global", langToggle: "global", megaMenu: "global",
  mobileMenu: "global", whatsapp: "global", footer: "global", notFound: "global",
  hero: "home", hud: "home", about: "home", categories: "home", services: "home", work: "home", marquee: "home", digital: "home",
  process: "home", markets: "home", cta: "home", reel: "home",
  category: "category-template", workIndex: "work", workCase: "work", aboutPage: "about", productPage: "products",
  contactPage: "contact", linksPage: "links", legal: "legal", credits: "legal",
};
const FILE_PAGE = {
  "form-copy": "contact", forms: "contact", work: "work", "product-pages": "products", products: "products", markets: "about",
  principles: "about", links: "links", showreel: "home", images: "alt-text", legal: "legal", credits: "legal", "software/page": "software",
};
function pageOf(id) {
  if (id.startsWith("m:")) {
    const [ns, sub] = id.slice(2).split(".");
    if (ns === "scenes") return SCENE_CAT[sub] ?? "category-template";
    return NS_PAGE[ns] ?? "other";
  }
  const [, file, p] = id.match(/^c:([^:]+):(.*)$/);
  if (FILE_PAGE[file]) return FILE_PAGE[file];
  if (file.startsWith("scenes/")) return file.slice(7);
  const slug = p.match(/\[([a-z0-9-]+)\]/)?.[1] ?? p.match(/^[A-Z_]+\.([a-z0-9-]+)/)?.[1];
  if (file === "categories" && CATS.includes(slug)) return slug;
  if (catOfService[slug]) return catOfService[slug];
  if (file.startsWith("modules/")) {
    const owner = services.find((s) => s.signatureModule === file.slice(8));
    if (owner) return owner.category;
  }
  if (file.startsWith("modules/") || file === "photo-stories") {
    const hit = Object.entries(catOfService).find(([s]) => p.includes(s));
    return hit ? hit[1] : file === "photo-stories" ? "events-hospitality" : "category-modules";
  }
  return "other";
}
for (const r of rows) r.page = pageOf(r.id);

const mode = process.argv[2];
if (mode === "--dump") {
  writeFileSync(process.argv[3], JSON.stringify(rows, null, 1));
  const by = {};
  for (const r of rows) by[r.page] = (by[r.page] ?? 0) + 1;
  console.log(rows.length, by);
} else if (mode === "--render") {
  const [dir, out] = process.argv.slice(3, 5);
  const head = process.argv.find((a) => a.startsWith("--head="))?.slice(7);
  const PAGES = [
    ["global", "Global: header, menus, footer, WhatsApp, 404"], ["home", "Home"], ["category-template", "Category pages: shared template"],
    ...CATS.map((c) => [c, `Category: ${c}`]), ["category-modules", "Category modules (demo data)"], ["software", "Software & Digital page"],
    ["work", "Work and case studies"], ["about", "About"], ["products", "Products"], ["contact", "Contact and forms"], ["links", "/links"],
    ["legal", "Legal and credits"], ["alt-text", "Image alt text"], ["other", "Other"],
  ];
  const props = {};
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) Object.assign(props, JSON.parse(readFileSync(path.join(dir, f), "utf8")));
  const unknown = Object.keys(props).filter((id) => !rows.some((r) => r.id === id) && !id.startsWith("new:"));
  const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  let md = head ? readFileSync(head, "utf8") + "\n" : "";
  let changed = 0;
  for (const [key, title] of PAGES) {
    const list = rows.filter((r) => r.page === key);
    const added = Object.entries(props).filter(([id, p]) => id.startsWith("new:") && p.page === key);
    if (!list.length && !added.length) continue;
    md += `\n## ${title}\n\n| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |\n|---|---|---|---|---|---|---|\n`;
    for (const r of list) {
      const p = props[r.id];
      if (p) changed++;
      md += `| \`${r.id}\` | ${cell(r.en)} | ${cell(r.ar)} | ${cell(p?.rule ?? "keep")} | ${cell(p ? (p.en ?? "(keep)") : "")} | ${cell(p ? (p.ar ?? "(keep)") : "")} | ${cell(p?.facts ?? "")} |\n`;
    }
    for (const [id, p] of added) md += `| \`${id}\` | (new) | (new) | ${cell(p.rule)} | ${cell(p.en)} | ${cell(p.ar)} | ${cell(p.facts)} |\n`;
  }
  writeFileSync(out, md);
  console.log(`${rows.length} strings, ${changed} with a proposal`);
  if (unknown.length) console.log("proposal IDs not in the inventory:", unknown);
}
