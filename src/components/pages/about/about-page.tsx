import { getTranslations } from "next-intl/server";
import { QUOTE_LINK } from "@/components/layout/nav-links";
import { LightLeak } from "@/components/ornaments/light-leak";
import { PageCrumbs } from "@/components/pages/page-crumbs";
import { SectionRef } from "@/components/review/section-ref";
import { MarketsBoard } from "@/components/sections/markets/markets-board";
import { PhotoStory } from "@/components/sections/photo-story/photo-story";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Numeral } from "@/components/ui/numeral";
import { serviceCount } from "@/lib/service-count";
import { SITE_URL } from "@/config/site";
import { ABOUT_HREF, BREADCRUMB_LABELS, SERVICES_INDEX_HREF, WORK_INDEX_HREF, type Locale } from "@/content";
import { markets } from "@/content/markets";
import { ROOM_STORY } from "@/content/photo-stories";
import { principles } from "@/content/principles";
import { Link } from "@/i18n/navigation";
import { trailJsonLd } from "@/lib/jsonld";
import { marketTime } from "@/lib/market-time";
import { PAGE_REF } from "@/lib/review";
import "@/components/sections/markets/markets.css";
import "./about.css";

const FIGURES = ["markets", "services"] as const; // the profile's two usable figures (p3)
const STORY = ["story1", "story2", "story3", "story4"] as const;

/** Each market's UTC offset on the build date (cached, as on the homepage board). */
async function buildOffsets(): Promise<Record<string, string>> {
  "use cache";
  const now = new Date();
  return Object.fromEntries(markets.map((m) => [m.key, marketTime(now, m.timeZone).offset]));
}

/**
 * /about (F2). The story from the profile's About page (p3: a Dubai events, marketing and PR house;
 * the brand-meets-audience line; strategy → creative → production → delivery by one team), its two
 * usable figures, the four principles in place of a team section (D78 §5, D88 §4), the six
 * markets on the homepage's clock board, one evening told in real photos (PhotoStory, D109), and a closing that never dead-ends. No years, counts,
 * awards, logos or testimonials (fill or hide, D78).
 */
export async function AboutPage({ locale }: { locale: Locale }) {
  const [t, ta, tm, tc, th, offsets] = await Promise.all([
    getTranslations("aboutPage"),
    getTranslations("about"),
    getTranslations("markets"),
    getTranslations("cta"),
    getTranslations("hero"),
    buildOffsets(),
  ]);
  const rows = markets.map((m) => ({ key: m.key, timeZone: m.timeZone, base: m.base, name: tm(`countries.${m.key}`), offset: offsets[m.key] }));

  return (
    <main id="main" className="ab">
      <JsonLd data={[trailJsonLd([{ name: BREADCRUMB_LABELS.about[locale], path: ABOUT_HREF }], locale, SITE_URL)]} />

      <section data-tone="dark" aria-labelledby="ab-title" className="pg-open ab-open" data-cta-opening="">
        <SectionRef id={PAGE_REF.aboutStory} />
        <div className="frame">
          <PageCrumbs current={BREADCRUMB_LABELS.about[locale]} />
          <p className="sec-eyebrow text-eyebrow text-champagne">{ta("eyebrow")}</p>
          <h1 id="ab-title" className="ab-title">
            {t("title")}
          </h1>
          <div className="ab-story-grid">
            <div className="ab-story">
              {STORY.map((k, i) => (
                <p key={k} className={i === 0 ? "text-lead ab-story-lead" : "ab-story-p"}>
                  {t(k)}
                </p>
              ))}
              <Link href={WORK_INDEX_HREF} className="text-link">
                {t("seeWork")}
              </Link>
            </div>
            <dl className="ab-figures">
              {FIGURES.map((k) => (
                <div key={k}>
                  <dt className="text-eyebrow">{ta(`stats.${k}.label`)}</dt>
                  <dd className="tabular">{k === "services" ? <Numeral>{String(serviceCount())}</Numeral> : ta(`stats.${k}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* One evening in four beats, on real photos: the split screen (D109). */}
      <PhotoStory id="ab-room" eyebrow={ROOM_STORY.eyebrow} title={ROOM_STORY.title} beats={ROOM_STORY.beats} locale={locale} />

      <section data-tone="light" aria-labelledby="ab-principles" className="ab-principles section-pad">
        <SectionRef id={PAGE_REF.aboutPrinciples} />
        <div className="frame">
          <header className="ab-head">
            <p className="sec-eyebrow text-eyebrow text-cocoa">{t("principlesEyebrow")}</p>
            <h2 id="ab-principles" className="text-h1 ab-h2">
              {t("principlesTitle")}
            </h2>
          </header>
          {/* Not a sequence (principles.ts), so the list is unnumbered. */}
          <ul className="ab-principle-list">
            {principles.map((p) => (
              <li key={p.key} className="ab-principle">
                <h3 className="ab-principle-title">{p.title[locale]}</h3>
                <p className="ab-principle-line">{p.line[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="ab-markets" className="section-pad ab-markets">
        <SectionRef id={PAGE_REF.aboutMarkets} />
        <div className="frame markets-grid">
          <header className="markets-head">
            <p className="sec-eyebrow text-eyebrow text-cocoa">{tm("eyebrow")}</p>
            <h2 id="ab-markets" className="text-h1">
              {tm("headingLead")} <b>{tm("headingKey")}</b>
            </h2>
          </header>
          <MarketsBoard rows={rows} labels={{ base: tm("base"), localTime: tm("localTime") }} />
        </div>
      </section>

      <section data-tone="dark" aria-labelledby="ab-cta" className="section-pad ab-cta">
        <SectionRef id={PAGE_REF.aboutCta} />
        <LightLeak position="end-top" />
        <div className="frame ab-cta-frame">
          <h2 id="ab-cta" className="text-h1 ab-cta-title">
            {tc("headingLead")} <b>{tc("headingKey")}</b>
          </h2>
          <p className="text-lead ab-cta-body">{QUOTE_LINK.live ? tc("body") : tc("bodyInterim")}</p>
          <div className="ab-cta-actions">
            {QUOTE_LINK.live ? (
              <ButtonLink href={QUOTE_LINK.href} variant="primary" arrow>
                {tc("primary")}
              </ButtonLink>
            ) : (
              <ButtonLink href={SERVICES_INDEX_HREF} variant="primary" arrow>
                {th("cta")}
              </ButtonLink>
            )}
            <Link href={WORK_INDEX_HREF} className="text-link">
              {t("seeWork")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
