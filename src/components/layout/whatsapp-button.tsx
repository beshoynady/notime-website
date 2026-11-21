"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { contact } from "@/config/contact";
import { contactStatus } from "@/lib/content-status";
import { microTransition } from "@/lib/motion";
import { WhatsAppLink } from "./whatsapp-link";

const FAB =
  "grid size-14 cursor-pointer place-items-center rounded-full border-0 bg-champagne text-espresso no-underline shadow-[0_12px_30px_rgba(20,13,8,0.35)]";

/**
 * Floating WhatsApp button, pinned to the inline-end corner above the safe area.
 * Motion owns the hover/tap scale on the wrapper; the link/button itself is never animated.
 * Hidden (and out of the tab order) while a menu is open, via `.wa-fab` in globals.css.
 * Not rendered at all until contact.ts has a number (fill or hide, D78).
 */
export function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const reduced = useReducedMotion();
  if (!contactStatus(contact).whatsapp) return null;

  return (
    <div className="wa-fab group/wa fixed end-[calc(20px+var(--safe-end))] bottom-[calc(20px+env(safe-area-inset-bottom,0px))] z-[55]">
      <motion.div
        whileHover={reduced ? undefined : { scale: 1.06 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={microTransition}
      >
        {/* The message names where the visit came from (decision #35). */}
        <WhatsAppLink number={contact.whatsapp} aria-label={t("label")} className={FAB}>
          <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-6" />
        </WhatsAppLink>
      </motion.div>
    </div>
  );
}
