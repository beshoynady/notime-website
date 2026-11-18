import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

/**
 * The phone field (D124, spec: docs/review/copy-rewrite/_head.md, "The phone field"). Pure, shared
 * by the client check and the server re-parse, so what's stored and sent is always E.164.
 * - Spaces, dashes and brackets are removed; a leading `00` reads as `+`.
 * - With `+`: valid by libphonenumber-js → E.164; an unknown country code → `phoneCode`.
 * - Without `+`: accepted only when it starts with one of the six markets' codes and is valid for
 *   that country; a leading `0` or any other start → `phoneCode` ("Include the country code").
 * - Anything else that doesn't parse as a valid number (letters, a wrong length) → `phone`.
 * No hand-written length rules: libphonenumber-js decides what's valid.
 */
export type PhoneResult = { ok: true; e164: string } | { ok: false; code: "phone" | "phoneCode" };

/** The six markets (About, FAQ): UAE, Saudi Arabia, Qatar, Oman, Kuwait, Egypt. */
export const MARKET_COUNTRIES: readonly CountryCode[] = ["AE", "SA", "QA", "OM", "KW", "EG"];

const CALLING_CODES = new Set(getCountries().map((c) => getCountryCallingCode(c) as string));
const knownCode = (digits: string) => [1, 2, 3].some((n) => CALLING_CODES.has(digits.slice(0, n)));

function valid(international: string): string | null {
  const p = parsePhoneNumberFromString(international);
  return p?.isValid() ? p.number : null;
}

export function parsePhone(raw: string): PhoneResult {
  const v = raw.replace(/[\s()\-]/g, "");
  if (v === "") return { ok: true, e164: "" };
  const intl = v.startsWith("00") ? `+${v.slice(2)}` : v;
  if (!/^\+?\d+$/.test(intl)) return { ok: false, code: "phone" };

  if (intl.startsWith("+")) {
    const e164 = valid(intl);
    if (e164) return { ok: true, e164 };
    return { ok: false, code: knownCode(intl.slice(1)) ? "phone" : "phoneCode" };
  }

  if (intl.startsWith("0")) return { ok: false, code: "phoneCode" };
  const market = MARKET_COUNTRIES.find((c) => intl.startsWith(getCountryCallingCode(c)));
  if (!market) return { ok: false, code: "phoneCode" };
  const e164 = valid(`+${intl}`);
  return e164 && parsePhoneNumberFromString(e164)?.country === market ? { ok: true, e164 } : { ok: false, code: "phone" };
}
