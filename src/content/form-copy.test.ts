import { describe, expect, it } from "vitest";
import { errorMessages, errorText, fill, formCopy, minutesLabel, requiredMessages } from "./form-copy";

describe("minutesLabel (M3)", () => {
  it("agrees the Arabic noun with the number", () => {
    expect([1, 2, 3, 9, 10, 11, 15].map((n) => minutesLabel(n, "ar"))).toEqual(["دقيقة واحدة", "دقيقتين", "3 دقائق", "9 دقائق", "10 دقائق", "11 دقيقة", "15 دقيقة"]);
    expect(minutesLabel(9, "en")).toBe("9");
  });
  it("reads in the rate-limit sentence", () => {
    expect(fill(formCopy.states.rateLimited.ar, { minutes: minutesLabel(9, "ar"), email: "x" })).toContain("بعد 9 دقائق،");
  });
});

describe("N15 privacy line", () => {
  it("privacy line is the short one", () => {
    expect(formCopy.privacy.text.en).toBe("We use your details only to reply to you.");
    expect(formCopy.privacy.text.ar).toBe("نستخدم بياناتكم للرد عليكم فقط.");
  });
});

describe("errorText (owner rule 7)", () => {
  it("names the limit in the tooLong message, in both languages", () => {
    expect(errorText("message", "tooLong", "en", 3000)).toBe("Keep it under 3,000 characters.");
    expect(errorText("name", "tooLong", "ar", 100)).toBe("الحد الأقصى لعدد الأحرف: 100");
  });
  it("never shows a raw {max}: with no limit known it falls back to the generic line", () => {
    expect(errorText("message", "tooLong", "en")).toBe(errorMessages.invalid.en);
  });
  it("keeps a field's own required line, and the code's message otherwise", () => {
    expect(errorText("name", "required", "en")).toBe(requiredMessages.name.en);
    expect(errorText("city", "required", "ar")).toBe(errorMessages.required.ar);
    expect(errorText("email", "email", "en")).toBe(errorMessages.email.en);
  });
});
