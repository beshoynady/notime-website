import { cn } from "@/lib/utils";

/**
 * Roman numerals are always set in Montserrat: in Alexandria, Latin I and V look like
 * the Arabic-Indic digits ١ and ٧, so "IV" would read as "١٧". A <bdi> isolates the numeral,
 * so in Arabic it can't merge with neighbouring digits into one left-to-right run
 * ("III · 6 خدمات" would show as "6 · III خدمات").
 */
export function Numeral({ children, className }: { children: string; className?: string }) {
  return (
    <bdi lang="en" className={cn("font-en tabular", className)}>
      {children}
    </bdi>
  );
}
