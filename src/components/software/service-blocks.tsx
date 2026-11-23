import { ArrowUpRight } from "lucide-react";
import { SectionRef } from "@/components/review/section-ref";
import { ButtonArrow } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import type { Locale, Service } from "@/content";
import { media } from "@/content/media";
import { cta, eventTech, process, serviceBlocks, services as copy, type Phase, PHASES } from "@/content/software/page";
import { Link } from "@/i18n/navigation";
import type { Build } from "@/lib/prefill";
import { orderNumeral } from "@/lib/roman";
import { serviceRef } from "@/lib/review";
import { fill } from "@/content/form-copy";
import { PrefillLink } from "./prefill-link";
import { ServiceTabs } from "./service-tabs";

/** The build option each service presets on the consultation form (the anchors are the options). */
const buildOf = (s: Service) => s.anchor as Build;

function Phases({ on, locale }: { on: Phase[]; locale: Locale }) {
  return (
    <div className="sw-phases">
      <span className="sw-mini-label">{copy.phases[locale]}</span>
      <ul className="sw-phase-list">
        {PHASES.map((p) => (
          <li key={p} className={on.includes(p) ? "is-on" : undefined} aria-hidden={on.includes(p) ? undefined : true}>
            {process.steps[p].name[locale]}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A device photograph from the registry (media.ts), or nothing if the entry is hidden. */
function Photo({ id, locale, className }: { id: string; locale: Locale; className: string }) {
  const entry = media(id);
  if (!entry) return null;
  return (
    <figure className={className}>
      <MediaImage entry={entry} locale={locale} sizes="(min-width: 900px) 640px, 100vw" />
    </figure>
  );
}

/**
 * What we build (brief §4, §C; Task C2, D161): the six services as one tab set, so a phone carries
 * one service's height instead of six. Each panel: a device photograph, the outcome first (H3; the
 * panel is the anchor the homepage and menus link to), the approved promise, You receive (the 3
 * deliverables, D65), Ideal for and the phases folded in a <details>, and "Discuss this" (prefills
 * the form). Every panel is in the HTML; the tab rail only shows one. Event technology follows as
 * the featured band: wider and darker (D65: a band, not a service).
 */
export function ServiceBlocks({ items, locale }: { items: Service[]; locale: Locale }) {
  const tabs = items.map((s) => {
    const b = serviceBlocks[s.slug];
    return {
      id: s.anchor,
      num: orderNumeral(s.order, locale),
      label: s.title[locale],
      labelledBy: `${s.anchor}-title`,
      panel: (
        <>
          <SectionRef id={serviceRef(s)} />
          <Photo id={b.photo} locale={locale} className="sw-block-photo" />
          <div className="sw-block-body">
            <h3 id={`${s.anchor}-title`} className="sw-block-title">
              {b.outcome[locale]}
            </h3>
            <p className="sw-block-desc">{s.summary[locale]}</p>
            <div className="sw-receive">
              <span className="sw-mini-label">{copy.receive[locale]}</span>
              <ul className="sw-receive-list">
                {s.points[locale].map((p, k) => (
                  <li key={k}>{p}</li>
                ))}
              </ul>
            </div>
            <details className="sw-more">
              <summary>{copy.more[locale]}</summary>
              <div className="sw-more-body">
                <div>
                  <span className="sw-mini-label">{copy.idealFor[locale]}</span>
                  <ul className="sw-ideal">
                    {b.idealFor.map((x, k) => (
                      <li key={k}>{x[locale]}</li>
                    ))}
                  </ul>
                </div>
                <Phases on={b.phases} locale={locale} />
              </div>
            </details>
            <PrefillLink prefill={{ build: buildOf(s) }} className="sw-btn sw-btn-dark sw-btn-sm" label={fill(cta.discussFor[locale], { service: s.title[locale] })}>
              <span>{cta.discuss[locale]}</span>
              <ButtonArrow />
            </PrefillLink>
          </div>
        </>
      ),
    };
  });
  return (
    <section id="services" data-tone="light" aria-labelledby="services-title" className="sw-section sw-services">
      <div className="frame">
        <header className="sw-head">
          <h2 id="services-title" className="sw-h2">
            {copy.title[locale]}
          </h2>
          <p className="sw-lead">{copy.lead[locale]}</p>
        </header>
        <ServiceTabs items={tabs} label={copy.tabs[locale]} />
      </div>
      <EventTechBlock locale={locale} />
    </section>
  );
}

/** Event technology (brief §5): where NO TIME's two worlds meet. A dark, wider band in the sequence. */
function EventTechBlock({ locale }: { locale: Locale }) {
  const e = eventTech;
  return (
    <div className="sw-event-wrap">
      <article id={e.anchor} aria-labelledby={`${e.anchor}-title`} data-tone="dark" className="sw-event frame-wide">
        <div className="sw-event-grid" aria-hidden="true" data-sw-gridlines="" />
        <div className="sw-event-inner">
          <div className="sw-event-copy">
            <p className="sw-block-kicker sw-event-eyebrow">{e.eyebrow[locale]}</p>
            <h3 id={`${e.anchor}-title`} className="sw-event-title">
              {e.title[locale]}
            </h3>
            <p className="sw-event-intro">{e.intro[locale]}</p>
            <ul className="sw-event-items" tabIndex={0} aria-labelledby={`${e.anchor}-title`}>
              {e.items.map((it, k) => (
                <li key={k}>
                  <b>{it.title[locale]}.</b> {it.body[locale]}
                </li>
              ))}
            </ul>
          </div>
          <div className="sw-event-side">
            <Photo id={e.photo} locale={locale} className="sw-event-photo" />
            <details className="sw-more">
              <summary>{copy.more[locale]}</summary>
              <div className="sw-more-body">
                <div className="sw-receive sw-receive-open">
                  <span className="sw-mini-label">{copy.receive[locale]}</span>
                  <ul className="sw-receive-list">
                    {e.receive.map((x, k) => (
                      <li key={k}>{x[locale]}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="sw-mini-label">{copy.idealFor[locale]}</span>
                  <ul className="sw-ideal">
                    {e.idealFor.map((x, k) => (
                      <li key={k}>{x[locale]}</li>
                    ))}
                  </ul>
                </div>
                <Phases on={e.phases} locale={locale} />
              </div>
            </details>
            <div className="sw-event-ctas">
              <PrefillLink prefill={{ build: "event-tech" }} className="sw-btn sw-btn-light sw-btn-sm" label={fill(cta.discussFor[locale], { service: e.name[locale] })}>
                <span>{cta.discuss[locale]}</span>
                <ButtonArrow />
              </PrefillLink>
              <Link href="/services/events-hospitality" className="sw-link sw-link-light">
                {e.eventsLink[locale]}
                <ArrowUpRight aria-hidden="true" strokeWidth={1.25} className="size-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
