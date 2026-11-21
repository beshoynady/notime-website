/**
 * Image credits (v1 plan, Task A3; D80). The user downloads stock by hand from Pexels or Unsplash
 * (no API, no scraping), or makes an image in ChatGPT (D79), and lists every file dropped in
 * assets-inbox/ in assets-inbox/credits.csv: `filename,source,page_url,photographer`. The ingest
 * script refuses a file with no row, and writes each installed stock image into
 * src/content/credits.json, which the "Image credits" page lists.
 */
export type CreditSource = "pexels" | "unsplash" | "chatgpt";
export type CreditRow = { filename: string; source: CreditSource; pageUrl: string; photographer: string };
export type ImageCredit = { file: string; slot: string; source: CreditSource; pageUrl: string; photographer: string; date: string; sha256: string };

const HEADER = "filename,source,page_url,photographer";
const HOST: Record<Exclude<CreditSource, "chatgpt">, string> = { pexels: "pexels.com", unsplash: "unsplash.com" };

/** One CSV line into fields; double quotes wrap a field that holds commas ("" is a quote). */
function fields(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((f) => f.trim());
}

export function parseCredits(csv: string): CreditRow[] {
  const lines = csv.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines[0]?.replace(/\s/g, "") !== HEADER) throw new Error(`credits.csv: the header must be "${HEADER}"`);
  const seen = new Set<string>();
  return lines.slice(1).map((line, i) => {
    const [filename = "", source = "", pageUrl = "", photographer = ""] = fields(line);
    const at = `credits.csv line ${i + 2} (${filename})`;
    if (!filename) throw new Error(`${at}: no filename`);
    if (seen.has(filename)) throw new Error(`${at}: ${filename} is listed twice`);
    seen.add(filename);
    if (source !== "pexels" && source !== "unsplash" && source !== "chatgpt") throw new Error(`${at}: source must be pexels, unsplash or chatgpt`);
    if (source !== "chatgpt") {
      if (!pageUrl) throw new Error(`${at}: a ${source} image needs its page_url`);
      let host = "";
      try {
        host = new URL(pageUrl).hostname;
      } catch {
        throw new Error(`${at}: page_url is not a URL`);
      }
      if (host !== HOST[source] && !host.endsWith(`.${HOST[source]}`)) throw new Error(`${at}: page_url must be on ${HOST[source]}`);
      if (!photographer) throw new Error(`${at}: a ${source} image needs its photographer`);
    }
    return { filename, source, pageUrl, photographer };
  });
}

export function creditFor(filename: string, rows: CreditRow[]): CreditRow {
  const row = rows.find((r) => r.filename === filename);
  if (!row) throw new Error(`${filename}: no row in assets-inbox/credits.csv (filename,source,page_url,photographer)`);
  return row;
}

/** Adds or replaces the credit for its file; sorted by file for a stable page and diff. */
export function upsertCredit(list: ImageCredit[], credit: ImageCredit): ImageCredit[] {
  return [...list.filter((c) => c.file !== credit.file), credit].sort((a, b) => a.file.localeCompare(b.file));
}
