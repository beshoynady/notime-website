import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { HoverSweep } from "@/components/motion/hover-sweep";
import { KenBurns } from "@/components/motion/ken-burns";
import "@/components/motion/duotone.css";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { GeometricPattern } from "@/components/ornaments/geometric-pattern";
import { Hairline } from "@/components/ornaments/hairline";
import { LightLeak } from "@/components/ornaments/light-leak";
import { TickMarker } from "@/components/ornaments/tick-marker";

type Key = "hairline" | "corners" | "geometric" | "leak" | "tick" | "kenBurns" | "sweep" | "duotone" | "divider";

/**
 * The ornament kit (v1 plan, Task A4), one specimen per element with its do and don't.
 * Media comes in from the server page; the specimens are the real components.
 */
export function PatternsDemo({ pushMedia, sweepMedia }: { pushMedia: ReactNode; sweepMedia: ReactNode }) {
  const t = useTranslations("styleguide.patterns");
  return (
    <ul className="sg-patterns" role="list">
      <Pattern k="hairline" t={t}>
        <div className="sg-pat-stage grid content-center gap-8 px-6">
          <Hairline />
          <Hairline mark />
        </div>
      </Pattern>
      <Pattern k="tick" t={t}>
        <div className="sg-pat-stage grid place-content-center">
          <p className="sec-eyebrow text-eyebrow">
            <TickMarker at={3} />
            {t("eyebrow")}
          </p>
        </div>
      </Pattern>
      <Pattern k="geometric" t={t}>
        <div className="sg-pat-stage relative bg-espresso">
          <GeometricPattern opacity={0.08} />
        </div>
      </Pattern>
      <Pattern k="leak" t={t}>
        <div className="sg-pat-stage relative overflow-hidden bg-espresso">
          <LightLeak position="start-top" />
        </div>
      </Pattern>
      <Pattern k="corners" t={t}>
        <div className="sg-pat-stage grid p-6">
          <div className="relative">
            <KenBurns className="absolute inset-0" origin="start-top">
              {pushMedia}
            </KenBurns>
            <FrameCorners tone="espresso" inset="out" />
          </div>
        </div>
      </Pattern>
      <Pattern k="kenBurns" t={t}>
        <KenBurns className="sg-pat-stage" origin="end-bottom" to={1.12}>
          {pushMedia}
        </KenBurns>
      </Pattern>
      <Pattern k="sweep" t={t} hint={t("hoverHint")}>
        <HoverSweep className="sg-pat-stage">{sweepMedia}</HoverSweep>
      </Pattern>
      <Pattern k="duotone" t={t} hint={t("hoverHint")}>
        <div className="sg-pat-stage duotone">{sweepMedia}</div>
      </Pattern>
    </ul>
  );
}

function Pattern({ k, t, hint, children }: { k: Key; t: ReturnType<typeof useTranslations<"styleguide.patterns">>; hint?: string; children: ReactNode }) {
  return (
    <li className="sg-pat" data-pattern={k}>
      {children}
      <h3 className="sg-panel-title">{t(`items.${k}.name`)}</h3>
      <dl className="sg-pat-rules">
        <div>
          <dt>{t("do")}</dt>
          <dd>{t(`items.${k}.do`)}</dd>
        </div>
        <div>
          <dt>{t("dont")}</dt>
          <dd>{t(`items.${k}.dont`)}</dd>
        </div>
      </dl>
      {hint && <p className="sg-pat-hint">{hint}</p>}
    </li>
  );
}
