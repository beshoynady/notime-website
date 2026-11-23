import { describe, expect, it } from "vitest";
import { formatTimecode } from "./time";

describe("formatTimecode (24 fps)", () => {
  it("starts at zero", () => expect(formatTimecode(0)).toBe("TC 00:00:00:00"));
  it("formats minutes, seconds and frames", () => expect(formatTimecode(61_500)).toBe("TC 00:01:01:12"));
  it("rolls into hours", () => expect(formatTimecode(3_600_000)).toBe("TC 01:00:00:00"));
  it("keeps the last frame of a second", () => expect(formatTimecode(999)).toBe("TC 00:00:00:23"));
  it("supports other frame rates", () => expect(formatTimecode(500, 30)).toBe("TC 00:00:00:15"));
  it("never goes negative", () => expect(formatTimecode(-50)).toBe("TC 00:00:00:00"));
});
