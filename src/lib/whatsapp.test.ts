import { describe, expect, it } from "vitest";
import { whatsappHref } from "./whatsapp";

// The number below is a test fixture only — never site data.
const FIXTURE = "+971 50 123 4567";

describe("whatsappHref", () => {
  it("returns null while the number is empty (button shows 'number pending')", () => {
    expect(whatsappHref("", "Hi")).toBeNull();
    expect(whatsappHref("   ")).toBeNull();
  });

  it("strips formatting and builds a wa.me link", () => {
    expect(whatsappHref(FIXTURE)).toBe("https://wa.me/971501234567");
  });

  it("encodes the prefilled message", () => {
    expect(whatsappHref(FIXTURE, "Hi")).toBe("https://wa.me/971501234567?text=Hi");
    expect(whatsappHref(FIXTURE, "مرحبًا NO TIME، مشروع")).toBe(
      "https://wa.me/971501234567?text=" + encodeURIComponent("مرحبًا NO TIME، مشروع"),
    );
  });

  it("rejects values that are not phone numbers", () => {
    expect(whatsappHref("not-a-number")).toBeNull();
    expect(whatsappHref("+12")).toBeNull();
  });
});
