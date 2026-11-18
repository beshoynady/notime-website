import { describe, expect, it } from "vitest";
import { parsePhone } from "./phone";

const ok = (e164: string) => ({ ok: true, e164 });
const err = (code: "phone" | "phoneCode") => ({ ok: false, code });

/** D124: the phone field, with libphonenumber-js (no hand-written length rules). */
describe("parsePhone", () => {
  it("accepts a number with + and stores it in E.164", () => {
    expect(parsePhone("+971 50 123 4567")).toEqual(ok("+971501234567"));
  });

  it("reads a leading 00 as +", () => {
    expect(parsePhone("00971501234567")).toEqual(ok("+971501234567"));
  });

  it("accepts one of the six markets' codes without +, when valid for that country", () => {
    expect(parsePhone("971501234567")).toEqual(ok("+971501234567"));
    expect(parsePhone("966512345678")).toEqual(ok("+966512345678"));
    expect(parsePhone("201001234567")).toEqual(ok("+201001234567"));
  });

  it("strips brackets, dashes and spaces", () => {
    expect(parsePhone("(+971) 50-123-4567")).toEqual(ok("+971501234567"));
    expect(parsePhone(" +971 (50) 123 - 45 67 ")).toEqual(ok("+971501234567"));
  });

  it("accepts a valid Saudi, Qatari and Egyptian number", () => {
    expect(parsePhone("+966 51 234 5678")).toEqual(ok("+966512345678"));
    expect(parsePhone("+974 3312 3456")).toEqual(ok("+97433123456"));
    expect(parsePhone("+20 100 123 4567")).toEqual(ok("+201001234567"));
  });

  it("asks for the country code when the number starts with 0", () => {
    expect(parsePhone("0501234567")).toEqual(err("phoneCode"));
    expect(parsePhone("050 123 4567")).toEqual(err("phoneCode"));
  });

  it("asks for the country code when it matches no code we can read", () => {
    expect(parsePhone("501234567")).toEqual(err("phoneCode")); // no + and not a market code
    expect(parsePhone("+999 123 456 789")).toEqual(err("phoneCode")); // no such country code
  });

  it("rejects letters and garbage as a phone error", () => {
    for (const v of ["abc", "+971 50 abc 4567", "call me", "+", "++971501234567", "971-50-123-4567x", "+971 50 123 4567 ext 2"]) expect(parsePhone(v), v).toEqual(err("phone"));
  });

  it("rejects a known code with the wrong length as a phone error", () => {
    expect(parsePhone("+971 50 123")).toEqual(err("phone"));
    expect(parsePhone("97150123")).toEqual(err("phone"));
  });

  it("treats an empty value as empty (the field is optional)", () => {
    expect(parsePhone("")).toEqual(ok(""));
    expect(parsePhone("   ")).toEqual(ok(""));
  });
});
