import { ArrowDown } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { LayeredScene } from "@/components/scenes/layered-scene";
import { Numeral } from "@/components/ui/numeral";
import type { Category, Locale } from "@/content";
import type { SceneConfig } from "@/content/scenes";
import { toRoman } from "@/lib/roman";
import { Breadcrumbs } from "./breadcrumbs";
import { THEME_TONE } from "./theme";

/**
 * Category page · Act 1, the opening (D64; storyboards README §2): breadcrumbs, eyebrow, the H1
 * (text, the LCP element), the skip control, then the intro. With a scene, all of it sits on
 * the LayeredScene overlay and the shot lines follow; without one (until a category's scene is
 * approved) it's a static opening with no pin and no image.
 *
 * The skip control is a hash link, so the anchor utility lands it on the first service's H2
 * (D53) and it works without JS. It comes right after the H1 in the DOM (the first Tab stop
 * after the breadcrumbs) and shows at the opening's bottom, at inline-end. It leaves with the
 * opening (the curtain), so it needs no hiding of its own.
 * The service index is not in here: it's a track beside the whole page (CategoryView).
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

  const head = (
    <>
      <Breadcrumbs current={category.title[locale]} />
      <div className="cat-opening-head">
        <p className="sec-eyebrow text-eyebrow cat-opening-eyebrow">
          <span>
            <Numeral>{toRoman(category.order)}</Numeral>
            <span aria-hidden="true"> · </span>
            {tm("count", { count: serviceCount })}
          </span>
        </p>
        <h1 id="category-title" className="text-h1">
          {category.title[locale]}
        </h1>
      </div>
      <a href={`#${firstAnchor}`} className="cat-skip">
        {t("skip")}
        <ArrowDown aria-hidden="true" strokeWidth={1.25} className="size-4" />
      </a>
      {/* TODO: replace placeholder — category intros are written per category (Task 3.1 and later). */}
      <p className="cat-opening-intro text-lead">{category.intro[locale]}</p>
    </>
  );

  return (
    <section data-tone={THEME_TONE[category.theme]} data-grain="off" aria-labelledby="category-title" className="cat-opening">
      {scene ? (
        <LayeredScene
          scene={scene}
          lines={scene.shots.map((s) => ts(s.copyKey))}
          variant={variant}
          overlayClassName="frame cat-opening-overlay"
        >
          {head}
        </LayeredScene>
      ) : (
        <div className="frame cat-opening-overlay cat-opening-static">{head}</div>
      )}
    </section>
  );
}
