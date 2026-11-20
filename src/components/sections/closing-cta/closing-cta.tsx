import { ButtonLink } from "@/components/ui/button";
import "./closing-cta.css";

/**
 * The closing block of an index page (/work, /services; N16): one question, one line, one action.
 * Copy comes in as props so each page owns its words. The tone sits opposite the section above it.
 */
/**
 * `ownGround`: the block paints its own fill and never turns the page's ground (ToneController).
 * For a CTA right after a long list: turning the ground there faded the list's last row while it
 * was still in the top third of the screen (self-audit B12, /services).
 */
export function ClosingCta({ id, title, body, href, label, tone = "dark", ownGround = false }: { id: string; title: string; body: string; href: string; label: string; tone?: "dark" | "light"; ownGround?: boolean }) {
  return (
    <section data-tone={tone} data-bg={ownGround ? "own" : undefined} aria-labelledby={id} className="closing-cta section-pad">
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
