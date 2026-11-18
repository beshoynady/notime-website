import { describe, expect, it } from "vitest";
import { handleSubmission, prepareContact } from "./handle";
import { HONEYPOT, contactSchema, interestSchema } from "./schemas";

const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};
const ok = { locale: "en", source: "peak-hour", product: "peak-hour", name: "Lina", email: "lina@example.com" };

describe("handleSubmission", () => {
  it("returns success for a valid form and sends nothing until delivery is wired", async () => {
    expect(await handleSubmission(interestSchema, fd(ok), { ip: "1.1.1.1" })).toEqual({ status: "success" });
  });
  it("returns the codes and echoes the fields when invalid", async () => {
    const r = await handleSubmission(interestSchema, fd({ ...ok, email: "x" }), { ip: "1.1.1.2" });
    expect(r.status).toBe("invalid");
    expect(r.errors).toEqual({ email: "email" });
    expect(r.fields?.name).toBe("Lina");
  });
  it("looks accepted for a filled honeypot, without delivering", async () => {
    let sent = false;
    const deliver = async () => ((sent = true), "success" as const);
    expect(await handleSubmission(interestSchema, fd({ ...ok, [HONEYPOT]: "x" }), { ip: "1.1.1.3", deliver })).toEqual({ status: "success" });
    expect(sent).toBe(false);
  });
  it("rate-limits the sixth attempt in ten minutes", async () => {
    for (let i = 0; i < 5; i++) await handleSubmission(interestSchema, fd(ok), { ip: "1.1.1.4", now: 1000 + i });
    expect((await handleSubmission(interestSchema, fd(ok), { ip: "1.1.1.4", now: 2000 })).status).toBe("rateLimited");
  });
  it("passes a delivery failure through with the fields", async () => {
    const r = await handleSubmission(interestSchema, fd(ok), { ip: "1.1.1.5", deliver: async () => "failed" });
    expect(r).toMatchObject({ status: "failed", fields: { name: "Lina" } });
  });
});

describe("handleSubmission · Turnstile (D102)", () => {
  it("blocks without a verified token, keeps the input, and never delivers", async () => {
    let delivered = 0;
    const r = await handleSubmission(interestSchema, fd(ok), { ip: "2.2.2.1", verify: async () => false, deliver: async () => (delivered++, "success") });
    expect(r.status).toBe("blocked");
    expect(r.fields?.name).toBe("Lina");
    expect(delivered).toBe(0);
  });
  it("doesn't spend the token on an invalid form", async () => {
    let checked = 0;
    const r = await handleSubmission(interestSchema, fd({ ...ok, email: "x" }), { ip: "2.2.2.2", verify: async () => (checked++, true) });
    expect(r.status).toBe("invalid");
    expect(checked).toBe(0);
  });
  it("passes the posted token and delivers once verified", async () => {
    let token = "";
    const r = await handleSubmission(interestSchema, fd({ ...ok, "cf-turnstile-response": "tok" }), { ip: "2.2.2.3", verify: async (t) => ((token = t), true), deliver: async () => "success" });
    expect(r.status).toBe("success");
    expect(token).toBe("tok");
  });
});

describe("stale event fields are dropped", () => {
  const brief = { locale: "en", source: "contact", name: "Sara", email: "sara@example.com", message: "Hello", eventMonth: "2027-03", guests: "50-150" };
  const run = async (o: Record<string, string>, ip: string) => {
    let seen: unknown;
    await handleSubmission(contactSchema, fd({ ...brief, ...o }), { ip, deliver: async (d) => ((seen = prepareContact(d)), "success" as const) });
    return seen;
  };
  it("blanks them for a non-events service", async () => {
    expect(await run({ service: "branding" }, "2.2.2.1")).toMatchObject({ service: "branding", eventMonth: "", guests: "" });
  });
  it("keeps them for an events service or no service", async () => {
    expect(await run({ service: "conferences" }, "2.2.2.2")).toMatchObject({ eventMonth: "2027-03", guests: "50-150" });
    expect(await run({}, "2.2.2.3")).toMatchObject({ eventMonth: "2027-03", guests: "50-150" });
  });
  it("drops an unknown service and keeps the event fields (no service)", async () => {
    expect(await run({ service: "<script>" }, "2.2.2.4")).toMatchObject({ service: "", eventMonth: "2027-03" });
  });
});
