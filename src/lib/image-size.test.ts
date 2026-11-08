import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { imageSize } from "./image-size";

const bytes = (...parts: (string | number[])[]) =>
  Uint8Array.from(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)));
const le32 = (n: number) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];
const be32 = (n: number) => [(n >>> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255];

describe("imageSize", () => {
  it("reads lossy WebP (VP8)", () => {
    // RIFF header, VP8 chunk, 3-byte frame tag, start code 9d 01 2a, 14-bit width and height.
    const buf = bytes("RIFF", le32(100), "WEBP", "VP8 ", le32(80), [0, 0, 0], [0x9d, 0x01, 0x2a], [0x70, 0x04], [0xb0, 0x05]);
    expect(imageSize(buf)).toEqual({ width: 1136, height: 1456 });
  });
  it("reads lossless WebP (VP8L)", () => {
    // Signature 0x2f, then (width-1) in 14 bits and (height-1) in 14 bits, little-endian.
    const w = 640 - 1;
    const h = 480 - 1;
    const v = w | (h << 14);
    const buf = bytes("RIFF", le32(100), "WEBP", "VP8L", le32(80), [0x2f], le32(v));
    expect(imageSize(buf)).toEqual({ width: 640, height: 480 });
  });
  it("reads extended WebP (VP8X)", () => {
    const buf = bytes("RIFF", le32(100), "WEBP", "VP8X", le32(10), [0, 0, 0, 0], [0x8f, 0x06, 0x00], [0xaf, 0x03, 0x00]);
    expect(imageSize(buf)).toEqual({ width: 1680, height: 944 });
  });
  it("reads AVIF from the first ispe box", () => {
    const buf = bytes(be32(24), "ftyp", "avif", be32(0), "mif1", "avif", be32(20), "ispe", be32(0), be32(944), be32(1680));
    expect(imageSize(buf)).toEqual({ width: 944, height: 1680 });
  });
  it("returns null for anything else", () => {
    expect(imageSize(bytes("GIF89a"))).toBeNull();
    expect(imageSize(new Uint8Array(0))).toBeNull();
    expect(imageSize(bytes("RIFF", le32(4), "WAVE"))).toBeNull();
  });

  // Cross-check against every image the site ships: the header must agree with the size
  // recorded when the file was converted (scripts/convert-ai.mjs printed sharp's metadata).
  it("finds a size in the header of every shipped WebP and AVIF", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = path.join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(webp|avif)$/.test(f)) files.push(p);
      }
    };
    walk(path.join("public", "images"));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(imageSize(readFileSync(f).subarray(0, 4096)), f).not.toBeNull();
  });
});
