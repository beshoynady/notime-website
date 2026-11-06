import { getTranslations } from "next-intl/server";
import { formatTimecode } from "@/lib/time";

/**
 * Camera HUD in the four corners (decorative, aria-hidden). The timecode is always LTR
 * with tabular figures; HeroScene updates it per frame. Coordinates hide at ≤600px.
 */
export async function HeroHud() {
  const t = await getTranslations("hud");
  return (
    <div className="hero-hud" aria-hidden="true">
      <div className="hero-hud-tl" data-hud="">
        <span className="hero-rec" />
        <span>{t("scene")}</span>
      </div>
      {/* dir="ltr" sits on the inner span so the box itself still mirrors to the RTL top-end. */}
      <div className="hero-hud-tr" data-hud="">
        <span dir="ltr" lang="en" data-hero-tc="">
          {formatTimecode(0)}
        </span>
      </div>
      {/* Coordinates are always LTR; only the city is localized (keeps bidi order intact in AR). */}
      <div className="hero-hud-bl" data-hud="">
        <span dir="ltr" lang="en">
          {t("coords")}
        </span>
        <span>—</span>
        <span>{t("city")}</span>
      </div>
      <div className="hero-hud-br" data-hud="">
        <span>{t("scroll")}</span>
        <i className="hero-cue" />
      </div>
    </div>
  );
}
