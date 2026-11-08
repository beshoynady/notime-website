import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/** scripts/grade.mjs end to end on a generated cutout: native size, alpha kept, no upscaling. */
// Read through buffers with the cache off: on Windows sharp keeps input files open, which would
// block the temp folder's removal.
sharp.cache(false);
const SCRIPT = path.join(process.cwd(), "scripts", "grade.mjs");
let dir: string;

const run = (...args: string[]) => execFileSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", stdio: "pipe" });

beforeAll(async () => {
  dir = mkdtempSync(path.join(tmpdir(), "grade-"));
  // A 64 × 40 grey square on a transparent ground: a stand-in cutout.
  await sharp({ create: { width: 64, height: 40, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: { create: { width: 32, height: 20, channels: 4, background: { r: 128, g: 128, b: 128, alpha: 1 } } }, left: 16, top: 10 }])
    .png()
    .toFile(path.join(dir, "cutout.png"));
});

afterAll(() => rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }));

describe("scripts/grade.mjs", () => {
  it("writes AVIF and WebP at native size, keeps alpha, warms the grey, and reports bytes", async () => {
    const out = path.join(dir, "out");
    const log = run("events-hospitality", path.join(dir, "cutout.png"), out);
    for (const ext of ["avif", "webp"]) {
      const file = path.join(out, `cutout.${ext}`);
      const meta = await sharp(readFileSync(file)).metadata();
      expect([meta.width, meta.height, meta.hasAlpha], ext).toEqual([64, 40, true]);
    }
    const { data } = await sharp(readFileSync(path.join(out, "cutout.webp"))).raw().toBuffer({ resolveWithObject: true });
    const corner = [...data.subarray(0, 4)];
    expect(corner[3], "transparent corner stays transparent").toBe(0);
    const mid = (20 * 64 + 32) * 4;
    const [r, g, b] = data.subarray(mid, mid + 3);
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
    expect(log).toMatch(/cutout\.avif\s+64 × 40\s+\d+(\.\d)? KB/);
    expect(log).toMatch(/total webp\s+\d+(\.\d)? KB/);
  });

  it("refuses to upscale", () => {
    expect(() => run("events-hospitality", path.join(dir, "cutout.png"), path.join(dir, "big"), "--width", "128")).toThrow(/refusing to upscale/);
  });

  it("refuses a category without a grade", () => {
    expect(() => run("software-digital", path.join(dir, "cutout.png"), path.join(dir, "x"))).toThrow(/no grade for software-digital/);
  });
});
