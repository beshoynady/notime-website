import { cn } from "@/lib/utils";

/**
 * An order numeral (`orderNumeral`, D74): Roman in English, two-digit Western numerals in Arabic.
 * Always set in Montserrat, so both locales share one figure style. A <bdi> isolates it, so in
 * Arabic it can't merge with neighbouring digits into one left-to-right run ("03 · 6 خدمات" would
 * show as "6 · 03 خدمات"). Its own direction is then LTR, so as a grid item it would align left in
 * Arabic; `justify-self: start` follows the grid's direction instead (Chrome has no
 * `text-align: match-parent`).
 */
export function Numeral({ children, className }: { children: string; className?: string }) {
  return (
    <bdi lang="en" className={cn("font-en tabular justify-self-start", className)}>
      {children}
    </bdi>
  );
}
