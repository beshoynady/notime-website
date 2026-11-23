import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { HERO_LINE } from "@/config/hero";
import { contactCategoryHref, WORK_INDEX_HREF } from "@/content/links";

/**
 * The approved hero copy, shared by the three options (hero-options branch, not merged): the
 * eyebrow, the two-line title (its name is the sentence-case label), the lead and both actions.
 * Nothing animates the title's own box, so it stays the LCP element (D156).
 */
export async function HxCopy({ variant }: { variant: "a" | "b" | "c" }) {
  const t = await getTranslations("hero");
  return (
    <div className={`hx-copy hx-copy-${variant}`}>
      <p className="hx-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
      <h1 id="hero-title" className="hx-title" aria-label={t(`title.${HERO_LINE}.label`)}>
        <span className="hx-line" aria-hidden="true">
          {t("titleLine1")}
        </span>
        <span className="hx-line" aria-hidden="true">
          <b>{t(`title.${HERO_LINE}.line2`)}</b>
        </span>
      </h1>
      <div className="hx-sub">
        <p className="hx-lead text-lead">{t("lead")}</p>
        <div className="hx-actions">
          <ButtonLink href={contactCategoryHref("events-hospitality")} arrow data-cursor="">
            {t("cta")}
          </ButtonLink>
          <ButtonLink href={WORK_INDEX_HREF} variant="ghost" data-cursor="">
            {t("ctaWork")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
