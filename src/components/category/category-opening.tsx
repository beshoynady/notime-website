import { ArrowDown } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { LayeredScene } from "@/components/scenes/layered-scene";
import { ButtonLink } from "@/components/ui/button";
import { Numeral } from "@/components/ui/numeral";
import type { Category, Locale } from "@/content";
import type { SceneConfig } from "@/content/scenes";
import { orderNumeral } from "@/lib/roman";
import { stillLead } from "@/lib/scene-math";
import { Breadcrumbs } from "./breadcrumbs";
import { THEME_TONE } from "./theme";
import { SectionRef } from "@/components/review/section-ref";
import { categoryRef } from "@/lib/review";

/**
 * Category page · Act 1, the opening (D64; N06): with a scene, the hero is the scene's finished
 * still, one screen, unpinned (a scene marked `hero`, D154, plays its film pinned from 1024px and is
 * that still below; the head below is on screen from the first frame either way): breadcrumbs, eyebrow, the H1 (text), the last shot line as the
 * lead (the promise), "Request a quote" (the header's string, to the brief with the category
 * hinted, as the CTA bar) and the skip control. Only a `hero` scene pins (from 1024px, through
 * LayeredScene's SceneDirector); a plain still builds no ScrollTrigger. The intro follows the hero. Without
 * a scene (until a category's scene is approved) it's a static opening with no image.
 *
 * The skip control is a hash link, so the anchor utility lands it on the first service's H2
 * (D53) and it works without JS. In the hero it follows "Request a quote" (DOM and screen order
 * match: breadcrumbs, quote, skip, then the index). The service index is not in here: it's a
 * track beside the whole page (CategoryView).
 */
export async function CategoryOpening({
  category,
  serviceCount,
  firstAnchor,
  scene,
  variant = "live",
}: {
  category: Category;
  serviceCount: number;
  firstAnchor: string;
  scene?: SceneConfig;
  variant?: "live" | "animatic";
}) {
  const locale = (await getLocale()) as Locale;
  const tm = await getTranslations("megaMenu");
  const t = await getTranslations("category");
  const ts = await getTranslations("scenes");
  const th = await getTranslations("header");
  const leadKey = scene && stillLead(scene.shots);
  const tone = THEME_TONE[category.theme];

  const head = (
    <>
      <Breadcrumbs current={category.title[locale]} />
      <div className="cat-opening-head">
        <p className="sec-eyebrow text-eyebrow cat-opening-eyebrow">
          <span>
            <Numeral>{orderNumeral(category.order, locale)}</Numeral>
            <span aria-hidden="true"> · </span>
            {/* Isolated like the numeral: index, then count, in both directions (N06). */}
            <bdi className="cat-opening-count">{tm("count", { count: serviceCount })}</bdi>
          </span>
        </p>
        <h1 id="category-title" className="text-h1">
          {category.title[locale]}
        </h1>
        {leadKey && <p className="cat-opening-lead">{ts(leadKey)}</p>}
      </div>
      <div className="cat-opening-actions">
        <ButtonLink href={`/contact?category=${category.slug}`} variant={tone === "dark" ? "primary" : "dark"} arrow className="cat-opening-quote">
          {th("quote")}
        </ButtonLink>
        <a href={`#${firstAnchor}`} className="cat-skip">
          {t("skip")}
          <ArrowDown aria-hidden="true" strokeWidth={1.25} className="size-4" />
        </a>
      </div>
    </>
  );
  // TODO: replace placeholder — category intros are written per category (Task 3.1 and later).
  const intro = <p className="cat-opening-intro text-lead">{category.intro[locale]}</p>;

  return (
    <section data-tone={tone} data-grain="off" aria-labelledby="category-title" className="cat-opening" data-cta-opening="">
      <SectionRef id={categoryRef(category.slug, "opening")} />
      {scene ? (
        <>
          <LayeredScene scene={scene} lines={[]} variant={variant} mode={scene.hero ? "hero" : "still"} overlayClassName="frame cat-opening-overlay">
            {head}
          </LayeredScene>
          <div className="frame cat-opening-overlay cat-opening-after">{intro}</div>
        </>
      ) : (
        <div className="frame cat-opening-overlay cat-opening-static">
          {head}
          {intro}
        </div>
      )}
    </section>
  );
}
