import { describe, expect, it } from "vitest";
import { parseCategoryParam, parseServiceParam } from "./service-param";

describe("parseServiceParam", () => {
  it("keeps a real anchor", () => expect(parseServiceParam("apps")).toBe("apps"));
  it("drops unknown, empty, script and over-long values", () => {
    for (const v of ["nope", "", null, undefined, "<script>alert(1)</script>", "apps\"><b>", "a".repeat(61)]) expect(parseServiceParam(v)).toBe("");
  });
  it("limits to the anchors a form offers", () => {
    expect(parseServiceParam("gifts", ["apps", "websites"])).toBe("");
    expect(parseServiceParam("apps", ["apps", "websites"])).toBe("apps");
  });
});

describe("parseCategoryParam", () => {
  it("keeps a real category slug", () => expect(parseCategoryParam("events-hospitality")).toBe("events-hospitality"));
  it("drops unknown, script, over-long and missing values", () => {
    for (const v of ["<script>", "nope", "a".repeat(61), null, undefined, ""]) expect(parseCategoryParam(v)).toBe("");
  });
});
