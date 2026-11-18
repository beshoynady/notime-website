import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/category/breadcrumbs";
import { SectionRef } from "@/components/review/section-ref";
import { Numeral } from "@/components/ui/numeral";
import { ButtonArrow } from "@/components/ui/button";
import type { Category, Locale } from "@/content";
import { cta, hero } from "@/content/software/page";
import { Link } from "@/i18n/navigation";
import { CONSULT_ID } from "@/lib/prefill";
import { categoryRef } from "@/lib/review";
import { orderNumeral } from "@/lib/roman";
import { Laptop, Phone } from "./device-frames";
import { InterfaceDirector } from "./interface-director";

/** Pin lengths in vh (storyboard: desktop 2.0). Mobile passes, unpinned (batch2-software.md #3). */
export const OPENING_PIN = { desktop: 2.0, mobile: 0 } as const;

/**
 * Act 1 · "The Interface" (storyboards/software-digital.md): a blinking cursor → a wireframe →
 * the UI fills in → a laptop and a phone, live. The H1 (the LCP, text) and the CTAs sit at
 * inline-start from the first frame; the stage is drawn in code (0 KB of images) and hidden from
 * assistive tech (it's a picture of a site). Server-rendered as the still (no JS, reduced
 * motion): the shot-4 frame with every line visible. InterfaceDirector (GSAP) scrubs it.
 */
export async function InterfaceOpening({ category, locale, serviceCount }: { category: Category; locale: Locale; serviceCount: number }) {
  const [tm, ts] = await Promise.all([getTranslations("megaMenu"), getTranslations("scenes")]);
  const lines = ["s1", "s2", "s3", "s4"].map((k) => ts(`software.${k}`));
  const ui = hero.ui;
  return (
    <section data-tone="light" data-grain="off" aria-labelledby="sw-title" className="sw-opening" data-cta-opening="">
      <SectionRef id={categoryRef(category.slug, "opening")} />
      <div className="scene-pin" style={{ "--pin-d": OPENING_PIN.desktop, "--pin-m": OPENING_PIN.mobile } as CSSProperties}>
        <div className="sw-op" data-shot="0">
          <div className="sw-op-grid" aria-hidden="true" />
          <div className="frame sw-op-layout">
            <div className="sw-op-copy">
              <Breadcrumbs current={category.title[locale]} />
              <p className="sw-op-eyebrow text-eyebrow">
                <Numeral>{orderNumeral(category.order, locale)}</Numeral>
                <span aria-hidden="true"> · </span>
                {category.title[locale]}
                <span aria-hidden="true"> · </span>
                {tm("count", { count: serviceCount })}
              </p>
              <h1 id="sw-title" className="sw-op-title">
                {hero.title[locale]}
              </h1>
              <p className="sw-op-sub">{hero.sub[locale]}</p>
              <div className="sw-op-ctas">
                <a href={`#${CONSULT_ID}`} className="sw-btn sw-btn-dark">
                  <span>{cta.book[locale]}</span>
                  <ButtonArrow />
                </a>
                <Link href="/work" className="sw-btn sw-btn-ghost">
                  <span>{cta.work[locale]}</span>
                </Link>
              </div>
              <p className="sw-op-micro">{cta.micro[locale]}</p>
            </div>

            <div className="sw-op-stage" aria-hidden="true">
              <div className="sw-op-glow" />
              <Laptop className="sw-op-laptop" screenClassName="sw-op-screen">
                <div className="sw-art">
                  <span className="sw-caret" />
                  <svg className="sw-wire" viewBox="0 0 320 180" preserveAspectRatio="none">
                    <rect pathLength={1} x="1" y="1" width="318" height="20" />
                    <rect pathLength={1} x="12" y="32" width="296" height="72" />
                    <rect pathLength={1} x="12" y="114" width="90" height="56" />
                    <rect pathLength={1} x="115" y="114" width="90" height="56" />
                    <rect pathLength={1} x="218" y="114" width="90" height="56" />
                  </svg>
                  <span className="sw-wire-label sw-wl-1">{ui.wire[0][locale]}</span>
                  <span className="sw-wire-label sw-wl-2">{ui.wire[1][locale]}</span>
                  <span className="sw-wire-label sw-wl-3">{ui.wire[2][locale]}</span>
                  <div className="sw-ui">
                    <div className="sw-ui-nav">
                      <i className="sw-ui-logo" />
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="sw-ui-hero">
                      <p className="sw-ui-hello">
                        <span>{ui.welcome[locale]}</span>
                        <span className="sw-ui-hello-alt" lang={locale === "ar" ? "en" : "ar"}>
                          {ui.welcomeOther[locale]}
                        </span>
                      </p>
                      <span className="sw-ui-btn">{ui.button[locale]}</span>
                      <span className="sw-ui-states">
                        <b>{ui.states[0][locale]}</b>
                        <b>{ui.states[1][locale]}</b>
                        <b className="is-on">{ui.states[2][locale]}</b>
                      </span>
                    </div>
                    <div className="sw-ui-card" />
                    <div className="sw-ui-card" />
                    <div className="sw-ui-card" />
                  </div>
                </div>
              </Laptop>
              <Phone className="sw-op-phone" screenClassName="sw-op-pscreen">
                <div className="sw-ui sw-ui-m">
                  <div className="sw-ui-nav">
                    <i className="sw-ui-logo" />
                  </div>
                  <div className="sw-ui-hero">
                    <p className="sw-ui-hello">
                      <span>{ui.welcome[locale]}</span>
                    </p>
                    <span className="sw-ui-btn">{ui.button[locale]}</span>
                  </div>
                  <div className="sw-ui-card" />
                  <div className="sw-ui-card" />
                </div>
              </Phone>
              <span className="sw-live">
                <i />
                {ui.live[locale]}
              </span>
            </div>
          </div>
          {/* The shot lines: one at a time while it plays; the still reads them as one short line. */}
          <div className="frame sw-op-lines-box">
            <p className="sw-op-lines">
              {lines.map((line, i) => (
                <span key={i} className="sw-op-line" data-line={i}>
                  {line}{" "}
                </span>
              ))}
            </p>
          </div>
          <InterfaceDirector />
        </div>
      </div>
    </section>
  );
}
