import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { composeMail, deliverMail } from "./mailer";

const shared = { locale: "ar", source: "contact" };
const brief = { service: "apps", timeline: "" as const, budget: "", city: "Riyadh", name: "Sara", email: "sara@example.com", phone: "", company: "", message: "A booking app." };

describe("composeMail", () => {
  it("names the service on a brief, and General without one", () => {
    expect(composeMail("contact", brief, shared).subject).toBe("Brief: Mobile apps");
    expect(composeMail("contact", { ...brief, service: "" }, shared).subject).toBe("Brief: General");
  });
  it("prefixes the website review, and replies only to an email contact", () => {
    const base = { websiteUrl: "https://example.ae", name: "Ali", goal: "speed" as const, message: "" };
    const byMail = composeMail("websiteReview", { ...base, contact: "ali@example.ae" }, shared);
    expect(byMail.subject).toBe("[Website review] https://example.ae");
    expect(byMail.visitorEmail).toBe("ali@example.ae");
    expect(composeMail("websiteReview", { ...base, contact: "+971 50 000 0000" }, shared).visitorEmail).toBeUndefined();
  });
  it("ends every team email with where the visit came from, when it's known (D110)", () => {
    const lead = { utm_source: "instagram", utm_medium: "social", landing: "/ar/services/events-hospitality" };
    const rows = composeMail("contact", brief, { ...shared, lead }).rows;
    expect(rows.slice(-2)).toEqual([["Source", "instagram / social"], ["Landing page", "/ar/services/events-hospitality"]]);
    expect(composeMail("contact", brief, shared).rows.some(([k]) => k === "Source")).toBe(false);
  });

  it("drops empty optional rows", () => {
    const labels = composeMail("contact", brief, shared).rows.map(([k]) => k);
    expect(labels).not.toContain("Phone");
    expect(labels).toContain("City or country");
  });
});

describe("deliverMail", () => {
  const mail = composeMail("contact", brief, shared);
  const env = { RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "team@example.com" } as unknown as NodeJS.ProcessEnv;

  it("sends the team email only until a verified sender exists", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true });
    expect(await deliverMail(mail, { env, send })).toBe("success");
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({ to: ["team@example.com"], replyTo: "sara@example.com", subject: "Brief: Mobile apps" });
  });
  it("adds the auto-reply, in the visitor's language, once MAIL_FROM is set", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true });
    await deliverMail(mail, { env: { ...env, MAIL_FROM: "website@example.com" }, send });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0].to).toEqual(["sara@example.com"]);
    expect(send.mock.calls[1][0].subject).toBe("وصلنا طلبك");
  });
  it("fails when the team email fails or delivery isn't configured; an auto-reply failure doesn't", async () => {
    expect(await deliverMail(mail, { env, send: vi.fn().mockResolvedValue({ ok: false }) })).toBe("failed");
    expect(await deliverMail(mail, { env: {} as NodeJS.ProcessEnv, send: vi.fn() })).toBe("failed");
    const send = vi.fn().mockResolvedValueOnce({ ok: true }).mockRejectedValueOnce(new Error("x"));
    expect(await deliverMail(mail, { env: { ...env, MAIL_FROM: "w@example.com" }, send })).toBe("success");
  });
  it("writes to the file sink instead of sending in tests", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "mail-"));
    const send = vi.fn();
    expect(await deliverMail(mail, { env: { MAIL_SINK: "file", MAIL_FROM: "w@example.com" } as unknown as NodeJS.ProcessEnv, send, sinkDir: dir })).toBe("success");
    expect(send).not.toHaveBeenCalled();
    const files = readdirSync(dir);
    expect(files).toHaveLength(2);
    const reply = JSON.parse(readFileSync(path.join(dir, files.find((f) => f.endsWith("reply.json"))!), "utf8"));
    expect(reply.locale).toBe("ar");
    expect(reply.html).toContain('dir="rtl"');
  });
});
