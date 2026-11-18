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
 * still, one screen, unpinned: breadcrumbs, eyebrow, the H1 (text), the last shot line as the
 * lead (the promise), "Request a quote" (the header's string, to the brief with the category
 * hinted, as the CTA bar) and the skip control. On desktop with motion the pinned build scene
 * follows it (the same scene, its shots and its reservation); on phones, under reduced motion and
 * without JS it isn't shown (`.cat-build`, category.css) and builds no ScrollTrigger (SceneDirector's
 * desktop-only matchMedia). The intro comes after both. Without a scene (until a category's scene
 * is approved) it's a static opening with no pin and no image.
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
            {tm("count", { count: serviceCount })}
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
          <LayeredScene scene={scene} lines={[]} variant={variant} mode="still" overlayClassName="frame cat-opening-overlay">
            {head}
          </LayeredScene>
          <div className="cat-build">
            <LayeredScene
              scene={scene}
              lines={scene.shots.map((s) => (s.copyKey ? ts(s.copyKey) : ""))}
              variant={variant}
              mode="build"
              desktopOnly
              overlayClassName="frame cat-opening-overlay"
            />
          </div>
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
