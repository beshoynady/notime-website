import { describe, expect, it } from "vitest";
import { ctaBarFor } from "./cta-bar";

describe("ctaBarFor", () => {
  it("has no shared bar on /contact or Software's page", () => {
    expect(ctaBarFor("/contact")).toBeNull();
    expect(ctaBarFor("/services/software-digital")).toBeNull();
  });
  it("carries the category hint on a category page", () => {
    expect(ctaBarFor("/services/events-hospitality")).toEqual({ quoteHref: "/contact?category=events-hospitality" });
    expect(ctaBarFor("/services/marketing-brand")).toEqual({ quoteHref: "/contact?category=marketing-brand" });
  });
  it("has no hint for an unknown slug or any other page", () => {
    expect(ctaBarFor("/services/nope")).toEqual({ quoteHref: "/contact" });
    expect(ctaBarFor("/")).toEqual({ quoteHref: "/contact" });
    expect(ctaBarFor("/work")).toEqual({ quoteHref: "/contact" });
  });
});
