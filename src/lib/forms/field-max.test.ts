import { describe, expect, it } from "vitest";
import { fieldMax } from "./field-max";
import { consultationSchema, contactSchema, interestSchema, websiteReviewSchema } from "./schemas";

describe("fieldMax (owner rule 7: the tooLong message names the limit)", () => {
  it("reads each field's limit from the form's own schema", () => {
    expect(fieldMax(contactSchema, "message")).toBe(3000);
    expect(fieldMax(consultationSchema, "message")).toBe(2000);
    expect(fieldMax(websiteReviewSchema, "message")).toBe(2000);
    expect(fieldMax(interestSchema, "message")).toBe(1000);
    expect(fieldMax(contactSchema, "name")).toBe(100);
    expect(fieldMax(contactSchema, "company")).toBe(120);
    expect(fieldMax(contactSchema, "city")).toBe(80);
  });

  it("is undefined for a field with no limit, or no such field", () => {
    expect(fieldMax(contactSchema, "guests")).toBeUndefined();
    expect(fieldMax(contactSchema, "nope")).toBeUndefined();
  });
});
