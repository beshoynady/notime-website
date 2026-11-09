import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Marquee } from "@/components/motion/marquee";
import { GeometricPattern } from "@/components/ornaments/geometric-pattern";
import { LightLeak } from "@/components/ornaments/light-leak";
import { MarqueeDivider } from "@/components/ornaments/marquee-divider";
import { TickMarker } from "@/components/ornaments/tick-marker";
import { ScrubColorWords } from "@/components/motion/scrub-color-words";
import { CategoryCards } from "@/components/sections/categories/category-cards";
import { ContrastPairs } from "@/components/styleguide/contrast-pairs";
import { ComponentsDemo } from "@/components/styleguide/components-demo";
import { MotionDemos } from "@/components/styleguide/motion-demos";
import { PatternsDemo } from "@/components/styleguide/patterns-demo";
import { ShapeSpaceGrid } from "@/components/styleguide/shape-space-grid";
import { Swatches } from "@/components/styleguide/swatches";
import { TypeScale } from "@/components/styleguide/type-scale";
import { BrandImage } from "@/components/ui/brand-image";
import { getCategories, getServices, type Locale } from "@/content";
import { motionTokens, stagger } from "@/lib/motion";
import "./styleguide.css";

/**
 * The client's approval page (Task 12): the foundations with the site's real components.
 * Not indexed and left out of the sitemap; reachable by direct link only.
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/styleguide">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "styleguide.meta" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/styleguide`,
      languages: { en: "/en/styleguide", ar: "/ar/styleguide" },
    },
  };
}

/** Values come from the motion tokens, so this table can never drift from the code. */
const TOKENS = [
  { key: "micro", value: `${motionTokens.micro.duration}s · ${motionTokens.micro.gsapEase}` },
  { key: "base", value: `${motionTokens.base.duration}s · ${motionTokens.base.gsapEase}` },
  { key: "display", value: `${motionTokens.display.min}–${motionTokens.display.max}s · ${motionTokens.display.gsapEase}` },
  { key: "stagger", value: `${stagger.char}s / ${stagger.word}s` },
] as const;

export default async function StyleguidePage({ params }: PageProps<"/[locale]/styleguide">) {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations("styleguide");
  const ta = await getTranslations("about");
  const services = getServices().map((s) => s.title[locale]);

  return (
    <main id="main">
      <section data-tone="light" className="sg-band sg-first">
        <div className="frame">
          <header className="sg-intro">
            <p className="text-eyebrow m-0 text-cocoa">{t("intro.eyebrow")}</p>
            <h1 className="text-h1 m-0 max-w-[18ch]">
              {t("intro.headingLead")} <b>{t("intro.headingKey")}</b>
            </h1>
            <p className="text-lead m-0 text-cocoa">{t("intro.lead")}</p>
          </header>
          <SecHead id="colour" eyebrow={t("colour.eyebrow")} lead={t("colour.headingLead")} accent={t("colour.headingKey")} />
          <Swatches />
          <ContrastPairs />
        </div>
      </section>

      <section data-tone="light" className="sg-band sg-flush">
        <div className="frame">
          <SecHead id="type" eyebrow={t("type.eyebrow")} lead={t("type.headingLead")} accent={t("type.headingKey")} />
          <TypeScale />
        </div>
      </section>

      <section data-tone="light" className="sg-band sg-flush">
        <div className="frame">
          <SecHead id="shape" eyebrow={t("shape.eyebrow")} lead={t("shape.headingLead")} accent={t("shape.headingKey")} />
          <ShapeSpaceGrid />
        </div>
      </section>

      <section data-tone="dark" className="sg-band">
        <div className="frame">
          <SecHead id="motion" eyebrow={t("motion.eyebrow")} lead={t("motion.headingLead")} accent={t("motion.headingKey")} />
          <dl className="sg-tokens">
            {TOKENS.map(({ key, value }) => (
              <div key={key} className="sg-tok">
                <dt>{t(`motion.tokens.${key}.name`)}</dt>
                <dd className="sg-tok-desc">{t(`motion.tokens.${key}.desc`)}</dd>
                <dd className="sg-tok-value tabular" dir="ltr">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <MotionDemos
            maskMedia={<BrandImage slot="cat-events-hospitality-16x9" fill sizes="(min-width: 900px) 30vw, 90vw" />}
            parallaxMedia={<BrandImage slot="process-launch-4x5" fill sizes="(min-width: 900px) 30vw, 90vw" />}
          />
          <div className="sg-statement-wrap">
            <p className="text-eyebrow mb-6 mt-0 text-champagne">{t("motion.statementLabel")}</p>
            <ScrubColorWords text={ta("statement")} className="sg-statement" />
          </div>
        </div>
        <Marquee items={services} label={t("motion.marqueeLabel")} className="mt-16" />
      </section>

      <section data-tone="light" className="sg-band">
        <div className="frame">
          <SecHead id="components" eyebrow={t("components.eyebrow")} lead={t("components.headingLead")} accent={t("components.headingKey")} />
          <ComponentsDemo />
          <div className="sg-cards-head">
            <h3 className="sg-panel-title">{t("components.categories")}</h3>
            <p>{t("components.categoriesNote")}</p>
          </div>
          <CategoryCards />
        </div>
      </section>

      <section data-tone="light" className="sg-band">
        <div className="frame">
          <SecHead id="patterns" eyebrow={t("patterns.eyebrow")} lead={t("patterns.headingLead")} accent={t("patterns.headingKey")} tick />
          <p className="text-lead m-0 mb-12 max-w-[52ch] text-cocoa">{t("patterns.lead")}</p>
          <PatternsDemo
            pushMedia={<BrandImage slot="cat-events-hospitality-16x9" fill sizes="(min-width: 900px) 30vw, 90vw" />}
            sweepMedia={<BrandImage slot="cat-production-print-gifts-16x9" fill sizes="(min-width: 900px) 30vw, 90vw" />}
          />
        </div>
        <MarqueeDivider items={getCategories().map((c) => c.title[locale])} className="mt-20" />
      </section>

      <section data-tone="dark" className="sg-band sg-closing">
        <GeometricPattern />
        <LightLeak position="end-top" />
        <div className="frame">
          <h2 className="text-h1 m-0 max-w-[16ch]">
            {t("closing.headingLead")} <b>{t("closing.headingKey")}</b>
          </h2>
          <p className="text-lead mb-0 mt-6 text-ivory/80">{t("closing.body")}</p>
          <div className="sg-foot">
            <span>{t("closing.meta")}</span>
            <span>{t("closing.phase")}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function SecHead({ id, eyebrow, lead, accent, tick = false }: { id: string; eyebrow: ReactNode; lead: ReactNode; accent: ReactNode; tick?: boolean }) {
  return (
    <div className="sg-sec-head">
      <p className="sec-eyebrow text-eyebrow">
        {tick && <TickMarker />}
        {eyebrow}
      </p>
      <h2 id={id} className="text-h1 m-0 scroll-mt-24">
        {lead} <b>{accent}</b>
      </h2>
    </div>
  );
}
