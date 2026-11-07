"use client";

import { useTranslations } from "next-intl";
import { useRef, type ReactNode } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { Parallax } from "@/components/motion/parallax";
import { RevealWords, type ReplayHandle } from "@/components/motion/reveal-words";
import { ButtonArrow, buttonVariants } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The four motion demos from the reference, built on the site's own motion wrappers.
 * Media comes in from the server page so image data stays out of the client bundle.
 * Under reduced motion every demo shows its final state and the replay buttons are disabled.
 */
export function MotionDemos({ maskMedia, parallaxMedia }: { maskMedia: ReactNode; parallaxMedia: ReactNode }) {
  const t = useTranslations("styleguide.motion");
  const reduced = useReducedMotion();
  const words = useRef<ReplayHandle>(null);
  const mask = useRef<ReplayHandle>(null);

  return (
    <ul className="sg-demos" role="list">
      <Demo
        title={t("demos.words")}
        tech="GSAP · base"
        action={<Replay label={t("replay")} aria={t("replayLabel", { demo: t("demos.words") })} disabled={reduced} onClick={() => words.current?.replay()} />}
      >
        <RevealWords ref={words} className="sg-wr-text">
          {t("words.line1")}
          <br />
          {t("words.line2")}
          <br />
          <b>{t("words.line3")}</b>
        </RevealWords>
      </Demo>

      <Demo
        title={t("demos.mask")}
        tech="GSAP · clip-path"
        action={<Replay label={t("replay")} aria={t("replayLabel", { demo: t("demos.mask") })} disabled={reduced} onClick={() => mask.current?.replay()} />}
      >
        <MaskReveal ref={mask} className="absolute inset-6 overflow-hidden rounded-tag">
          <div className="absolute inset-0">{maskMedia}</div>
        </MaskReveal>
      </Demo>

      <Demo title={t("demos.parallax")} tech="ScrollTrigger · scrub" action={<span className="sg-hint">{t("scroll")}</span>}>
        <Parallax amount={18} className="!absolute inset-6 rounded-tag">
          <div className="absolute inset-0">{parallaxMedia}</div>
        </Parallax>
      </Demo>

      <Demo title={t("demos.magnetic")} tech="Motion · pointer" action={<span className="sg-hint">{t("hover")}</span>}>
        <Magnetic>
          {/* A same-page anchor: the demo is about the pull, not the destination. */}
          <a href="#components" className={buttonVariants({ variant: "primary" })}>
            <span>{t("demos.magneticButton")}</span>
            <ButtonArrow />
          </a>
        </Magnetic>
      </Demo>
    </ul>
  );
}

function Demo({ title, tech, action, children }: { title: string; tech: string; action: ReactNode; children: ReactNode }) {
  return (
    <li className="sg-demo">
      <div className="sg-demo-area">{children}</div>
      <div className="sg-demo-cap">
        <div>
          <b>{title}</b>
          <small dir="ltr">{tech}</small>
        </div>
        {action}
      </div>
    </li>
  );
}

function Replay({ label, aria, disabled, onClick }: { label: string; aria: string; disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className="sg-replay" aria-label={aria} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
