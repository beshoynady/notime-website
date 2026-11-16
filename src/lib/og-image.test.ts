import { describe, expect, it, vi } from "vitest";

// The module reads its fonts at load; the pure helpers don't need them.
vi.mock("node:fs/promises", () => ({ readFile: async () => Buffer.alloc(0) }));
const { clipLine, ogText, visualWord } = await import("./og-image");

describe("share image text (D103)", () => {
  it("keeps a Latin word inside Arabic in order, its punctuation on the visual left", () => {
    expect(visualWord("QR")).toBe("QR");
    expect(visualWord("QR،")).toBe("،QR");
    expect(visualWord("Minute.")).toBe(".Minute");
  });
  it("clips at a word, with an ellipsis, only past the limit", () => {
    expect(clipLine("short line")).toBe("short line");
    expect(clipLine("one two three four", 12)).toBe("one two…");
  });
  it("reads a message by its dotted key, and fails loudly on a missing one", () => {
    expect(ogText("en", "aboutPage.metaTitle")).toBeTruthy();
    expect(ogText("ar", "contactPage.metaTitle")).not.toBe(ogText("en", "contactPage.metaTitle"));
    expect(() => ogText("en", "nope.nothing")).toThrow();
  });
});
