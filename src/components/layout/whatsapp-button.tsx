"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { contact } from "@/config/contact";
import { microTransition } from "@/lib/motion";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const FAB =
  "grid size-14 cursor-pointer place-items-center rounded-full border-0 bg-champagne text-espresso no-underline shadow-[0_12px_30px_rgba(20,13,8,0.35)]";

/**
 * Floating WhatsApp button, pinned to the inline-end corner above the safe area.
 * Motion owns the hover/tap scale on the wrapper; the link/button itself is never animated.
 * Hidden (and out of the tab order) while a menu is open, via `.wa-fab` in globals.css.
 */
export function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const reduced = useReducedMotion();
  const tipId = useId();
  const [tip, setTip] = useState(false);
  const href = whatsappHref(contact.whatsapp, t("prefill"));

  useEffect(() => {
    if (!tip) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTip(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tip]);

  const icon = <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-6" />;

  return (
    <div className="wa-fab group/wa fixed end-[calc(20px+var(--safe-end))] bottom-[calc(20px+env(safe-area-inset-bottom,0px))] z-[55]">
      <motion.div
        whileHover={reduced ? undefined : { scale: 1.06 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={microTransition}
      >
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={t("label")} className={FAB}>
            {icon}
          </a>
        ) : (
          // TODO: replace placeholder — WhatsApp number pending (CONTENT_CHECKLIST #7)
          <button
            type="button"
            aria-label={t("label")}
            aria-describedby={tipId}
            onClick={() => setTip((v) => !v)}
            onBlur={() => setTip(false)}
            className={FAB}
          >
            {icon}
          </button>
        )}
      </motion.div>
      {!href && (
        <span
          id={tipId}
          role="tooltip"
          className={cn(
            "text-eyebrow pointer-events-none absolute end-[calc(100%+12px)] top-1/2 -translate-y-1/2 rounded-[var(--radius)] bg-espresso px-3.5 py-2.5 text-[0.66rem] whitespace-nowrap text-ivory opacity-0 shadow-[0_10px_24px_rgba(20,13,8,0.3)] transition-opacity duration-300",
            "group-hover/wa:opacity-100 group-has-[:focus-visible]/wa:opacity-100 lang-ar:text-[0.8rem]",
            tip && "opacity-100",
          )}
        >
          {t("pending")}
        </span>
      )}
    </div>
  );
}
