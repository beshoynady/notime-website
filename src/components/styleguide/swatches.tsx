"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SWATCHES } from "./palette";

/**
 * Colour swatches with a copy-hex button. Uses the Clipboard API; where it is missing or
 * refused (insecure origin, permissions), the hex text is selected instead so the visitor
 * can copy it by hand. Either way a polite status message says what happened.
 */
export function Swatches() {
  const t = useTranslations("styleguide.colour");
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const announce = (msg: string) => {
    setStatus(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 2400);
  };

  const copy = async (hex: string, target: HTMLElement) => {
    try {
      await navigator.clipboard.writeText(hex);
      announce(t("copied", { hex }));
    } catch {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      announce(t("selected", { hex }));
    }
  };

  return (
    <>
      <ul className="sg-swatches" role="list">
        {SWATCHES.map(({ key, hex, ink }) => (
          <li key={key} className="sg-swatch">
            <div className={cn("sg-chip", key === "ivory" && "border-b border-line-light")} style={{ background: hex, color: ink }}>
              {t(`swatches.${key}.chip`)}
            </div>
            <div className="sg-swatch-meta">
              <span className="font-semibold">{t(`swatches.${key}.name`)}</span>
              <span className="text-[0.82rem] leading-snug text-cocoa">{t(`swatches.${key}.role`)}</span>
              <button
                type="button"
                className="sg-hex"
                aria-label={t("copy", { hex })}
                onClick={(e) => copy(hex, e.currentTarget.querySelector("span")!)}
              >
                <span dir="ltr">{hex}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className={cn("sg-toast", status && "is-on")} role="status" aria-live="polite">
        {status}
      </div>
    </>
  );
}
