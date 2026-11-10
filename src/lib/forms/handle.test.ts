import { describe, expect, it } from "vitest";
import { handleSubmission } from "./handle";
import { HONEYPOT, interestSchema } from "./schemas";

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
