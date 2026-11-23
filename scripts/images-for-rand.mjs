#!/usr/bin/env node
/**
 * Writes docs/content/images-for-rand.md (Arabic, for Rand) from the image registry: every picture
 * that is a stand-in (`replace`) or needs her approval (`randApproval`), with a thumbnail and the
 * pages that use it, plus the files we still need from her.
 *   node --no-warnings --import ./scripts/lib/alias.mjs scripts/images-for-rand.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { MEDIA } from "../src/content/media.ts";
import { WANTED } from "../src/content/media-wanted.ts";

const OUT = "docs/content/images-for-rand.md";
const THUMBS = "docs/content/images-for-rand";
await mkdir(THUMBS, { recursive: true });

/** Every source file under src/, read once, to find where an id is used. */
const sources = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f) && !p.endsWith("media.ts")) sources.push([p, readFileSync(p, "utf8")]);
  }
})("src");
const usedIn = (id) =>
  sources
    .filter(([, text]) => text.includes(`"${id}"`))
    .map(([p]) => p.replaceAll("\\", "/").replace(/^src\//, ""))
    .join("، ") || "غير مستخدمة بعد";

const WHY = {
  "client-visible": "يظهر فيها شعار عميل أو اسمه: هل نعرضها؟ (السؤال 4)",
  faces: "تظهر فيها وجوه يمكن التعرف عليها: هل لدينا الإذن؟",
};
const SOURCE = { "rand-profile": "الملف التعريفي", rand: "من NO TIME", stock: "ستوك (Unsplash)", ai: "مولّدة" };

const rows = [];
for (const m of MEDIA.filter((e) => e.replace || e.randApproval)) {
  const thumb = `${THUMBS}/${m.id}.webp`;
  await sharp(path.join("public", m.file)).resize({ width: 240 }).webp({ quality: 60 }).toFile(thumb);
  const why = [m.randApproval && WHY[m.randApproval], m.replace && "صورة مؤقتة: نحتاج صورة حقيقية من أعمالكم لهذا المشهد"].filter(Boolean).join(" · ");
  rows.push(`| ![](images-for-rand/${m.id}.webp) | \`${m.id}\`${m.hidden ? " (مخفية)" : ""} | ${SOURCE[m.source]} | ${why} | ${m.spec} | ${usedIn(m.id)} |`);
}

const doc = `# صور تحتاج مراجعة راند

يُولَّد هذا الملف من سجل الصور (\`src/content/media.ts\`) بالأمر \`node --no-warnings --import ./scripts/lib/alias.mjs scripts/images-for-rand.mjs\`. لا تعدّلوه يدويًا.

**ما المطلوب من راند:** لكل صورة: «نعم، تُعرض» أو «لا، تُخفى». والصور المؤقتة: إرسال صورة حقيقية من أعمالكم بالمواصفة المكتوبة، إن وُجدت.

**كيف نخفي صورة:** سطر واحد في \`src/content/media.ts\`: \`hidden: true\`. يختفي المشهد أو الصورة من كل الصفحات دون فراغ.

## الصور (${rows.length})

| الصورة | المعرّف | المصدر | لماذا تحتاج المراجعة | المواصفة | أين تظهر |
|---|---|---|---|---|---|
${rows.join("\n")}

## ملفات نحتاجها من راند

| ما نحتاجه | لماذا | أين سيظهر |
|---|---|---|
${WANTED.map((w) => `| ${w.what} | ${w.why} | ${w.where} |`).join("\n")}
`;
await writeFile(OUT, doc);
console.log(`${rows.length} images, ${WANTED.length} wanted → ${OUT}`);
