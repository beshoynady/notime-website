"use client";

import { Pause, Play, X } from "lucide-react";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { REEL_FRAME_SECONDS, reelFrames } from "@/content/showreel";
import { capSrcSet } from "@/lib/srcset";
import "./showreel.css";

interface Labels {
  open: string;
  title: string;
  description: string;
  close: string;
  pause: string;
  play: string;
  previous: string;
  next: string;
  frame: string;
}

/**
 * "Watch the reel" (H-09): a button that opens the showreel in a modal <dialog> (native focus
 * containment, Esc closes, focus returns to the button). Nothing loads until it opens.
 * - Motion: each frame pushes in (CSS Ken Burns) and crossfades into the next, with the grain.
 *   CSS and React state only: no GSAP or Motion on these elements.
 * - Pause/play is always offered (WCAG 2.2.2); closing stops it.
 * - Reduced motion: no push-in, no auto-advance; a still with previous/next.
 */
export function Showreel({ labels }: { labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(0);
  const auto = open && playing && !reduced;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % reelFrames.length), REEL_FRAME_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [auto, index]);

  const show = () => {
    setIndex(0);
    setPlaying(true);
    setOpen(true);
    dialog.current?.showModal();
  };
  const step = (d: number) => setIndex((i) => (i + d + reelFrames.length) % reelFrames.length);

  return (
    <>
      <button type="button" className="reel-open text-link" onClick={show} aria-haspopup="dialog">
        <Play aria-hidden="true" strokeWidth={1.25} className="size-4" />
        {labels.open}
      </button>
      <dialog
        ref={dialog}
        className="reel"
        aria-labelledby="reel-title"
        aria-describedby="reel-desc"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <div className="reel-box" data-grain="off" style={{ "--reel-frame": `${REEL_FRAME_SECONDS}s` } as CSSProperties}>
          <div className="reel-bar">
            <h2 id="reel-title" className="text-eyebrow">
              {labels.title}
            </h2>
            <button type="button" className="reel-btn" onClick={() => dialog.current?.close()} aria-label={labels.close}>
              <X aria-hidden="true" strokeWidth={1.25} className="size-5" />
            </button>
          </div>
          <p id="reel-desc" className="sr-only">
            {labels.description}
          </p>
          <div className="reel-stage" data-reduced={reduced ? "" : undefined}>
            {open &&
              reelFrames.map((fr, i) => {
                // The previous (fading out), current and next frames are in the DOM, so the reel
                // loads as it plays and every change is a true crossfade.
                const n = reelFrames.length;
                const near = i === index || i === (index + 1) % n || i === (index - 1 + n) % n;
                if (!near) return null;
                const { props } = getImageProps({ src: fr.src, alt: "", width: fr.width, height: fr.height, sizes: "(min-width: 1100px) 1040px, 94vw" });
                return (
                  <div key={fr.src} className="reel-frame" data-active={i === index ? "" : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps output (decorative); the srcset is trimmed (D51) */}
                    <img {...props} srcSet={capSrcSet(props.srcSet, fr.width)} />
                  </div>
                );
              })}
            <span className="reel-grain" aria-hidden="true" />
          </div>
          <div className="reel-controls">
            {reduced ? (
              <>
                <button type="button" className="reel-btn reel-text-btn" onClick={() => step(-1)}>
                  {labels.previous}
                </button>
                <button type="button" className="reel-btn reel-text-btn" onClick={() => step(1)}>
                  {labels.next}
                </button>
              </>
            ) : (
              <button type="button" className="reel-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? labels.pause : labels.play}>
                {playing ? <Pause aria-hidden="true" strokeWidth={1.25} className="size-5" /> : <Play aria-hidden="true" strokeWidth={1.25} className="size-5" />}
              </button>
            )}
            <span className="reel-count tabular" aria-live="off">
              {labels.frame.replace("{n}", String(index + 1)).replace("{total}", String(reelFrames.length))}
            </span>
            <span className="reel-progress" aria-hidden="true">
              <span key={`${index}-${auto}`} className="reel-progress-fill" data-run={auto ? "" : undefined} />
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
