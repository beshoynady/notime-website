import { getLocale, getTranslations } from "next-intl/server";
import { ModulePlaceholder } from "@/components/modules/module-placeholder";
import { ModuleSlot } from "@/components/modules/module-slot";
import { STATIC_FALLBACKS } from "@/components/modules/static-fallbacks";
import { MajlisArt } from "./majlis-art";
import { ButtonLink } from "@/components/ui/button";
import { Numeral } from "@/components/ui/numeral";
import { LayeredScene } from "@/components/scenes/layered-scene";
import { quoteHref, type Locale, type Localized, type Service } from "@/content";
import { getSectionScene } from "@/content/scenes";
import { orderNumeral } from "@/lib/roman";
import { SectionRef } from "@/components/review/section-ref";
import { serviceRef } from "@/lib/review";

/**
 * One service on its category page (spec §4, part 3): `section#<anchor>`, named by its H2 so the
 * anchor utility focuses the heading on arrival (D53). Its signature module loads into a slot
 * around its static fallback (STATIC_FALLBACKS: the module's final state, server-rendered in the
 * same box), or the empty one when it has none (Task 2.4). Related work is one block per page
 * (RelatedWork, before the FAQ).
 *
 * A section with its own scene (the Events majlis, D64) sets its numeral, H2 and promise over the
 * scene's lower third; the lab route shows it as the animatic.
 */
export async function ServiceSection({
  service,
  tone,
  lab = false,
  hook,
  light = false,
}: {
  service: Service;
  tone: "dark" | "light";
  lab?: boolean;
  /** The section's one-line hook, under the H2 (service-hooks.ts); none keeps the plain head. */
  hook?: Localized<string>;
  /** The Evening's own light per section (themes/evening.css, EveningDirector). */
  light?: boolean;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("category");
  const title = service.title[locale];
  const titleId = `${service.anchor}-title`;
  const scene = getSectionScene(service, lab);
  const Static = lab ? undefined : STATIC_FALLBACKS[service.signatureModule];
  const head = (
    <header className="svc-head">
      <Numeral className="svc-num">{orderNumeral(service.order, locale)}</Numeral>
      <h2 id={titleId} className="svc-title">
        {title}
      </h2>
      {hook && <p className="svc-hook">{hook[locale]}</p>}
      <p className="svc-intro text-lead">{service.summary[locale]}</p>
    </header>
  );
  return (
    <section
      id={service.anchor}
      aria-labelledby={titleId}
      className="svc"
      data-scene-section={scene ? "" : undefined}
    >
      <SectionRef id={serviceRef(service)} />
      {light && !scene && <span className="svc-light" aria-hidden="true" />}
      {scene ? (
        <div className="svc-scene">
          <LayeredScene
            scene={scene}
            lines={[]}
            variant={lab ? "animatic" : "live"}
            overlayClassName="svc-scene-overlay"
            pinUnderBars
          >
            {/* The majlis's drawn foreground (the dallah's pour) rides the scene's own range. */}
            {scene.id === "events-majlis" && !lab && <MajlisArt scene={scene} />}
            {head}
          </LayeredScene>
        </div>
      ) : (
        head
      )}
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
        <div
          className="svc-module module-placeholder"
          data-module={service.signatureModule}
        >
          <p className="text-eyebrow">{service.signatureModule}</p>
        </div>
      ) : (
        <ModuleSlot
          moduleKey={service.signatureModule}
          titleId={titleId}
          service={service}
          locale={locale}
        >
          {Static ? <Static service={service} locale={locale} /> : <ModulePlaceholder />}
        </ModuleSlot>
      )}
      {/* It targets the quote block, hidden on public pages until the form works (D74, P6). */}
      {lab && (
        <ButtonLink
          href={quoteHref(service)}
          variant={tone === "dark" ? "primary" : "dark"}
          arrow
          aria-label={t("quoteCtaFor", { service: title })}
          className="svc-quote"
        >
          {t("quoteCta")}
        </ButtonLink>
      )}
    </section>
  );
}
