const NUMERALS: ReadonlyArray<readonly [number, string]> = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Integer 1..39 → Roman numeral (category indices I–V). */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 39) throw new RangeError(`toRoman: ${n} is outside 1..39`);
  let rest = n;
  let out = "";
  for (const [value, symbol] of NUMERALS) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}

/**
 * A category's or service's order numeral, per locale (D74): Roman in English (I, II, III…);
 * two-digit Western numerals in Arabic (01, 02, 03…), where Latin I and V read as the alef «ا»
 * and the digit ٧, and a Roman numeral means nothing to most readers. Same range as toRoman.
 */
export function orderNumeral(n: number, locale: "en" | "ar"): string {
  const roman = toRoman(n); // validates n in both locales
  return locale === "ar" ? String(n).padStart(2, "0") : roman;
}
