import { describe, expect, it } from "vitest";
import { renderLinksPage, type LinksPageData } from "./links-page";

const base: LinksPageData = {
  locale: "en",
  dir: "ltr",
  title: "Links · NO TIME Creative House",
  description: "One tap to the team.",
  alternates: { en: "https://notimehub.com/en/links", ar: "https://notimehub.com/ar/links" },
  fontPreloads: ["/fonts/montserrat-latin.v1.woff2"],
  fontFaces: "@font-face{font-family:Montserrat}",
  logo: { src: "/images/brand/logo/logo-dark-bg-wordmark.svg", alt: "NO TIME Creative House", homeHref: "/en", homeLabel: "Home" },
  lang: { href: "/ar/links", locale: "ar", label: "ع", name: "العربية" },
  eyebrow: "Dubai",
  heading: "It's time to start.",
  lead: "Events, production, marketing.",
  listLabel: "Quick links",
  rows: [
    { href: "/en/contact", title: "Request a quote", note: "We reply within one working day", primary: true },
    { href: "/en/work", title: "See our work", note: "Pavilions" },
  ],
  email: { label: "Or write to us", address: "info@notimehub.com" },
  legal: { label: "Legal", links: [{ href: "/en/privacy", label: "Privacy Policy" }] },
  leadSource: null,
  review: null,
};

describe("renderLinksPage (decision #36)", () => {
  it("is a complete, noindex document with no framework script", () => {
    const html = renderLinksPage(base);
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<html lang="en" dir="ltr">');
    expect(html).toContain('<meta name="robots" content="noindex, follow">');
    expect(html).toContain('hreflang="ar" href="https://notimehub.com/ar/links"');
    expect(html).not.toContain("_next/");
    expect(html).toContain('<h1 id="lk-title" class="lk-title">It&#39;s time to start.</h1>');
  });
  it("renders the rows in order, the primary one marked, and the email", () => {
    const html = renderLinksPage(base);
    expect(html.indexOf("Request a quote")).toBeLessThan(html.indexOf("See our work"));
    expect(html).toMatch(/<a href="\/en\/contact" class="lk-row" data-primary>/);
    expect(html).toContain('href="mailto:info@notimehub.com"');
  });
  it("opens a WhatsApp row in a new tab, with its icon", () => {
    const html = renderLinksPage({ ...base, rows: [{ href: "https://wa.me/971500000000?text=Hi", title: "WhatsApp", note: "Fast", primary: true, external: true, icon: "whatsapp" }, ...base.rows] });
    expect(html).toContain('<a href="https://wa.me/971500000000?text=Hi" class="lk-row" data-primary target="_blank" rel="noopener noreferrer">');
    expect(html).toContain('class="lk-icon"');
  });
  it("escapes every text and attribute", () => {
    const html = renderLinksPage({ ...base, heading: '<script>alert("x")</script>', rows: [{ href: '/en/x?a="b"&c', title: "A & B", note: "<i>" }] });
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).toContain('href="/en/x?a=&quot;b&quot;&amp;c"');
    expect(html).toContain("A &amp; B");
  });
  it("stores the lead source like every other page: first touch, a tagged visit replaces it", () => {
    const html = renderLinksPage({ ...base, leadSource: { json: '{"utm_source":"instagram","landing":"/en/links"}', tagged: true } });
    expect(html).toContain('sessionStorage');
    expect(html).toContain('"nt-lead"');
    expect(html).toContain("||true)");
    const untagged = renderLinksPage({ ...base, leadSource: { json: '{"landing":"/en/links"}', tagged: false } });
    expect(untagged).toContain("||false)");
  });
  it("can't be broken out of by a stored value", () => {
    const html = renderLinksPage({ ...base, leadSource: { json: '{"utm_source":"</script><script>x()</script>"}', tagged: true } });
    expect(html).not.toContain("</script><script>x()");
    expect(html).toContain("\\u003c/script>");
  });
  it("shows the review banner only on the review build", () => {
    expect(renderLinksPage(base)).not.toContain('class="review-banner"');
    expect(renderLinksPage({ ...base, review: "Review version – not public" })).toContain('class="review-banner"');
  });
});
