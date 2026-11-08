import { describe, expect, it } from "vitest";
import { getCategories, getCategory, getServices, type Category } from "@/content";
import { categoryJsonLd, overviewJsonLd } from "./jsonld";

const SITE = "https://x.test";
const events = getCategory("events-hospitality")!;
// Round-trips through JSON: proves the node serializes, and reads it back as plain data.
const byType = (nodes: object[], type: string) => {
  const node = nodes.find((n) => (n as { "@type": string })["@type"] === type);
  return node && JSON.parse(JSON.stringify(node));
};

describe("categoryJsonLd", () => {
  it("lists the six services with anchor @ids and the organization as provider", () => {
    const list = byType(categoryJsonLd(events, getServices("events-hospitality"), "en", SITE), "ItemList");
    expect(list.itemListElement).toHaveLength(6);
    const first = list.itemListElement[0];
    expect(first.position).toBe(1);
    expect(first.item["@type"]).toBe("Service");
    expect(first.item["@id"]).toBe("https://x.test/en/services/events-hospitality#conferences");
    expect(first.item.url).toBe("https://x.test/en/services/events-hospitality#conferences");
    expect(first.item.name).toBe("Conferences & summits");
    expect(first.item.provider["@id"]).toBe("https://x.test/#organization");
  });

  it("uses the locale for names and URLs", () => {
    const list = byType(categoryJsonLd(events, getServices("events-hospitality"), "ar", SITE), "ItemList");
    expect(list.itemListElement[0].item.name).toBe("المؤتمرات والقمم");
    expect(list.itemListElement[0].item["@id"]).toBe("https://x.test/ar/services/events-hospitality#conferences");
  });

  it("builds the breadcrumb Home › Services › Category in both locales", () => {
    const names = (l: "en" | "ar") =>
      byType(categoryJsonLd(events, getServices("events-hospitality"), l, SITE), "BreadcrumbList").itemListElement.map(
        (e: { name: string }) => e.name,
      );
    expect(names("en")).toEqual(["Home", "Services", "Events & Hospitality"]);
    expect(names("ar")).toEqual(["الرئيسية", "الخدمات", "الفعاليات والضيافة"]);
  });

  it("puts only written FAQ entries in FAQPage, and omits it while all are placeholders", () => {
    const written: Category = {
      ...events,
      faq: [
        { q: { en: "How do we start?", ar: "كيف نبدأ؟" }, a: { en: "With the brief.", ar: "بالموجز." } },
        { q: { en: "TODO: question 2", ar: "TODO: السؤال 2" }, a: { en: "TODO: answer 2", ar: "TODO: الإجابة 2" } },
      ],
    };
    const faq = byType(categoryJsonLd(written, getServices("events-hospitality"), "en", SITE), "FAQPage");
    expect(faq.mainEntity).toEqual([
      { "@type": "Question", name: "How do we start?", acceptedAnswer: { "@type": "Answer", text: "With the brief." } },
    ]);
    // Today every FAQ is a TODO placeholder: no FAQPage at all.
    expect(byType(categoryJsonLd(events, getServices("events-hospitality"), "en", SITE), "FAQPage")).toBeUndefined();
  });

  it("claims nothing unconfirmed: no ratings, reviews, area served or prices", () => {
    const text = JSON.stringify(categoryJsonLd(events, getServices("events-hospitality"), "en", SITE));
    for (const key of ["aggregateRating", "review", "areaServed", "offers", "price"]) expect(text).not.toContain(`"${key}"`);
  });
});

describe("overviewJsonLd", () => {
  it("lists the five category pages", () => {
    const list = byType(overviewJsonLd(getCategories(), "en", SITE), "ItemList");
    expect(list.itemListElement.map((e: { url: string }) => e.url)).toEqual(
      getCategories().map((c) => `https://x.test/en/services/${c.slug}`),
    );
  });
});
