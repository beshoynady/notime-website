import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { consultationSchema, contactSchema, fieldErrors, interestSchema, websiteReviewSchema } from "./schemas";

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
    const ok = { product: "smart-menu", name: "Lina", email: "lina@example.com" };
    expect(interestSchema.safeParse(ok).success).toBe(true);
    expect(errs(interestSchema.safeParse({ ...ok, product: "other" }))).toEqual({ product: "invalid" });
  });
});

describe("contact · event fields", () => {
  const ok = { name: "Sara", email: "sara@example.com", message: "An event." };
  const at = (v: Record<string, string>) => contactSchema.safeParse({ ...ok, ...v });
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-17"));
  });
  afterEach(() => vi.useRealTimers());

  it("defaults both to empty", () => {
    expect(at({}).data).toMatchObject({ eventMonth: "", guests: "" });
  });
  it("accepts a month from last month to three years ahead", () => {
    expect(at({ eventMonth: "2026-10" }).success).toBe(true);
    expect(at({ eventMonth: "2029-12" }).success).toBe(true);
  });
  it("rejects a month out of range or malformed", () => {
    for (const m of ["2026-09", "2030-01", "2026-13"]) expect(errs(at({ eventMonth: m }))).toEqual({ eventMonth: "invalid" });
  });
  it("accepts a guest band and rejects anything else", () => {
    expect(at({ guests: "150-500" }).success).toBe(true);
    expect(errs(at({ guests: "lots" }))).toEqual({ guests: "invalid" });
  });
});

describe("phone fields in E.164 (D124)", () => {
  const consult = { build: "websites", timeline: "flexible", name: "Sara", email: "sara@example.com" };
  const brief = { name: "Sara", email: "sara@example.com", message: "A launch." };
  it("stores the brief's and the intro call's phone in E.164", () => {
    expect(contactSchema.parse({ ...brief, phone: "00971 50 123 4567" }).phone).toBe("+971501234567");
    expect(consultationSchema.parse({ ...consult, phone: "(+966) 51-234-5678" }).phone).toBe("+966512345678");
  });
  it("asks for the country code on a leading 0, and says 'phone' for garbage", () => {
    expect(errs(contactSchema.safeParse({ ...brief, phone: "0501234567" }))).toEqual({ phone: "phoneCode" });
    expect(errs(consultationSchema.safeParse({ ...consult, phone: "call me" }))).toEqual({ phone: "phone" });
  });
  it("the review's 'Email or WhatsApp' takes an email as it is, and a number by the same rules", () => {
    const ok = { websiteUrl: "https://example.com", name: "Omar", goal: "speed" };
    expect(websiteReviewSchema.parse({ ...ok, contact: "omar@example.com" }).contact).toBe("omar@example.com");
    expect(websiteReviewSchema.parse({ ...ok, contact: "+971 50 123 4567" }).contact).toBe("+971501234567");
    expect(errs(websiteReviewSchema.safeParse({ ...ok, contact: "050 123 4567" }))).toEqual({ contact: "phoneCode" });
    expect(errs(websiteReviewSchema.safeParse({ ...ok, contact: "omar@" }))).toEqual({ contact: "contact" });
  });
});
