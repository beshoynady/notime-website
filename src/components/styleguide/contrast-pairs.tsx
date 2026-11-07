import { getTranslations } from "next-intl/server";
import { contrastRatio, wcagLevel } from "@/lib/contrast";
import { hexOf, type SwatchKey } from "./palette";

/** The four text/ground pairs the site relies on. Ratios are computed, never typed in. */
const PAIRS: ReadonlyArray<[fg: SwatchKey, bg: SwatchKey]> = [
  ["ivory", "espresso"],
  ["champagne", "espresso"],
  ["espresso", "ivory"],
  ["cocoa", "ivory"],
];

export async function ContrastPairs() {
  const t = await getTranslations("styleguide.colour");
  return (
    <ul className="sg-pairs" role="list">
      {PAIRS.map(([fg, bg]) => {
        const ratio = contrastRatio(hexOf(fg), hexOf(bg));
        const value = ratio.toFixed(1);
        const level = wcagLevel(ratio);
        return (
          <li
            key={`${fg}-${bg}`}
            className="sg-pair"
            style={{ color: hexOf(fg), background: hexOf(bg), borderColor: bg === "ivory" ? "var(--color-line-light)" : "transparent" }}
          >
            <span>{t("pair", { fg: t(`swatches.${fg}.name`), bg: t(`swatches.${bg}.name`) })}</span>
            <span className="sg-aa" aria-label={t("contrast", { ratio: value, level })}>
              <span dir="ltr">
                {level} {value}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
