import { ArrowUpRight } from "lucide-react";
import { HoverSweep } from "@/components/motion/hover-sweep";
import { SectionRef } from "@/components/review/section-ref";
import { ButtonArrow } from "@/components/ui/button";
import { Numeral } from "@/components/ui/numeral";
import type { Locale, Service } from "@/content";
import { cta, eventTech, hero, process, serviceBlocks, services as copy, type Phase, PHASES } from "@/content/software/page";
import { Link } from "@/i18n/navigation";
import type { Build } from "@/lib/prefill";
import { orderNumeral } from "@/lib/roman";
import { serviceRef } from "@/lib/review";
import { fill } from "@/content/form-copy";
import { StateLabel } from "./device-frames";
import { PrefillLink } from "./prefill-link";
import { EventVisual, SERVICE_VISUALS } from "./service-visuals";

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

/**
 * What we build (brief §4, §C): the six services as mini landing blocks. Each: a code-drawn
 * visual, the outcome first (H3, the anchor the homepage and menus link to), the approved promise,
 * Ideal for, You receive (the 3 deliverables, D65), the phases, and "Discuss this" (prefills the
 * form). Desktop: alternating start/end (mirrored in RTL). Hover or focus (desktop) plays the
 * visual's state change, a light sweep and reveals the deliverables; on touch and under reduced
 * motion the deliverables are always shown and nothing moves (the user's spec, 2026-11-11).
 * Event technology follows as the featured block: wider and darker (D65: a band, not a service).
 */
export function ServiceBlocks({ items, locale }: { items: Service[]; locale: Locale }) {
  const states = hero.ui.states;
  return (
    <section id="services" data-tone="light" aria-labelledby="services-title" className="sw-section sw-services">
      <div className="frame">
        <header className="sw-head">
          <h2 id="services-title" className="sw-h2">
            {copy.title[locale]}
          </h2>
          <p className="sw-lead">{copy.lead[locale]}</p>
        </header>
        <div className="sw-blocks">
          {items.map((s, i) => {
            const b = serviceBlocks[s.slug];
            const Visual = SERVICE_VISUALS[s.slug];
            return (
              <article key={s.slug} id={s.anchor} aria-labelledby={`${s.anchor}-title`} className="sw-block" data-side={i % 2 ? "end" : "start"}>
                <SectionRef id={serviceRef(s)} />
                <HoverSweep className="sw-block-visual">
                  <StateLabel rest={states[0][locale]} active={states[2][locale]} />
                  {Visual && <Visual />}
                </HoverSweep>
                <div className="sw-block-body">
                  <p className="sw-block-kicker">
                    <Numeral>{orderNumeral(s.order, locale)}</Numeral>
                    <span aria-hidden="true"> · </span>
                    {s.title[locale]}
                  </p>
                  <h3 id={`${s.anchor}-title`} className="sw-block-title">
                    {b.outcome[locale]}
                  </h3>
                  <p className="sw-block-desc">{s.summary[locale]}</p>
                  <div className="sw-block-cols">
                    <div>
                      <span className="sw-mini-label">{copy.idealFor[locale]}</span>
                      <ul className="sw-ideal">
                        {b.idealFor.map((x, k) => (
                          <li key={k}>{x[locale]}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="sw-receive">
                      <span className="sw-mini-label">{copy.receive[locale]}</span>
                      <ul className="sw-receive-list">
                        {s.points[locale].map((p, k) => (
                          <li key={k}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Phases on={b.phases} locale={locale} />
                  <PrefillLink prefill={{ build: buildOf(s) }} className="sw-btn sw-btn-dark sw-btn-sm" label={fill(cta.discussFor[locale], { service: s.title[locale] })}>
                    <span>{cta.discuss[locale]}</span>
                    <ButtonArrow />
                  </PrefillLink>
                </div>
              </article>
            );
          })}
        </div>
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
            <ul className="sw-event-items">
              {e.items.map((it, k) => (
                <li key={k}>
                  <b>{it.title[locale]}.</b> {it.body[locale]}
                </li>
              ))}
            </ul>
          </div>
          <div className="sw-event-side">
            <EventVisual label={e.counter.label[locale]} of={e.counter.of[locale]} example={e.counter.example} total={e.counter.total} exampleLabel={hero.ui.example[locale]} />
            <div className="sw-block-cols">
              <div>
                <span className="sw-mini-label">{copy.idealFor[locale]}</span>
                <ul className="sw-ideal">
                  {e.idealFor.map((x, k) => (
                    <li key={k}>{x[locale]}</li>
                  ))}
                </ul>
              </div>
              <div className="sw-receive sw-receive-open">
                <span className="sw-mini-label">{copy.receive[locale]}</span>
                <ul className="sw-receive-list">
                  {e.receive.map((x, k) => (
                    <li key={k}>{x[locale]}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Phases on={e.phases} locale={locale} />
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
