import { describe, expect, it } from "vitest";
import { eventFieldsVisible } from "./event-visibility";

describe("eventFieldsVisible (client rule, same as showEventFields)", () => {
  it("shows for an events service", () => {
    expect(eventFieldsVisible({ service: "conferences", serviceIsEvents: true, category: "" })).toBe(true);
  });
  it("shows for the events category hint when no service is chosen", () => {
    expect(eventFieldsVisible({ service: "", serviceIsEvents: false, category: "events-hospitality" })).toBe(true);
  });
  it("hides with no service and no hint, or another hint", () => {
    expect(eventFieldsVisible({ service: "", serviceIsEvents: false, category: "" })).toBe(false);
    expect(eventFieldsVisible({ service: "", serviceIsEvents: false, category: "marketing-brand" })).toBe(false);
  });
  it("lets a chosen non-events service win over the hint", () => {
    expect(eventFieldsVisible({ service: "branding", serviceIsEvents: false, category: "events-hospitality" })).toBe(false);
  });
});
