import type { Locale } from "@/content";
import { PHASES, process as p } from "@/content/software/page";

/**
 * How we work (brief §7): Discover → Design → Build → Launch → Support, each with what happens and
 * what the client receives. Horizontal on desktop, vertical on mobile; the rail fills from
 * inline-start as it scrolls (GSAP scrub, no pin; mirrored in Arabic), and each step lights as
 * the fill reaches it. The still is the full rail, every step lit.
 */
export function ProcessTimeline({ locale }: { locale: Locale }) {
  return (
    <section id={p.anchor} data-tone="light" aria-labelledby="process-title" className="sw-section sw-process">
      <div className="frame">
        <header className="sw-head">
          <h2 id="process-title" className="sw-h2">
            {p.title[locale]}
          </h2>
          <p className="sw-lead">{p.lead[locale]}</p>
        </header>
        <div className="sw-steps-wrap" data-sw-steps="">
          <span className="sw-steps-rail" aria-hidden="true">
            <i className="sw-steps-fill" />
          </span>
          <ol className="sw-steps">
            {PHASES.map((id, i) => {
              const s = p.steps[id];
              return (
                <li key={id} className="sw-step" data-step={i}>
                  <span className="sw-step-dot" aria-hidden="true" />
                  <span className="sw-step-num tabular" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="sw-step-name">{s.name[locale]}</h3>
                  <p className="sw-step-body">{s.body[locale]}</p>
                  <p className="sw-step-receive">
                    <span className="sw-mini-label">{p.receive[locale]}</span>
                    {s.receive[locale]}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
        <ul className="sw-notes">
          {p.notes.map((n, i) => (
            <li key={i}>{n[locale]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
