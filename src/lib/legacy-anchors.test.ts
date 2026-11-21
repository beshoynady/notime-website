import { describe, expect, it } from "vitest";
import { services } from "@/content/services";
import { parseServiceParam } from "@/lib/forms/service-param";
import { currentAnchor, LEGACY_ANCHORS } from "./legacy-anchors";

describe("legacy anchors (D123: print-store became print-ordering)", () => {
  it("maps the old print anchor to the new one and leaves every other id alone", () => {
    expect(currentAnchor("print-store")).toBe("print-ordering");
    expect(currentAnchor("print-ordering")).toBe("print-ordering");
    expect(currentAnchor("gifts")).toBe("gifts");
    expect(currentAnchor("")).toBe("");
  });

  it("points only at anchors that exist, and never shadows a live one", () => {
    const live = new Set(services.map((s) => s.anchor));
    for (const [from, to] of Object.entries(LEGACY_ANCHORS)) {
      expect(live.has(to), to).toBe(true);
      expect(live.has(from), from).toBe(false);
    }
  });

  it("keeps an old ?service=print-store link working on the brief", () => {
    expect(parseServiceParam("print-store")).toBe("print-ordering");
    expect(parseServiceParam("print-ordering")).toBe("print-ordering");
  });
});
