import { describe, expect, it } from "vitest";
import { fill, formCopy, minutesLabel } from "./form-copy";

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
