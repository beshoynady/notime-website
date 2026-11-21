import type { Locale } from "@/content";
import { problems } from "@/content/software/page";

/**
 * The problem (PAS, brief §3): five pains Gulf businesses name, each answered in one line. Drawn
 * as a diff, the vernacular of the people who fix it: the pain is the removed line (−), the fix
 * the added one (+). The markers are decorative; each row's labels say which is which.
 */
export function Problems({ locale }: { locale: Locale }) {
  return (
    <section id="problems" data-tone="light" aria-labelledby="problems-title" className="sw-section sw-problems">
      <div className="frame">
        <header className="sw-head">
          <h2 id="problems-title" className="sw-h2">
            {problems.title[locale]}
          </h2>
          <p className="sw-lead">{problems.lead[locale]}</p>
        </header>
        <ol className="sw-diff" data-sw-reveal="">
          {problems.items.map((it, i) => (
            <li key={i} className="sw-diff-item">
              <p className="sw-diff-line sw-diff-minus">
                <span className="sw-diff-mark" aria-hidden="true">
                  −
                </span>
                <span className="sr-only">{problems.painLabel[locale]}: </span>
                {it.pain[locale]}
              </p>
              <p className="sw-diff-line sw-diff-plus">
                <span className="sw-diff-mark" aria-hidden="true">
                  +
                </span>
                <span className="sr-only">{problems.fixLabel[locale]}: </span>
                {it.fix[locale]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
