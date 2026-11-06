import { useTranslations } from "next-intl";
import type { Paint } from "@/content";
import { cn } from "@/lib/utils";

/** Deterministic bokeh discs per paint, so server and client render the same SVG. */
const BOKEH: Record<Paint, ReadonlyArray<readonly [cx: number, cy: number, r: number, o: number]>> = {
  event: [[34, 40, 5, 0.85], [58, 18, 4, 0.8], [82, 52, 3, 0.75], [12, 58, 6, 0.5], [70, 74, 9, 0.18]],
  table: [[30, 30, 6, 0.7], [70, 28, 6, 0.7], [50, 62, 10, 0.2], [18, 70, 4, 0.4]],
  studio: [[24, 34, 8, 0.25], [76, 48, 5, 0.5], [60, 80, 3, 0.6]],
  print: [[40, 40, 7, 0.3], [78, 22, 3, 0.6], [20, 76, 4, 0.4]],
  code: [[65, 40, 6, 0.35], [30, 70, 3, 0.5], [84, 78, 4, 0.3]],
  brand: [[35, 50, 9, 0.3], [70, 40, 6, 0.4], [55, 80, 3, 0.55]],
};

/**
 * Designed placeholder for an image slot without a file yet.
 * TODO: replace placeholder — swapped out automatically once the slot gets a `src`.
 */
export function AiPlaceholder({ paint, className, showTag = true }: { paint: Paint; className?: string; showTag?: boolean }) {
  const t = useTranslations("common");
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-espresso-2", className)} aria-hidden="true">
      <div className={cn("paint", `paint-${paint}`)} />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`bokeh-${paint}`}>
            <stop offset="0" stopColor="#FFEED2" stopOpacity="1" />
            <stop offset="0.6" stopColor="#EAD4AB" stopOpacity="0.35" />
            <stop offset="1" stopColor="#EAD4AB" stopOpacity="0" />
          </radialGradient>
        </defs>
        {BOKEH[paint].map(([cx, cy, r, o]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={`url(#bokeh-${paint})`} opacity={o} />
        ))}
      </svg>
      {showTag && (
        <span className="image-tag absolute start-3 bottom-3 z-[2]">{t("aiPlaceholder")}</span>
      )}
    </div>
  );
}
