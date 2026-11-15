import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { QUOTE_LINK } from "@/components/layout/nav-links";
import { CaseMedia, showsIllustrative } from "@/components/pages/case-media";
import { PageCrumbs } from "@/components/pages/page-crumbs";
import { SectionRef } from "@/components/review/section-ref";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { SITE_URL } from "@/config/site";
import { BREADCRUMB_LABELS, categoryHref, getCategory, getServices, serviceHref, workHref, WORK_INDEX_HREF, type Locale } from "@/content";
import { RELATED_WORK_COPY } from "@/content/related-work";
import { nextWork, workView, type WorkItem } from "@/content/work";
import { Link } from "@/i18n/navigation";
import { trailJsonLd, workCaseJsonLd } from "@/lib/jsonld";
import { PAGE_REF } from "@/lib/review";
import "@/components/motion/duotone.css";
import "./work.css";

/** The section menu appears only when the case has this many sections (F1); fewer read at a glance. */
const TOC_MIN = 4;

/**
 * The case template (F1): key facts → Challenge → Idea → Execution → Result → scope → next case
 * and CTA. A story part the profile doesn't support isn't in the data, so its section isn't
 * rendered (fill or hide, D78). The version follows WORK_NAMED: anonymous until the client
 * approves, and the story is written without names, so it reads true either way.
 */
export async function WorkCase({ item, locale }: { item: WorkItem; locale: Locale }) {
  const [t, tw, tm] = await Promise.all([getTranslations("workCase"), getTranslations("work"), getTranslations("markets")]);
  const view = workView(item);
  const next = workView(nextWork(item));
  const { story } = item;
  const path = workHref(item.slug);
  const categories = item.categories.map((c) => getCategory(c)!);
  const services = getServices().filter((s) => story.scope.includes(s.slug));
  const home = categories[0];

  const sections = [
    story.challenge && { id: "challenge", label: tw("labels.challenge") },
    story.idea && { id: "idea", label: tw("labels.idea") },
    { id: "execution", label: tw("labels.execution") },
    story.result && { id: "result", label: tw("labels.result") },
    services.length > 0 && { id: "scope", label: t("scopeTitle") },
  ].filter((s): s is { id: string; label: string } => Boolean(s));

  return (
    <main id="main" className="wc">
      <JsonLd
        data={[
          workCaseJsonLd({ label: view.label[locale], summary: view.summary[locale], path, genres: categories.map((c) => c.title[locale]) }, locale, SITE_URL),
          trailJsonLd(
            [
              { name: BREADCRUMB_LABELS.work[locale], path: WORK_INDEX_HREF },
              { name: view.label[locale], path },
            ],
            locale,
            SITE_URL,
          ),
        ]}
      />

      <section data-tone="dark" aria-labelledby="wc-title" className="pg-open">
        <SectionRef id={PAGE_REF.caseOpening} />
        <div className="frame">
          <PageCrumbs trail={[{ href: WORK_INDEX_HREF, label: BREADCRUMB_LABELS.work[locale] }]} current={view.label[locale]} />
          <p className="wc-eyebrow text-eyebrow">{categories.map((c) => c.title[locale]).join(" · ")}</p>
          <h1 id="wc-title" className="text-h1 wc-title">
            {view.label[locale]}
          </h1>
          <p className="wc-summary text-lead">{view.summary[locale]}</p>
          <div className={view.named || showsIllustrative(view) ? "wc-media duotone" : "wc-media"}>
            <CaseMedia view={view} locale={locale} sizes="(min-width: 1280px) 1232px, 100vw" />
          </div>
          <dl className="wc-facts" aria-label={t("factsLabel")}>
            <div className="wc-fact">
              <dt className="text-eyebrow">{t("client")}</dt>
              <dd>{view.label[locale]}</dd>
            </div>
            <div className="wc-fact">
              <dt className="text-eyebrow">{t("market")}</dt>
              <dd>{item.markets.map((m) => tm(`countries.${m}`)).join(" · ")}</dd>
            </div>
            {story.facts.map((f) => (
              <div key={f.label.en} className="wc-fact">
                <dt className="text-eyebrow">{f.label[locale]}</dt>
                <dd>{f.value[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {sections.length >= TOC_MIN && (
        <nav aria-label={t("onThisPage")} className="wc-toc">
          <ul className="frame">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {story.challenge && <TextSection id="challenge" refId={PAGE_REF.caseChallenge} label={tw("labels.challenge")} text={story.challenge[locale]} />}
      {story.idea && <TextSection id="idea" refId={PAGE_REF.caseIdea} label={tw("labels.idea")} text={story.idea[locale]} />}

      <section id="execution" data-tone="light" aria-labelledby="wc-execution" className="wc-sec">
        <SectionRef id={PAGE_REF.caseExecution} />
        <div className="frame wc-grid">
          <h2 id="wc-execution" className="wc-label">
            {tw("labels.execution")}
          </h2>
          <div>
            <p className="wc-lead">{story.execution.lead[locale]}</p>
            <ul className="wc-points">
              {story.execution.points[locale].map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {story.result && (
        <section id="result" data-tone="dark" aria-labelledby="wc-result" className="wc-sec">
          <SectionRef id={PAGE_REF.caseResult} />
          <div className="frame wc-grid">
            <h2 id="wc-result" className="wc-label">
              {tw("labels.result")}
            </h2>
            <div>
              <p className="wc-lead">{story.result.lead[locale]}</p>
              {story.result.figures && story.result.figures.length > 0 && (
                <dl className="wc-figures">
                  {story.result.figures.map((f) => (
                    <div key={f.label.en} className="wc-figure">
                      <dt>{f.label[locale]}</dt>
                      <dd className="tabular">
                        {f.value[locale]}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {story.result.scope && <p className="wc-scope-note">{story.result.scope[locale]}</p>}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section id="scope" data-tone="light" aria-labelledby="wc-scope" className="wc-sec">
          <SectionRef id={PAGE_REF.caseScope} />
          <div className="frame wc-grid">
            <div>
              <h2 id="wc-scope" className="wc-label">
                {t("scopeTitle")}
              </h2>
              <p className="wc-scope-intro">{t("scopeIntro")}</p>
            </div>
            <ul className="wc-services">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s)} className="wc-service">
                    <span>
                      <strong>{s.title[locale]}</strong>
                      <small>{getCategory(s.category)!.title[locale]}</small>
                    </span>
                    <ArrowRight aria-hidden="true" strokeWidth={1.25} className="rtl:-scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section data-tone="dark" aria-label={t("next")} className="wc-sec">
        <SectionRef id={PAGE_REF.caseNext} />
        <div className="frame">
          <div className="wc-end">
            <div className="wc-next">
              <p className="text-eyebrow text-champagne">{t("next")}</p>
              <p className="wc-next-name">
                <Link href={workHref(next.slug)} className="wc-next-link">
                  {next.label[locale]}
                </Link>
              </p>
              <p>{next.summary[locale]}</p>
            </div>
            <div className="wc-cta">
              <h2 className="text-h2">{t("ctaTitle")}</h2>
              <p>{t("ctaBody")}</p>
              {QUOTE_LINK.live ? (
                <ButtonLink href={QUOTE_LINK.href} variant="primary" arrow>
                  {t("ctaQuote")}
                </ButtonLink>
              ) : (
                <ButtonLink href={categoryHref(home.slug)} variant="primary" arrow>
                  {t("ctaCategory", { category: home.title[locale] })}
                </ButtonLink>
              )}
            </div>
          </div>
          {!view.named && (
            <p className="wc-note">
              {RELATED_WORK_COPY.note[locale]}
              {showsIllustrative(view) && ` ${RELATED_WORK_COPY.illustrative[locale]}`}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function TextSection({ id, refId, label, text }: { id: string; refId: (typeof PAGE_REF)[keyof typeof PAGE_REF]; label: string; text: string }) {
  return (
    <section id={id} data-tone="light" aria-labelledby={`wc-${id}`} className="wc-sec">
      <SectionRef id={refId} />
      <div className="frame wc-grid">
        <h2 id={`wc-${id}`} className="wc-label">
          {label}
        </h2>
        <p className="wc-lead">{text}</p>
      </div>
    </section>
  );
}
