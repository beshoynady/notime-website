/**
 * Pixel size from the first bytes of a WebP or AVIF file (the first 4 KB are enough).
 * Used by the content test instead of sharp: no native module load and no full-file decode,
 * so its run time doesn't depend on cold caches or antivirus scans (2026-11-08, see
 * docs/e2e-flakes.md).
 */
export function imageSize(b: Uint8Array): { width: number; height: number } | null {
  const ascii = (at: number, s: string) => [...s].every((c, i) => b[at + i] === c.charCodeAt(0));
  const le16 = (at: number) => b[at] | (b[at + 1] << 8);
  const le24 = (at: number) => b[at] | (b[at + 1] << 8) | (b[at + 2] << 16);
  const be32 = (at: number) => ((b[at] << 24) | (b[at + 1] << 16) | (b[at + 2] << 8) | b[at + 3]) >>> 0;

  if (b.length >= 16 && ascii(0, "RIFF") && ascii(8, "WEBP")) {
    if (ascii(12, "VP8 ") && b.length >= 30) return { width: le16(26) & 0x3fff, height: le16(28) & 0x3fff };
    if (ascii(12, "VP8L") && b.length >= 25 && b[20] === 0x2f) {
      const v = (b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24)) >>> 0;
      return { width: (v & 0x3fff) + 1, height: ((v >>> 14) & 0x3fff) + 1 };
    }
    if (ascii(12, "VP8X") && b.length >= 30) return { width: le24(24) + 1, height: le24(27) + 1 };
    return null;
  }
  // AVIF (ISO BMFF): the first image spatial extents box ("ispe") is the primary image.
  if (b.length >= 12 && ascii(4, "ftyp")) {
    for (let i = 8; i + 16 <= b.length; i++) {
      if (ascii(i, "ispe")) return { width: be32(i + 8), height: be32(i + 12) };
    }
  }
  return null;
}
