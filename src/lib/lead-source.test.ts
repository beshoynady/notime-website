import { describe, expect, it } from "vitest";
import { captureLeadSource, leadRows, parseLeadSource, serializeLeadSource } from "./lead-source";

const HOST = "notimehub.com";

describe("captureLeadSource", () => {
  it("records the UTM tags, the external referrer's host and the landing path", () => {
    const lead = captureLeadSource({
      url: "https://notimehub.com/ar/services/events-hospitality?utm_source=instagram&utm_medium=social&utm_campaign=eid-2027#celebrations",
      referrer: "https://l.instagram.com/?u=x",
      host: HOST,
      existing: null,
    });
    expect(lead).toEqual({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "eid-2027",
      referrer: "l.instagram.com",
      landing: "/ar/services/events-hospitality",
    });
  });

  it("keeps the first touch of the session when the next page has no tags", () => {
    const first = captureLeadSource({ url: "https://notimehub.com/en?utm_source=google&utm_medium=cpc", referrer: "", host: HOST, existing: null });
    const next = captureLeadSource({ url: "https://notimehub.com/en/contact", referrer: "https://notimehub.com/en", host: HOST, existing: first });
    expect(next).toEqual(first);
  });

  it("lets a new tagged visit in the same session replace the first touch", () => {
    const first = captureLeadSource({ url: "https://notimehub.com/en?utm_source=google", referrer: "", host: HOST, existing: null });
    const next = captureLeadSource({ url: "https://notimehub.com/en/work?utm_source=linkedin&utm_medium=social", referrer: "", host: HOST, existing: first });
    expect(next).toMatchObject({ utm_source: "linkedin", utm_medium: "social", landing: "/en/work" });
  });

  it("ignores the site's own pages (and www) as a referrer", () => {
    for (const referrer of ["https://notimehub.com/en", "https://www.notimehub.com/ar/about"]) {
      expect(captureLeadSource({ url: "https://notimehub.com/en/about", referrer, host: HOST, existing: null })).toEqual({ landing: "/en/about" });
    }
  });

  it("drops untrusted noise: unknown params, control characters, over-long values", () => {
    const long = "x".repeat(300);
    const lead = captureLeadSource({
      url: `https://notimehub.com/en?utm_source=a%0Ab&utm_content=${long}&email=someone@example.com&gclid=abc`,
      referrer: "not a url",
      host: HOST,
      existing: null,
    });
    expect(lead.utm_source).toBe("a b");
    expect(lead.utm_content).toHaveLength(80);
    expect(lead).not.toHaveProperty("email");
    expect(lead).not.toHaveProperty("gclid");
    expect(lead).not.toHaveProperty("referrer");
  });
});

describe("serialize / parse", () => {
  it("round-trips, and rejects anything that isn't a lead object", () => {
    const lead = { utm_source: "instagram", landing: "/ar" };
    expect(parseLeadSource(serializeLeadSource(lead))).toEqual(lead);
    for (const bad of ["", "nope", "[]", "null", '{"utm_source":5}', '{"other":"x"}', "{".repeat(5)]) expect(parseLeadSource(bad)).toBeNull();
  });

  it("re-cleans on the server: unknown keys out, values trimmed to size", () => {
    expect(parseLeadSource(JSON.stringify({ utm_source: "x\u0000y", landing: "/en", extra: "z" }))).toEqual({ utm_source: "x y", landing: "/en" });
    expect(parseLeadSource("x".repeat(5000))).toBeNull();
  });
});

describe("leadRows", () => {
  it("names the source for the team email, and is empty without one", () => {
    expect(leadRows({ utm_source: "instagram", utm_medium: "social", utm_campaign: "eid", referrer: "l.instagram.com", landing: "/ar" })).toEqual([
      ["Source", "instagram / social"],
      ["Campaign", "eid"],
      ["Referrer", "l.instagram.com"],
      ["Landing page", "/ar"],
    ]);
    expect(leadRows(null)).toEqual([]);
    expect(leadRows({ landing: "/en" })).toEqual([["Source", "Direct (no tag, no referrer)"], ["Landing page", "/en"]]);
  });
});
