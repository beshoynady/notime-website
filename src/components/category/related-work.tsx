import { FrameCorners } from "@/components/ornaments/frame-corners";
import { SectionRef } from "@/components/review/section-ref";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { BrandImage } from "@/components/ui/brand-image";
import { getCategory, getImageSlot, type CategorySlug, type Locale } from "@/content";
import { RELATED_WORK_COPY as T, relatedWork } from "@/content/related-work";
import { categoryRef } from "@/lib/review";
import "./related-work.css";

/**
 * Related work (v1 plan, Phase C; spec §4 part 4), before the FAQ and the quote area on every
 * category page: the category's cases from `work.ts`, anonymised until each client approves its
 * name (D78 §6). Hidden when the category has none.
 *
 * Media: the case's stand-in slot (a named case's own photos join with the /work template, F1); it carries
 * "Illustrative" through BrandImage once it has a file. A slot with no file yet shows the designed
 * ground with no tag and no claim, as on the homepage (D84). No links until /work exists (F1).
 */
export function RelatedWork({ category, locale, tone }: { category: CategorySlug; locale: Locale; tone: "dark" | "light" }) {
  const cases = relatedWork(category);
  if (cases.length === 0) return null;
  const anyIllustrative = cases.some(({ view }) => view.image && getImageSlot(view.image).src);
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
              const slot = c.image ? getImageSlot(c.image) : undefined;
              return (
                <li key={c.key} className="rw-card">
                  <div className="rw-media">
                    {slot?.src ? (
                      <BrandImage slot={slot.id} sizes="(min-width: 900px) 34vw, 100vw" fill decorative />
                    ) : (
                      <AiPlaceholder paint={slot?.paint ?? "event"} showTag={false} />
                    )}
                    <FrameCorners inset="md" />
                  </div>
                  <ul className="rw-meta text-eyebrow">
                    {/* The other categories the case spans; this page's own is implied. */}
                    {also.map((cat) => (
                      <li key={cat}>{getCategory(cat)?.title[locale]}</li>
                    ))}
                  </ul>
                  <h3 className="rw-name">{c.label[locale]}</h3>
                  <p className="rw-summary">{c.summary[locale]}</p>
                </li>
              );
            })}
          </ul>
          <p className="rw-note">
            {T.note[locale]}
            {anyIllustrative && ` ${T.illustrative[locale]}`}
          </p>
        </div>
      </div>
    </section>
  );
}
