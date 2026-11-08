import { describe, expect, it } from "vitest";
import { getServiceByAnchor } from "./index";
import { categoryHref, quoteHref, serviceHref } from "./index";

describe("links (D57)", () => {
  it("builds locale-less hrefs for next-intl's Link", () => {
    expect(categoryHref("software-digital")).toBe("/services/software-digital");
    expect(serviceHref(getServiceByAnchor("conferences")!)).toBe("/services/events-hospitality#conferences");
    expect(quoteHref(getServiceByAnchor("gifts")!)).toBe("/services/production-print-gifts?service=gifts#quote");
  });

  it("finds services by anchor", () => {
    expect(getServiceByAnchor("pr")?.slug).toBe("public-relations");
    expect(getServiceByAnchor("nope")).toBeUndefined();
  });
});
