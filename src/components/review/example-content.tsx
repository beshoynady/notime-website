import type { Locale } from "@/content";
import { exampleHeadings, exampleLogos, examplePress, exampleQuote, exampleStats, exampleTeam, type ExampleKind } from "@/content/review/examples";
import { reviewUi } from "@/content/review/ui";
import type { SectionRefId } from "@/lib/review";
import { SectionRef } from "./section-ref";

/** Loaded only in review mode (example-block.tsx). */
const SHAPES: Record<(typeof exampleLogos)[number], React.ReactNode> = {
  circle: <circle cx="24" cy="24" r="14" />,
  square: <rect x="11" y="11" width="26" height="26" />,
  triangle: <path d="M24 9 39 37H9Z" />,
  hexagon: <path d="m24 8 14 8v16l-14 8-14-8V16Z" />,
  diamond: <path d="m24 7 17 17-17 17L7 24Z" />,
  ring: <circle cx="24" cy="24" r="13" fill="none" strokeWidth="5" />,
};

export function ExampleBadge({ locale }: { locale: Locale }) {
  return <span className="example-badge">{reviewUi.badge[locale]}</span>;
}

export function ExampleContent({ kind, refId, tone, locale }: { kind: ExampleKind; refId: SectionRefId; tone: "light" | "dark"; locale: Locale }) {
  return (
    <section data-tone={tone} data-example={kind} className="example-block section-pad" aria-label={exampleHeadings[kind][locale]}>
      <SectionRef id={refId} />
      <div className="frame">
        <div className="example-head">
          <p className="text-eyebrow">{exampleHeadings[kind][locale]}</p>
          <ExampleBadge locale={locale} />
        </div>
        {kind === "logos" && (
          <ul className="example-logos">
            {exampleLogos.map((s) => (
              <li key={s}>
                <svg viewBox="0 0 48 48" aria-hidden="true" stroke="currentColor" fill="currentColor">
                  {SHAPES[s]}
                </svg>
              </li>
            ))}
          </ul>
        )}
        {kind === "testimonials" && (
          <ul className="example-cards">
            {[0, 1].map((i) => (
              <li key={i}>
                <blockquote>
                  <p className="text-lead">{exampleQuote[locale]}</p>
                  <footer>
                    <strong>{reviewUi.person[locale]}</strong>
                    <span>{reviewUi.role[locale]}</span>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        )}
        {kind === "stats" && (
          <ul className="example-stats">
            {exampleStats.map((s, i) => (
              <li key={i}>
                <span className="example-figure" aria-hidden="true">
                  —
                </span>
                <span>{s.label[locale]}</span>
              </li>
            ))}
          </ul>
        )}
        {kind === "team" && (
          <ul className="example-cards">
            {exampleTeam.map((p, i) => (
              <li key={i} className="example-person">
                <span className="example-portrait" aria-hidden="true" />
                <strong>{p.name[locale]}</strong>
                <span>{p.role[locale]}</span>
              </li>
            ))}
          </ul>
        )}
        {kind === "press" && (
          <ul className="example-press">
            {examplePress.map((p, i) => (
              <li key={i}>
                <span className="text-eyebrow">{p.outlet[locale]}</span>
                <span className="text-lead">{p.headline[locale]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
