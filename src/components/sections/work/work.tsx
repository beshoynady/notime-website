import { getLocale, getTranslations } from "next-intl/server";
import { HoverSweep } from "@/components/motion/hover-sweep";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { SectionRef } from "@/components/review/section-ref";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { BrandImage } from "@/components/ui/brand-image";
import { getCategory, getImageSlot, type Locale } from "@/content";
import { workItems, workView } from "@/content/work";
import { HOME_REF } from "@/lib/review";
import { Showreel } from "./showreel";
import "@/components/motion/duotone.css";
import "./work.css";

/**
 * Home · Our work (H-04, dark). The three cases from `work.ts`, anonymised until each client
 * approves its name (D78 §6): the descriptor, the categories it spans and the verified facts.
 *
 * Media: a case's own photos once named; until then its stand-in slot (stock or ChatGPT, D80),
 * which carries "Illustrative" through BrandImage. A slot with no file yet shows the designed
 * ground with no tag and no claim. Duotone → colour on hover applies to real files only.
 * No links while /work is unbuilt (fill or hide, D78); the cards become links with Task F1.
 * "Watch the reel" opens the showreel (H-09) from the header: the reel as the first proof, never
 * autoplaying (benchmarks).
 */
export async function Work() {
  const [t, tr, locale] = await Promise.all([getTranslations("work"), getTranslations("reel"), getLocale() as Promise<Locale>]);
  const cases = workItems.map((w) => ({ item: w, view: workView(w) }));
  const anyIllustrative = cases.some(({ view }) => view.image && getImageSlot(view.image).src);
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
          </div>
        </header>
        <ul className="work-grid">
          {cases.map(({ item, view }, i) => {
            const slot = view.image ? getImageSlot(view.image) : undefined;
            const media = view.named ? undefined : slot;
            return (
              <li key={view.key} className="work-card" data-lead={i === 0 ? "" : undefined}>
                <HoverSweep className="work-media">
                  {media?.src ? (
                    <div className="duotone absolute inset-0">
                      <BrandImage slot={media.id} sizes={i === 0 ? "(min-width: 900px) 58vw, 100vw" : "(min-width: 900px) 40vw, 100vw"} fill />
                    </div>
                  ) : (
                    <AiPlaceholder paint={media?.paint ?? "event"} showTag={false} />
                  )}
                  <FrameCorners inset="md" />
                </HoverSweep>
                <div className="work-body">
                  <ul className="work-meta text-eyebrow" aria-label={t("spansLabel")}>
                    {item.categories.map((c) => (
                      <li key={c}>{getCategory(c)?.title[locale]}</li>
                    ))}
                  </ul>
                  <h3 className="work-title">{view.label[locale]}</h3>
                  <p className="work-summary">{view.summary[locale]}</p>
                </div>
              </li>
            );
          })}
        </ul>
        {anyIllustrative && <p className="work-note">{t("illustrativeNote")}</p>}
      </div>
    </section>
  );
}
