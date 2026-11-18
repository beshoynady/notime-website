import { ButtonLink } from "@/components/ui/button";
import "./closing-cta.css";

/**
 * The closing block of an index page (/work, /services; N16): one question, one line, one action.
 * Copy comes in as props so each page owns its words. The tone sits opposite the section above it.
 */
export function ClosingCta({ id, title, body, href, label, tone = "dark" }: { id: string; title: string; body: string; href: string; label: string; tone?: "dark" | "light" }) {
  return (
    <section data-tone={tone} aria-labelledby={id} className="closing-cta section-pad">
      <div className="frame closing-cta-frame">
        <h2 id={id} className="closing-cta-title text-h1">
          {title}
        </h2>
        <p className="closing-cta-body text-lead">{body}</p>
        <div className="closing-cta-actions">
          <ButtonLink href={href} variant="primary" arrow>
            {label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
