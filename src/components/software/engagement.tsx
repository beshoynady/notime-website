import { Check } from "lucide-react";
import { ButtonArrow } from "@/components/ui/button";
import type { Locale } from "@/content";
import { fill } from "@/content/form-copy";
import { TIER_IDS, tiers as t, ways, why } from "@/content/software/page";
import { PrefillLink } from "./prefill-link";

/**
 * Engagement levels (brief §8): three tiers as scope, never packages for sale and never prices
 * (D91). Each: who it's for, what's included, what you receive, and a CTA that presets the
 * consultation form's tier. The note under them says every project is scoped and quoted.
 */
export function Tiers({ locale }: { locale: Locale }) {
  return (
    <section id={t.anchor} data-tone="light" aria-labelledby="tiers-title" className="sw-section sw-tiers">
      <div className="frame">
        <header className="sw-head">
          <h2 id="tiers-title" className="sw-h2">
            {t.title[locale]}
          </h2>
          <p className="sw-lead">{t.intro[locale]}</p>
        </header>
        <ol className="sw-tier-list" data-sw-reveal="">
          {TIER_IDS.map((id, i) => {
            const tier = t.items[id];
            return (
              <li key={id} className="sw-tier" data-tier={id}>
                <span className="sw-tier-level" aria-hidden="true">
                  {Array.from({ length: 3 }, (_, k) => (
                    <i key={k} className={k <= i ? "is-on" : undefined} />
                  ))}
                </span>
                <h3 className="sw-tier-name">{tier.name[locale]}</h3>
                <p className="sw-tier-summary">{tier.summary[locale]}</p>
                <p className="sw-tier-ideal">
                  <span className="sw-mini-label">{t.idealFor[locale]}</span>
                  {tier.ideal[locale]}
                </p>
                <details className="sw-more">
                  <summary>{t.included[locale]}</summary>
                  <ul className="sw-tier-included">
                    {tier.included.map((x, k) => (
                      <li key={k}>
                        <Check aria-hidden="true" strokeWidth={1.75} className="size-4 shrink-0" />
                        {x[locale]}
                      </li>
                    ))}
                  </ul>
                </details>
                <p className="sw-tier-receive">
                  <span className="sw-mini-label">{t.receive[locale]}</span>
                  {tier.receive[locale]}
                </p>
                <PrefillLink prefill={{ tier: id }} className="sw-btn sw-btn-dark sw-btn-sm sw-tier-cta">
                  <span>{fill(t.cta[locale], { tier: tier.name[locale] })}</span>
                  <ButtonArrow />
                </PrefillLink>
              </li>
            );
          })}
        </ol>
        <p className="sw-tier-note">{t.note[locale]}</p>
      </div>
    </section>
  );
}

/** Two ways to work with us (brief §9): monthly support reads as the step after launch. */
export function Ways({ locale }: { locale: Locale }) {
  return (
    <section id={ways.anchor} data-tone="light" aria-labelledby="ways-title" className="sw-section sw-ways">
      <div className="frame">
        <header className="sw-head">
          <h2 id="ways-title" className="sw-h2">
            {ways.title[locale]}
          </h2>
          <p className="sw-lead">{ways.lead[locale]}</p>
        </header>
        <ol className="sw-ways-list" tabIndex={0} aria-labelledby="ways-title">
          {ways.items.map((w, i) => (
            <li key={w.id} className="sw-way" data-way={w.id}>
              <span className="sw-way-step tabular" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="sw-way-name">{w.name[locale]}</h3>
              {"tag" in w && w.tag && <p className="sw-way-tag">{w.tag[locale]}</p>}
              <p className="sw-way-body">{w.body[locale]}</p>
              <details className="sw-more">
                <summary>{t.included[locale]}</summary>
                <ul className="sw-way-points">
                  {w.points.map((x, k) => (
                    <li key={k}>{x[locale]}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Why NO TIME (brief §10): five true differentiators. */
export function Why({ locale }: { locale: Locale }) {
  return (
    <section id={why.anchor} data-tone="light" aria-labelledby="why-title" className="sw-section sw-why">
      <div className="frame sw-why-layout">
        <header className="sw-head">
          <h2 id="why-title" className="sw-h2">
            {why.title[locale]}
          </h2>
          <p className="sw-lead">{why.lead[locale]}</p>
        </header>
        <ul className="sw-why-list" data-sw-reveal="" tabIndex={0} aria-labelledby="why-title">
          {why.items.map((it, i) => (
            <li key={i}>
              <h3 className="sw-why-title">{it.title[locale]}</h3>
              <p>{it.body[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
