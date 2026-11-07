import { getTranslations } from "next-intl/server";

const RADII = [0, 2, 4] as const; // 4 = default (buttons, cards, fields); 2 = tags
const SPACE = [8, 16, 24, 32, 48, 64, 96, 128] as const; // base 8

export async function ShapeSpaceGrid() {
  const t = await getTranslations("styleguide");
  return (
    <div className="sg-three">
      <div className="sg-panel">
        <h3 className="sg-panel-title">{t("shape.radius")}</h3>
        <ul className="flex flex-wrap gap-3.5" role="list">
          {RADII.map((r) => (
            <li
              key={r}
              className="grid size-16 place-items-center bg-champagne text-[0.68rem] text-espresso"
              style={{ borderRadius: r, ...(r === 4 ? { outline: "2px solid var(--color-cocoa)", outlineOffset: 3 } : {}) }}
            >
              {t("px", { n: r })}
            </li>
          ))}
        </ul>
        <p className="m-0 text-[0.85rem] text-cocoa">{t("shape.radiusNote")}</p>
      </div>

      <div className="sg-panel">
        <h3 className="sg-panel-title">{t("shape.spacing")}</h3>
        <ul className="grid gap-2" role="list">
          {SPACE.map((s) => (
            <li key={s} className="flex items-center gap-3 text-[0.72rem] text-cocoa tabular">
              <i className="block h-2 rounded-[1px] bg-cocoa" style={{ inlineSize: Math.min(s, 128) }} aria-hidden="true" />
              {t("px", { n: s })}
            </li>
          ))}
        </ul>
      </div>

      <div className="sg-panel">
        <h3 className="sg-panel-title">{t("shape.grid")}</h3>
        <div>
          <p className="mb-2 mt-0 text-[0.8rem] text-cocoa">{t("shape.gridDesktop")}</p>
          <GridViz cols={12} />
        </div>
        <div>
          <p className="mb-2 mt-0 text-[0.8rem] text-cocoa">{t("shape.gridMobile")}</p>
          <GridViz cols={4} />
        </div>
      </div>
    </div>
  );
}

function GridViz({ cols }: { cols: 4 | 12 }) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, blockSize: cols === 12 ? 120 : 80, maxInlineSize: cols === 4 ? 140 : undefined }}
      aria-hidden="true"
    >
      {Array.from({ length: cols }, (_, i) => (
        <span key={i} className="rounded-[1px] bg-taupe/30" />
      ))}
    </div>
  );
}
