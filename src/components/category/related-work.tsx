import { SectionRef } from "@/components/review/section-ref";
import { CaseMedia } from "@/components/pages/case-media";
import { getCategory, workHref, type CategorySlug, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { RELATED_WORK_COPY as T, relatedWork } from "@/content/related-work";
import { categoryRef } from "@/lib/review";
import "./related-work.css";

/**
 * Related work (v1 plan, Phase C; spec §4 part 4), before the FAQ and the quote area on every
 * category page: the category's cases from `work.ts`, anonymised until each client approves its
 * name (D78 §6). Hidden when the category has none.
 *
 * Media: CaseMedia, as on the homepage (a drawing of the work while anonymous, D106). Each card opens its case page (F1):
 * the name is the link; the media repeats it for pointers only (out of the tab order).
 */
export function RelatedWork({ category, locale, tone }: { category: CategorySlug; locale: Locale; tone: "dark" | "light" }) {
  const cases = relatedWork(category);
  if (cases.length === 0) return null;
  return (
    <section className="rw cat-end" data-tone={tone} aria-labelledby="related-title">
      <SectionRef id={categoryRef(category, "related")} />
      <div className="cat-end-grid frame">
        <header className="cat-end-head">
          <p className="text-eyebrow">{T.eyebrow[locale]}</p>
          <h2 id="related-title" className="rw-title">
            {T.title[locale]}
          </h2>
        </header>
        <div className="rw-body">
          <ul className="rw-list">
            {cases.map(({ view: c, also }) => {
              return (
                <li key={c.key} className="rw-card">
                  <Link href={workHref(c.slug)} tabIndex={-1} aria-hidden="true" className="rw-media">
                    <CaseMedia view={c} locale={locale} sizes="(min-width: 900px) 34vw, 100vw" />
                  </Link>
                  <ul className="rw-meta text-eyebrow">
                    {/* The other categories the case spans; this page's own is implied. */}
                    {also.map((cat) => (
                      <li key={cat}>{getCategory(cat)?.title[locale]}</li>
                    ))}
                  </ul>
                  <h3 className="rw-name">
                    <Link href={workHref(c.slug)} className="rw-link">
                      {c.label[locale]}
                    </Link>
                  </h3>
                  <p className="rw-summary">{c.summary[locale]}</p>
                </li>
              );
            })}
          </ul>
          <p className="rw-note">
            {T.note[locale]}
          </p>
        </div>
      </div>
    </section>
  );
}
