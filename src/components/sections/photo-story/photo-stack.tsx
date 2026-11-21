import { MessageCircle } from "lucide-react";
import type { CSSProperties } from "react";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { contact } from "@/config/contact";
import { contactHref, type Locale } from "@/content";
import { PRIVATE_STACK, storyPhoto } from "@/content/photo-stories";
import { whatsappHref } from "@/lib/whatsapp";
import { StoryImage } from "./story-image";
import { PhotoStackMotion } from "./photo-stack-motion";
import "./photo-stack.css";

/**
 * The private client's entry inside Galas & private celebrations (§6.3, D109): photo cards that
 * stack as you scroll (technique 3: each card is sticky a little lower than the last, and GSAP
 * settles the one underneath back), a warm line, and two ways in: the brief preset to this service,
 * and WhatsApp once the number is set (src/config/contact.ts). Shareable as `#celebrations`.
 * Reduced motion: the cards simply follow each other.
 */
export function PhotoStack({ anchor, locale, tone }: { anchor: string; locale: Locale; tone: "dark" | "light" }) {
  const s = PRIVATE_STACK;
  const wa = whatsappHref(contact.whatsapp, s.prefill[locale]);
  return (
    <div className="pstack" aria-label={s.label[locale]} role="group">
      <p className="pstack-lead text-lead">{s.lead[locale]}</p>
      <ol className="pstack-cards">
        {s.cards.map((c, i) => {
          const p = storyPhoto(c.photo);
          return (
            <li key={c.photo} className="pstack-card" style={{ "--i": i } as CSSProperties}>
              <figure className="pstack-fig">
                <div className="pstack-img">
                  <StoryImage photo={p} locale={locale} sizes="(min-width: 900px) 640px, calc(100vw - 32px)" />
                </div>
                <figcaption>{c.caption[locale]}</figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
      <div className="pstack-actions">
        <ButtonLink href={contactHref(anchor)} variant={tone === "dark" ? "primary" : "dark"} arrow>
          {s.cta[locale]}
        </ButtonLink>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "ghost" })}>
            <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
            {s.whatsapp[locale]}
          </a>
        )}
      </div>
      <PhotoStackMotion />
    </div>
  );
}
