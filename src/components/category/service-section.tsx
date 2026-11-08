import { getLocale, getTranslations } from "next-intl/server";
import { ModulePlaceholder } from "@/components/modules/module-placeholder";
import { ModuleSlot } from "@/components/modules/module-slot";
import { ButtonLink } from "@/components/ui/button";
import { Numeral } from "@/components/ui/numeral";
import { quoteHref, type Locale, type Service } from "@/content";
import { toRoman } from "@/lib/roman";

/**
 * One service on its category page (spec §4, part 3): `section#<anchor>`, named by its H2 so the
 * anchor utility focuses the heading on arrival (D53). Its signature module loads into a slot
 * around a static fallback (Task 2.4). The related-work row (real work only, OQ #17) joins later.
 */
export async function ServiceSection({ service, tone, lab = false }: { service: Service; tone: "dark" | "light"; lab?: boolean }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("category");
  const title = service.title[locale];
  const titleId = `${service.anchor}-title`;
  return (
    <section id={service.anchor} aria-labelledby={titleId} className="svc">
      <header className="svc-head">
        <Numeral className="svc-num">{toRoman(service.order)}</Numeral>
        <h2 id={titleId} className="svc-title">
          {title}
        </h2>
        <p className="svc-intro text-lead">{service.summary[locale]}</p>
      </header>
      <div className="svc-deliver">
        <h3 className="text-eyebrow">{t("deliverTitle")}</h3>
        {/* TODO: replace placeholder — "what we deliver" points are written per category (Task 3.1 and later). */}
        <ul>
          {service.points[locale].map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      {lab ? (
        // The animatic (lab route, never public): a flat box named by its module key.
        <div className="svc-module module-placeholder" data-module={service.signatureModule}>
          <p className="text-eyebrow">{service.signatureModule}</p>
        </div>
      ) : (
        <ModuleSlot moduleKey={service.signatureModule} titleId={titleId} service={service} locale={locale}>
          <ModulePlaceholder />
        </ModuleSlot>
      )}
      <ButtonLink
        href={quoteHref(service)}
        variant={tone === "dark" ? "primary" : "dark"}
        arrow
        aria-label={t("quoteCtaFor", { service: title })}
        className="svc-quote"
      >
        {t("quoteCta")}
      </ButtonLink>
    </section>
  );
}
