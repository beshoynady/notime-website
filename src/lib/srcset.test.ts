import { describe, expect, it } from "vitest";
import { capSrcSet } from "./srcset";

const u = (w: number) => `/_next/image?url=%2Fimages%2Fai%2Fx.webp&w=${w}&q=75`;
const set = (...ws: number[]) => ws.map((w) => `${u(w)} ${w}w`).join(", ");

describe("capSrcSet (D51: never request more pixels than the file has)", () => {
  it("drops candidates wider than the native width", () => {
    expect(capSrcSet(set(640, 1080, 1136, 1200, 1920, 3840), 1136)).toBe(set(640, 1080, 1136));
  });

  it("keeps the largest candidate below native when native itself is not a candidate", () => {
    expect(capSrcSet(set(640, 1080, 1200, 1920), 1247)).toBe(set(640, 1080, 1200));
  });

  it("keeps the smallest candidate when every candidate is wider than native", () => {
    expect(capSrcSet(set(640, 750), 537)).toBe(set(640));
  });

  it("leaves the set alone when no native width is known", () => {
    expect(capSrcSet(set(640, 3840), undefined)).toBe(set(640, 3840));
  });

  it("passes through empty or density-descriptor sets", () => {
    expect(capSrcSet(undefined, 1136)).toBeUndefined();
    expect(capSrcSet("", 1136)).toBe("");
    expect(capSrcSet(`${u(1080)} 1x, ${u(2048)} 2x`, 1136)).toBe(`${u(1080)} 1x, ${u(2048)} 2x`);
  });
});
