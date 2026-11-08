/**
 * Arabic for satori (next/og) only. satori has no bidi, and it measures a word before shaping
 * it but draws it after, so joined Arabic gets boxes wider than its glyphs. The OG images pass
 * Arabic pre-shaped as Unicode presentation forms (every letter, isolated ones included), one
 * word at a time in visual order: measured and drawn widths then match, and satori leaves the
 * order alone because no base Arabic letters remain. The OG font maps the isolated forms
 * (scripts/og-fonts.py). The browser shapes page text itself; never use this for the page.
 */

/** Base letter → first presentation form (isolated) and its form count: 1 none, 2 right-joining, 4 dual. */
const FORMS: Record<string, readonly [number, 1 | 2 | 4]> = {};
const add = (base: number, start: number, n: 1 | 2 | 4) => (FORMS[String.fromCodePoint(base)] = [start, n]);
add(0x0621, 0xfe80, 1); // ء
add(0x0622, 0xfe81, 2); // آ
add(0x0623, 0xfe83, 2); // أ
add(0x0624, 0xfe85, 2); // ؤ
add(0x0625, 0xfe87, 2); // إ
add(0x0626, 0xfe89, 4); // ئ
add(0x0627, 0xfe8d, 2); // ا
add(0x0628, 0xfe8f, 4); // ب
add(0x0629, 0xfe93, 2); // ة
[0x062a, 0x062b, 0x062c, 0x062d, 0x062e].forEach((c, i) => add(c, 0xfe95 + i * 4, 4)); // ت ث ج ح خ
[0x062f, 0x0630, 0x0631, 0x0632].forEach((c, i) => add(c, 0xfea9 + i * 2, 2)); // د ذ ر ز
[0x0633, 0x0634, 0x0635, 0x0636, 0x0637, 0x0638, 0x0639, 0x063a].forEach((c, i) => add(c, 0xfeb1 + i * 4, 4)); // س … غ
[0x0641, 0x0642, 0x0643, 0x0644, 0x0645, 0x0646, 0x0647].forEach((c, i) => add(c, 0xfed1 + i * 4, 4)); // ف … ه
add(0x0648, 0xfeed, 2); // و
add(0x0649, 0xfeef, 2); // ى
add(0x064a, 0xfef1, 4); // ي

const LAM = "ل";
/** Alef variants that form a ligature after lam → the ligature's isolated form (final = +1). */
const LAM_ALEF: Record<string, number> = { "آ": 0xfef5, "أ": 0xfef7, "إ": 0xfef9, "ا": 0xfefb };
const TATWEEL = "ـ";
/** Harakat and superscript alef. */
const MARKS = /[ً-ٰٟ]/g;

const joinsLeft = (c: string | undefined) => c === TATWEEL || (c !== undefined && FORMS[c]?.[1] === 4);
const joinsRight = (c: string | undefined) => c === TATWEEL || (c !== undefined && (FORMS[c]?.[1] ?? 1) > 1);

/** Contextual forms in logical order. Marks are dropped (satori can't position them). */
export function shapeArabic(text: string): string {
  const chars = Array.from(text.replace(MARKS, ""));
  let out = "";
  let prevJoinsLeft = false; // the previous letter as shaped (a lam-alef ligature never joins left)
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const next = chars[i + 1];
    const form = FORMS[c];
    if (!form) {
      out += c;
      prevJoinsLeft = c === TATWEEL;
      continue;
    }
    if (c === LAM && next !== undefined && next in LAM_ALEF) {
      out += String.fromCodePoint(LAM_ALEF[next] + (prevJoinsLeft ? 1 : 0));
      i++;
      prevJoinsLeft = false;
      continue;
    }
    const [start, n] = form;
    const joinPrev = n > 1 && prevJoinsLeft;
    const joinNext = n === 4 && joinsRight(next);
    // Forms in order: isolated, final, initial, medial.
    out += String.fromCodePoint(start + (joinPrev && joinNext ? 3 : joinNext ? 2 : joinPrev ? 1 : 0));
    prevJoinsLeft = joinsLeft(c);
  }
  return out;
}

/** One word, shaped and in visual (left-to-right) order. The caller lays words out right to left. */
export function visualArabicWord(word: string): string {
  return Array.from(shapeArabic(word)).reverse().join("");
}
