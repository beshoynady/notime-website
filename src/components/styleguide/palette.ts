export type SwatchKey = "espresso" | "cocoa" | "taupe" | "champagne" | "ivory";

/** The five brand tones (CLAUDE.md palette) and the text colour used on each chip. */
export const SWATCHES: ReadonlyArray<{ key: SwatchKey; hex: string; ink: string }> = [
  { key: "espresso", hex: "#2E2017", ink: "#F5E9D3" },
  { key: "cocoa", hex: "#634731", ink: "#F5E9D3" },
  { key: "taupe", hex: "#BB9A79", ink: "#2E2017" },
  { key: "champagne", hex: "#EAD4AB", ink: "#2E2017" },
  { key: "ivory", hex: "#F5E9D3", ink: "#2E2017" },
];

export const hexOf = (k: SwatchKey) => SWATCHES.find((s) => s.key === k)!.hex;
