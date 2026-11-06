"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import { ButtonLink } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Link } from "@/i18n/navigation";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Numeral, ProductStrip } from "./mega-menu";
import type { MenuData } from "./menu-data";
import { NAV_LINKS, QUOTE_HREF } from "./nav-links";

const listVariants: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } };
const itemVariants: Variants = {
  hidden: { y: 22, opacity: 0 },
  shown: { y: 0, opacity: 1, transition: { duration: 0.7, ease: ease.power3Out } },
};

/**
 * Mobile menu (<900px): burger → full-screen espresso overlay under the header.
 * Native <details> accordions work without JS; Motion adds the reveal and stagger.
 * While open: Lenis stops, the page behind is inert, Esc closes and refocuses the burger.
 */
export function MobileMenu({ data }: { data: MenuData }) {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const still = reduced ? { duration: 0 } : undefined;

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) burger.current?.focus();
  }, []);

  useEffect(() => {
    const header = burger.current?.closest<HTMLElement>("#site-header");
    const stage = document.getElementById("stage");
    if (!open) return;
    if (header) header.dataset.menuOpen = "";
    stage?.setAttribute("inert", "");
    document.documentElement.style.overflow = "hidden";
    lenis.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && close();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      if (header) delete header.dataset.menuOpen;
      stage?.removeAttribute("inert");
      document.documentElement.style.overflow = "";
      lenis.start();
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close, lenis]);

  return (
    <>
      <button
        ref={burger}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={t(open ? "mobileMenu.close" : "mobileMenu.open")}
        onClick={() => setOpen((v) => !v)}
        className="burger grid size-11 cursor-pointer place-content-center gap-1.5 rounded-[var(--radius)] border border-current bg-transparent opacity-90 min-[900px]:hidden"
      >
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            data-tone="dark"
            data-grain="off"
            data-lenis-prevent=""
            className="fixed inset-x-0 top-[calc(var(--header-h)+env(safe-area-inset-top,0px))] bottom-0 overflow-auto overscroll-contain bg-espresso pt-5 pb-[calc(40px+env(safe-area-inset-bottom,0px))] text-ivory min-[900px]:hidden"
            onClick={(e) => (e.target as HTMLElement).closest("a") && close()}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", transition: still ?? { duration: 0.7, ease: ease.expoOut } }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: still ?? { duration: 0.4, ease: [0.7, 0, 0.84, 0] } }}
          >
            <motion.nav aria-label={t("nav.label")} className="frame" variants={listVariants} initial={reduced ? "shown" : "hidden"} animate="shown">
              <motion.p variants={itemVariants} className="text-eyebrow mb-1 text-taupe">
                {t("mobileMenu.services")}
              </motion.p>
              {data.categories.map((c) => (
                <motion.details key={c.slug} variants={itemVariants} className="group/acc border-b border-line-dark">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-[17px] text-[1.15rem] font-light [&::-webkit-details-marker]:hidden">
                    <span>
                      <Numeral className="inline-block w-[52px] text-[0.66rem] tracking-[0.2em] text-taupe">{c.numeral}</Numeral>
                      {c.title}
                    </span>
                    <span aria-hidden="true" className="text-[1.4rem] leading-none text-champagne transition-transform duration-500 ease-expo-out group-open/acc:rotate-45">
                      +
                    </span>
                  </summary>
                  <ul className="m-0 grid list-none p-0 pb-3.5">
                    {c.services.map((s) => (
                      <li key={s.slug}>
                        <Link href={s.href} className="flex min-h-11 items-center ps-[52px] text-ivory/75 no-underline hover:text-champagne">
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.details>
              ))}
              {NAV_LINKS.map((l) => (
                <motion.div key={l.key} variants={itemVariants}>
                  <Link href={l.href} className="block border-b border-line-dark py-5 text-[1.7rem] font-light no-underline">
                    {t(`nav.${l.key}`)}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants}>
                <ProductStrip products={data.products} className="mt-7 mb-6" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ButtonLink href={QUOTE_HREF} arrow className={cn("w-full")}>
                  {t("header.quote")}
                </ButtonLink>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
