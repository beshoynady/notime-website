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
