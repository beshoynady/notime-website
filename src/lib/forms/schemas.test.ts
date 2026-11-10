import { describe, expect, it } from "vitest";
import { consultationSchema, fieldErrors, interestSchema, websiteReviewSchema } from "./schemas";

const errs = (r: { success: boolean; error?: unknown }) =>
  r.success ? {} : fieldErrors(r.error as Parameters<typeof fieldErrors>[0]);

describe("consultation", () => {
  const ok = { build: "websites", timeline: "flexible", name: "Sara", email: "sara@example.com" };
  it("accepts the minimum and defaults the optional fields", () => {
    const r = consultationSchema.safeParse(ok);
    expect(r.success).toBe(true);
    expect(r.data).toMatchObject({ budget: "", websiteUrl: "", tier: "", phone: "", message: "" });
  });
  it("returns a code per field", () => {
    expect(errs(consultationSchema.safeParse({}))).toMatchObject({ build: "required", timeline: "required", name: "required", email: "required" });
    expect(errs(consultationSchema.safeParse({ ...ok, email: "nope" }))).toEqual({ email: "email" });
    expect(errs(consultationSchema.safeParse({ ...ok, phone: "abc" }))).toEqual({ phone: "phone" });
    expect(errs(consultationSchema.safeParse({ ...ok, message: "x".repeat(2001) }))).toEqual({ message: "tooLong" });
  });
  it("normalises a bare domain and rejects a non-address", () => {
    expect(consultationSchema.parse({ ...ok, websiteUrl: "example.ae" }).websiteUrl).toBe("https://example.ae");
    expect(errs(consultationSchema.safeParse({ ...ok, websiteUrl: "not a site" }))).toEqual({ websiteUrl: "url" });
  });
  it("takes a tier preset", () => {
    expect(consultationSchema.parse({ ...ok, tier: "grow" }).tier).toBe("grow");
    expect(errs(consultationSchema.safeParse({ ...ok, tier: "gold" }))).toEqual({ tier: "invalid" });
  });
});

describe("website review", () => {
  const ok = { websiteUrl: "https://example.com", name: "Omar", contact: "omar@example.com", goal: "speed" };
  it("requires the site, accepts an email or a phone as the contact", () => {
    expect(websiteReviewSchema.safeParse(ok).success).toBe(true);
    expect(websiteReviewSchema.safeParse({ ...ok, contact: "+971 50 123 4567" }).success).toBe(true);
    expect(errs(websiteReviewSchema.safeParse({ ...ok, contact: "hello" }))).toEqual({ contact: "contact" });
    expect(errs(websiteReviewSchema.safeParse({ ...ok, websiteUrl: "" }))).toEqual({ websiteUrl: "required" });
    expect(errs(websiteReviewSchema.safeParse({ ...ok, goal: undefined }))).toEqual({ goal: "required" });
  });
});

describe("register interest", () => {
  it("takes the two products only", () => {
    const ok = { product: "peak-hour", name: "Lina", email: "lina@example.com" };
    expect(interestSchema.safeParse(ok).success).toBe(true);
    expect(errs(interestSchema.safeParse({ ...ok, product: "other" }))).toEqual({ product: "invalid" });
  });
});
