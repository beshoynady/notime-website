import { describe, expect, it } from "vitest";
import { isEventsService, keepEventFields, monthOptions, showEventFields } from "./event-fields";

describe("event fields rules", () => {
  it("knows an events service", () => {
    expect(isEventsService("conferences")).toBe(true);
    expect(isEventsService("branding")).toBe(false);
    expect(isEventsService("nope")).toBe(false);
  });
  it("shows the fields for an events service, or for the events category with no service", () => {
    expect(showEventFields({ service: "conferences", category: "" })).toBe(true);
    expect(showEventFields({ service: "", category: "events-hospitality" })).toBe(true);
    expect(showEventFields({ service: "", category: "" })).toBe(false);
  });
  it("lets the service win over the category hint", () => {
    expect(showEventFields({ service: "branding", category: "events-hospitality" })).toBe(false);
  });
  it("keeps the fields on the server for an events service or no service only", () => {
    expect(keepEventFields("branding")).toBe(false);
    expect(keepEventFields("")).toBe(true);
    expect(keepEventFields("conferences")).toBe(true);
  });
});

describe("monthOptions", () => {
  it("starts at the current month and lists 24", () => {
    const o = monthOptions(new Date("2026-11-17"), "en");
    expect(o[0]).toEqual({ value: "2026-11", label: "November 2026" });
    expect(o).toHaveLength(24);
    expect(o[2].value).toBe("2027-01");
    expect(o[23].value).toBe("2028-10");
  });
  it("labels Arabic months with Latin digits", () => {
    const label = monthOptions(new Date("2026-11-17"), "ar")[0].label;
    expect(label).toContain("2026");
    expect(label).toContain("نوفمبر");
  });
});
