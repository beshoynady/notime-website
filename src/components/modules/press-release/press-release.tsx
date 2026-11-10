"use client";

import { motion } from "motion/react";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { PRESS_RELEASE, type PartId } from "@/content/modules/press-release";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { withSplitText } from "@/lib/split-text";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";

const DATE_LOCALE = { en: "en-GB", ar: "ar-AE-u-nu-latn" } as const;

/**
 * V · Public relations (category-pages.md §6 III, entry 17): the anatomy of a press release, set
 * as an editorial page. A sample release about a fictional, unnamed brand, labelled "Example".
 *
 * - Each annotated part has a numbered pin (a 44px button). Pointing at a part, focusing its pin
 *   or tapping it makes it the active part: a champagne band lights behind it and its note is
 *   emphasised (desktop: the margin notes, all listed; below 900px: the active note under the
 *   page). Each change is announced in the module's one live region.
 * - Motion owns the interaction (the band, the notes); GSAP owns the type-led entry on scroll
 *   (each part's inner `.pr-set` box, and the headline's lines from a mask at ≥ 900px only, with
 *   SplitText). No element is animated by both.
 * - Reduced motion: no entry, every note visible at full strength, the band snaps.
 */
export default function PressRelease({ locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState<PartId>("headline");
  const [status, setStatus] = useState("");
  const r = PRESS_RELEASE.release;
  const parts = PRESS_RELEASE.parts;
  const date = useMemo(() => new Intl.DateTimeFormat(DATE_LOCALE[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date()), [locale]);

  const pick = (id: PartId) => {
    if (id === active) return;
    setActive(id);
    const i = parts.findIndex((p) => p.id === id);
    setStatus(`${i + 1}. ${parts[i].name[locale]}: ${parts[i].note[locale]}`);
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (c) => {
        if (!c.conditions?.motion) return;
        const sets = el.querySelectorAll<HTMLElement>(".pr-set");
        gsap.fromTo(
          sets,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 78%", once: true } },
        );
        // The headline sets from a line mask, desktop only (D43, D44: SplitText at ≥ 900px).
        if (c.conditions.wide && headline.current) {
          let played = false;
          // Recorded in this matchMedia context, so its revert also reverts the split.
          return withSplitText(c, (Split) => {
            Split.create(headline.current!, {
              type: "lines",
              mask: "lines",
              aria: "auto",
              autoSplit: true,
              onSplit: (split) => {
                if (played) return;
                return gsap.from(split.lines, {
                  yPercent: 105,
                  duration: 1.2,
                  ease: "expo.out",
                  stagger: 0.08,
                  scrollTrigger: { trigger: el, start: "top 78%", once: true, onEnter: () => (played = true) },
                });
              },
            });
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [locale], revertOnUpdate: true },
  );

  const t = reduced ? { duration: 0 } : { duration: 0.45, ease: ease.expoOut };
  const part = (id: PartId, children: ReactNode, className?: string) => {
    const n = parts.findIndex((p) => p.id === id) + 1;
    const on = active === id;
    return (
      <div className={`pr-part ${className ?? ""}`} data-part={id} data-active={on ? "" : undefined} onPointerEnter={(e) => e.pointerType === "mouse" && pick(id)}>
        <motion.span className="pr-hl" aria-hidden="true" initial={false} animate={{ opacity: on ? 1 : 0, scaleX: on ? 1 : 0.96 }} transition={t} />
        <button type="button" className="pr-pin" aria-pressed={on} onClick={() => pick(id)} onFocus={() => pick(id)}>
          <span aria-hidden="true">{n}</span>
          <span className="sr-only">{`${n}. ${parts[n - 1].name[locale]}`}</span>
        </button>
        <div className="pr-set">{children}</div>
      </div>
    );
  };

  return (
    <div ref={root} className="pr">
      <div className="pr-top">
        {PRESS_RELEASE.example && <ExampleLabel kind="example" className="pr-label" />}
        <h3 className="pr-title">{PRESS_RELEASE.title[locale]}</h3>
        <p className="pr-hint">{PRESS_RELEASE.hint[locale]}</p>
      </div>

      <div className="pr-layout">
        <article className="pr-sheet">
          {part(
            "headline",
            <>
              <p className="pr-kicker">{r.kicker[locale]}</p>
              <p ref={headline} className="pr-headline">
                {r.headline[locale]}
              </p>
              <p className="pr-standfirst">{r.standfirst[locale]}</p>
            </>,
          )}
          {part("dateline", <p className="pr-dateline">{r.dateline[locale].replace("{date}", date)}</p>)}
          {part(
            "lead",
            <>
              <p className="pr-lead">{r.lead[locale]}</p>
              <p className="pr-body">{r.body[locale]}</p>
            </>,
          )}
          {part("quote", <p className="pr-quote">{r.quote[locale]}</p>)}
          <p className="pr-end" aria-hidden={locale === "en" ? true : undefined}>
            {r.end[locale]}
          </p>
          {part(
            "boilerplate",
            <>
              <p className="pr-small-title">{r.aboutTitle[locale]}</p>
              <p className="pr-about">{r.about[locale]}</p>
            </>,
          )}
          {part(
            "contact",
            <>
              <p className="pr-small-title">{r.contactTitle[locale]}</p>
              <p className="pr-contact">
                {r.contactName[locale]}
                <br />
                <bdi dir="ltr">{r.contactEmail}</bdi>
              </p>
            </>,
          )}
        </article>

        <ol className="pr-notes" aria-label={PRESS_RELEASE.notesLabel[locale]}>
          {parts.map((p, i) => {
            const on = active === p.id;
            return (
              <motion.li key={p.id} className="pr-note" data-active={on ? "" : undefined} initial={false} animate={{ opacity: on || reduced ? 1 : 0.5 }} transition={t}>
                <span className="pr-note-n" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="pr-note-name">{p.name[locale]}</p>
                  <p className="pr-note-text">{p.note[locale]}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
