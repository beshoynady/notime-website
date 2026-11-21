import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FONT_FACE_CSS } from "./font-faces";

describe("FONT_FACE_CSS", () => {
  it("matches the @font-face rules in src/app/fonts.css", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/fonts.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const faces = (css.match(/@font-face\s*\{[^}]*\}/g) ?? [])
      .map((f) => f.replace(/\s+/g, " ").replace(/\s*([{};:,])\s*/g, "$1").trim())
      .join("");
    expect(FONT_FACE_CSS).toBe(faces);
  });
});
