#!/usr/bin/env node
/**
 * Stock search for the visual-portfolio scenes (Unsplash + Pexels, both free for commercial use).
 *   node --env-file=.env.local scripts/stock-search.mjs "<query>" [--n=8] [--orientation=landscape] [--sheet=out.jpg]
 *   node --env-file=.env.local scripts/stock-search.mjs --get=<unsplash|pexels>:<id> --out=<file.jpg>
 * Search prints one line per hit: source:id, size, photographer, page URL. --sheet writes a
 * contact sheet of the hits (to review before choosing). --get downloads the original and, for
 * Unsplash, calls its download endpoint as the API guidelines require. Keys: UNSPLASH_ACCESS_KEY,
 * PEXELS_API_KEY (never printed).
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const args = process.argv.slice(2);
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const UA = { "User-Agent": "notime-website-stock-search" };

async function unsplash(query, n, orientation) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.search = new URLSearchParams({ query, per_page: String(n), orientation, content_filter: "high" });
  const r = await fetch(u, { headers: { ...UA, Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } });
  if (!r.ok) throw new Error(`unsplash ${r.status}`);
  const j = await r.json();
  return j.results.map((p) => ({
    id: `unsplash:${p.id}`,
    w: p.width,
    h: p.height,
    by: p.user?.name,
    page: p.links.html,
    thumb: p.urls.small,
    desc: p.alt_description ?? "",
  }));
}

async function pexels(query, n, orientation) {
  const u = new URL("https://api.pexels.com/v1/search");
  u.search = new URLSearchParams({ query, per_page: String(n), orientation });
  const r = await fetch(u, { headers: { ...UA, Authorization: process.env.PEXELS_API_KEY } });
  if (!r.ok) throw new Error(`pexels ${r.status}`);
  const j = await r.json();
  return j.photos.map((p) => ({ id: `pexels:${p.id}`, w: p.width, h: p.height, by: p.photographer, page: p.url, thumb: p.src.medium, desc: p.alt ?? "" }));
}

async function get(spec, out) {
  const [src, id] = spec.split(":");
  if (src === "unsplash") {
    const h = { ...UA, Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` };
    const p = await (await fetch(`https://api.unsplash.com/photos/${id}`, { headers: h })).json();
    const dl = await (await fetch(p.links.download_location, { headers: h })).json(); // counts the download
    const buf = Buffer.from(await (await fetch(dl.url, { headers: UA })).arrayBuffer());
    await writeFile(out, buf);
    console.log(JSON.stringify({ id: spec, by: p.user?.name, page: p.links.html, w: p.width, h: p.height, license: "Unsplash License" }));
  } else {
    const p = await (await fetch(`https://api.pexels.com/v1/photos/${id}`, { headers: { ...UA, Authorization: process.env.PEXELS_API_KEY } })).json();
    const buf = Buffer.from(await (await fetch(p.src.original, { headers: UA })).arrayBuffer());
    await writeFile(out, buf);
    console.log(JSON.stringify({ id: spec, by: p.photographer, page: p.url, w: p.width, h: p.height, license: "Pexels License" }));
  }
}

if (opt("get")) {
  await get(opt("get"), opt("out", "stock.jpg"));
} else {
  const query = args.find((a) => !a.startsWith("--"));
  const n = Number(opt("n", "8"));
  const orientation = opt("orientation", "landscape");
  const hits = (await Promise.allSettled([unsplash(query, n, orientation), pexels(query, n, orientation)])).flatMap((r) => (r.status === "fulfilled" ? r.value : (console.warn(r.reason.message), [])));
  for (const h of hits) console.log(`${h.id}\t${h.w}x${h.h}\t${h.by}\t${h.desc.slice(0, 70)}`);
  const sheet = opt("sheet", "");
  if (sheet && hits.length) {
    const W = 320, H = 220, cols = 4;
    const tiles = await Promise.all(
      hits.map(async (h, i) => {
        const b = Buffer.from(await (await fetch(h.thumb, { headers: UA })).arrayBuffer());
        const img = await sharp(b).resize(W, H - 18, { fit: "cover" }).toBuffer();
        const label = Buffer.from(`<svg width="${W}" height="18"><rect width="100%" height="100%"/><text x="3" y="13" font-size="12" fill="#fff" font-family="Arial">${i} ${h.id}</text></svg>`);
        return [
          { input: label, left: (i % cols) * W, top: Math.floor(i / cols) * H },
          { input: img, left: (i % cols) * W, top: Math.floor(i / cols) * H + 18 },
        ];
      }),
    );
    await sharp({ create: { width: W * cols, height: H * Math.ceil(hits.length / cols), channels: 3, background: "#333" } })
      .composite(tiles.flat())
      .jpeg({ quality: 72 })
      .toFile(sheet);
  }
}
