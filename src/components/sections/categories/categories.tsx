import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SERVICES_HREF } from "@/components/layout/nav-links";
import { Link } from "@/i18n/navigation";
import { CategoryCards } from "./category-cards";

/**
 * Home · Categories (light). The hero CTA and the menus point here (#services). The page turns
 * light on arrival (ToneController), so the espresso cards read as objects on ivory.
 */
export async function Categories() {
  const t = await getTranslations("categories");
  return (
    <section id="services" data-tone="light" aria-labelledby="services-title" className="section-pad scroll-mt-[var(--header-h)]">
      <div className="frame">
        <header className="cats-head">
          <div>
            <p className="sec-eyebrow text-eyebrow text-cocoa">{t("eyebrow")}</p>
            <h2 id="services-title" className="text-h1">
              {t("headingLead")} <b>{t("headingKey")}</b>
            </h2>
          </div>
          <p className="cats-intro text-lead">{t("intro")}</p>
        </header>
        <CategoryCards />
        <div className="cats-foot">
          {/* TODO: replace placeholder — the services index page arrives in a later phase. */}
          <Link href={SERVICES_HREF} className="text-link">
            {t("allServices")}
            <ArrowRight aria-hidden="true" strokeWidth={1.25} className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
