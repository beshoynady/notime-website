import { getTranslations } from "next-intl/server";
import { SectionRef } from "@/components/review/section-ref";
import { HOME_REF } from "@/lib/review";
import { ProcessScroll } from "./process-scroll";
import "./process.css";

const STEPS = ["plan", "build", "produce", "launch"] as const;

/**
 * Home · How we work (H-07, dark): four steps that build up as the visitor scrolls (brief §4).
 * The steps are a real sequence, so they carry their numbers. Server-rendered complete (no JS,
 * reduced motion: all four steps and the full rail); ProcessScroll adds the scroll build.
 */
export async function Process() {
  const t = await getTranslations("process");
  return (
    <section id="how-we-work" data-tone="dark" aria-labelledby="process-title" className="process">
      <SectionRef id={HOME_REF.process} />
      <ProcessScroll>
        <div className="frame process-frame">
          <header className="process-head">
            <p className="sec-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
            <h2 id="process-title" className="text-h1">
              {t("headingLead")} <b>{t("headingKey")}</b>
            </h2>
          </header>
          <div className="process-rail" aria-hidden="true">
            <span className="process-rail-fill" />
          </div>
          <ol className="process-steps">
            {STEPS.map((k, i) => (
              <li key={k} className="process-step">
                <span className="process-num tabular" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="process-title">{t(`steps.${k}.title`)}</h3>
                <p>{t(`steps.${k}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </ProcessScroll>
    </section>
  );
}
