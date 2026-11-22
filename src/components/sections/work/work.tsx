import { getLocale, getTranslations } from "next-intl/server";
import { HoverSweep } from "@/components/motion/hover-sweep";
import { SectionRef } from "@/components/review/section-ref";
import { CaseMedia } from "@/components/pages/case-media";
import { getCategory, workHref, WORK_INDEX_HREF, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { workCards } from "@/content/work";
import { HOME_REF } from "@/lib/review";
import { Showreel } from "./showreel";
import "@/components/motion/duotone.css";
import "./work.css";

/**
 * Home · Our work (H-04, dark). The cases from `work.ts`, anonymised until each client approves its
 * name (D78 §6), then "Rooms we dressed", the collection of Rand's own halls (D164, the approved move
 * of that tile to Work): the descriptor, the categories it spans and the verified facts.
 *
 * Media: the case's own photo (`cover`), named or not (D150: the client shows in it, so Rand approves
 * it; the text stays anonymous). Never a stand-in photo (D106); a hidden cover leaves the card as text.
 * Each card opens its case page (F1): the title is the link; the media repeats it for pointers only
 * (out of the tab order and hidden from assistive tech, so each case is one stop and one name).
 * "Watch the reel" opens the showreel (H-09) from the header: the reel as the first proof, never
 * autoplaying (benchmarks).
 */
/** The collection home shows after the cases. */
const HOME_COLLECTION = "rooms-we-dressed";

export async function Work() {
  const [t, tr, locale] = await Promise.all([getTranslations("work"), getTranslations("reel"), getLocale() as Promise<Locale>]);
  const cards = workCards().filter((c) => c.kind === "case" || c.slug === HOME_COLLECTION);
  return (
    <section id="work" data-tone="dark" aria-labelledby="work-title" className="section-pad">
      <SectionRef id={HOME_REF.work} />
      <div className="frame">
        <header className="work-head">
          <div>
            <p className="sec-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
            <h2 id="work-title" className="text-h1">
              {t("headingLead")} <b>{t("headingKey")}</b>
            </h2>
          </div>
          <div className="work-aside">
            <p className="work-intro text-lead">{t("intro")}</p>
            <Showreel
              labels={{
                open: tr("open"),
                title: tr("title"),
                description: tr("description"),
                close: tr("close"),
                pause: tr("pause"),
                play: tr("play"),
                previous: tr("previous"),
                next: tr("next"),
                frame: tr.raw("frame") as string,
              }}
            />
            <Link href={WORK_INDEX_HREF} className="text-link">
              {t("allWork")}
            </Link>
          </div>
        </header>
        <ul className="work-grid">
          {cards.map(({ slug, categories, label, summary, cover }, i) => (
            <li key={slug} className="work-card" data-lead={i === 0 ? "" : undefined}>
              {cover && (
                <Link href={workHref(slug)} tabIndex={-1} aria-hidden="true" className="work-media-link">
                  <HoverSweep className="work-media">
                    <CaseMedia cover={cover} locale={locale} sizes={i === 0 ? "(min-width: 900px) 58vw, 100vw" : "(min-width: 900px) 40vw, 100vw"} />
                  </HoverSweep>
                </Link>
              )}
              <div className="work-body">
                <ul className="work-meta text-eyebrow" aria-label={t("spansLabel")}>
                  {categories.map((c) => (
                    <li key={c}>{getCategory(c)?.title[locale]}</li>
                  ))}
                </ul>
                <h3 className="work-title">
                  <Link href={workHref(slug)} className="work-link">
                    {label[locale]}
                  </Link>
                </h3>
                <p className="work-summary">{summary[locale]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
