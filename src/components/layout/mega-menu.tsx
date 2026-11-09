"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { useMegaMenu } from "@/hooks/use-mega-menu";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Link } from "@/i18n/navigation";
import { BrandImage } from "@/components/ui/brand-image";
import { Numeral } from "@/components/ui/numeral";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { MenuData } from "./menu-data";

const EXPO_IN = [0.7, 0, 0.84, 0] as const;

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { y: 18, opacity: 0 },
  shown: { y: 0, opacity: 1, transition: { duration: 0.7, ease: ease.power3Out } },
};
const serviceListVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.035 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
const serviceVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  shown: { y: 0, opacity: 1, transition: { duration: 0.45, ease: ease.power3Out } },
};

/** Directional arrow that mirrors in RTL. */
export function Arrow({ className }: { className?: string }) {
  return <ArrowRight aria-hidden="true" strokeWidth={1.25} className={cn("size-4 rtl:-scale-x-100", className)} />;
}

/**
 * Desktop mega menu (≥900px): trigger + full-width espresso panel under the header.
 * Motion owns every animation here (GSAP never touches these elements).
 */
export function MegaMenu({ data }: { data: MenuData }) {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const { state, triggerProps, regionProps, panelId, setActive, close } = useMegaMenu(data.categories[0].slug);
  const active = data.categories.find((c) => c.slug === state.active) ?? data.categories[0];
  const still = reduced ? { duration: 0 } : undefined;

  return (
    <div {...regionProps} className="flex items-center">
      {/* Without JS the disclosure cannot work, so a plain link stands in. */}
      <Link href={data.allServicesHref} className="nav-link no-underline [html[data-js]_&]:hidden">
        {t("nav.services")}
      </Link>
      <button
        {...triggerProps}
        className="nav-link hidden min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 uppercase [html[data-js]_&]:inline-flex lang-ar:normal-case"
        style={{ font: "inherit", letterSpacing: "inherit" }}
      >
        {t("nav.services")}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.25}
          className={cn("size-3.5 transition-transform duration-500 ease-expo-out", state.open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {state.open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={() => close()}
              className="fixed inset-0 top-[calc(var(--header-h)+env(safe-area-inset-top,0px))] -z-10 bg-[rgba(30,20,14,0.55)] backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: still ?? { duration: 0.4 } }}
              exit={{ opacity: 0, transition: still ?? { duration: 0.35 } }}
            />
            <motion.div
              key="panel"
              id={panelId}
              data-tone="dark"
              data-grain="off"
              data-lenis-prevent=""
              className="absolute inset-x-0 top-full text-base max-h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top,0px))] overflow-auto overscroll-contain border-b border-line-dark bg-espresso normal-case tracking-normal text-ivory shadow-[0_30px_60px_rgba(20,13,8,0.35)]"
              onClick={(e) => (e.target as HTMLElement).closest("a") && close()}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)", transition: still ?? { duration: 0.75, ease: ease.expoOut } }}
              exit={{ clipPath: "inset(0 0 100% 0)", transition: still ?? { duration: 0.45, ease: EXPO_IN } }}
            >
              <div className="frame">
                <motion.div
                  className="grid grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)] gap-[clamp(28px,4vw,64px)] pt-11 pb-9"
                  variants={listVariants}
                  initial={reduced ? "shown" : "hidden"}
                  animate="shown"
                >
                  {/* 1 · Intro and categories */}
                  <div>
                    <div className="mb-7 grid gap-2.5">
                      <motion.span variants={itemVariants} className="text-eyebrow text-champagne">
                        {t("megaMenu.eyebrow")}
                      </motion.span>
                      <motion.p variants={itemVariants} className="m-0 text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.15] font-light">
                        {t("megaMenu.headingLead")} <b className="font-semibold">{t("megaMenu.headingKey")}</b>
                      </motion.p>
                      <motion.p variants={itemVariants} className="m-0 max-w-[36ch] text-[0.9rem] text-ivory/70">
                        {t("megaMenu.intro")}
                      </motion.p>
                    </div>
                    <ul className="m-0 list-none border-t border-line-dark p-0">
                      {data.categories.map((c) => {
                        const on = c.slug === active.slug;
                        return (
                          <motion.li key={c.slug} variants={itemVariants}>
                            <Link
                              href={c.href}
                              aria-current={on ? "true" : undefined}
                              onPointerEnter={() => setActive(c.slug)}
                              onFocus={() => setActive(c.slug)}
                              className={cn(
                                "grid min-h-11 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-line-dark py-[15px] no-underline",
                                "transition-[color,padding] duration-500 ease-expo-out",
                                on ? "ps-2.5 text-ivory" : "text-ivory/60 hover:text-ivory",
                              )}
                            >
                              <Numeral className="text-[0.68rem] tracking-[0.2em] text-taupe">{c.numeral}</Numeral>
                              <span className={cn("text-[1.1rem]", on ? "font-medium" : "font-light")}>{c.title}</span>
                              <Arrow
                                className={cn(
                                  "text-champagne transition-[opacity,translate] duration-500 ease-expo-out",
                                  on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 rtl:translate-x-2",
                                )}
                              />
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* 2 · Services of the active category */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-baseline justify-between gap-3 border-b border-line-dark pb-3.5">
                      <span className="text-eyebrow text-taupe">
                        {t("megaMenu.count", { count: active.services.length })} · <Numeral>{active.numeral}</Numeral>
                      </span>
                      <Link href={active.href} className="inline-flex min-h-11 items-center gap-2 text-[0.8rem] no-underline hover:text-champagne">
                        {t("megaMenu.viewCategory")}
                        <Arrow className="size-3.5" />
                      </Link>
                    </div>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.ul
                        key={active.slug}
                        className="m-0 grid list-none grid-cols-2 gap-x-7 p-0"
                        variants={serviceListVariants}
                        initial={reduced ? "shown" : "hidden"}
                        animate="shown"
                        exit={reduced ? undefined : "exit"}
                      >
                        {active.services.map((s) => (
                          <motion.li key={s.slug} variants={serviceVariants}>
                            <Link
                              href={s.href}
                              className="group/svc flex min-h-11 items-center border-b border-champagne/8 py-3.5 text-[0.95rem] text-ivory/86 no-underline transition-colors duration-300 hover:text-champagne focus-visible:text-champagne"
                            >
                              <span
                                aria-hidden="true"
                                className="h-px w-0 bg-champagne transition-[width,margin] duration-500 ease-expo-out group-hover/svc:me-2.5 group-hover/svc:w-3.5 group-focus-visible/svc:me-2.5 group-focus-visible/svc:w-3.5"
                              />
                              {s.title}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                  </motion.div>

                  {/* 3 · Featured image */}
                  <motion.div variants={itemVariants} className="grid content-start gap-3.5">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={active.slug}
                        initial={reduced ? false : { opacity: 0.35, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1, transition: still ?? { duration: 0.9, ease: ease.expoOut } }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <BrandImage slot={active.image} sizes="(min-width: 1280px) 280px, 22vw" />
                      </motion.div>
                    </AnimatePresence>
                    <p className="m-0 text-[0.88rem] leading-[1.55] text-ivory/75">{active.summary}</p>
                  </motion.div>
                </motion.div>

                {/* Footer strip */}
                <motion.div
                  variants={itemVariants}
                  initial={reduced ? "shown" : "hidden"}
                  animate="shown"
                  className="flex flex-wrap items-center justify-between gap-4 border-t border-line-dark pt-[18px] pb-[22px] text-[0.85rem]"
                >
                  <ProductStrip products={data.products} />
                  <Link href={data.allServicesHref} className="inline-flex min-h-11 items-center gap-2 no-underline hover:text-champagne">
                    {t("megaMenu.allServices", { count: data.serviceCount })}
                    <Arrow className="size-3.5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** "In development" + products with a Coming soon badge. Shared with the mobile menu. */
export function ProductStrip({ products, className }: { products: MenuData["products"]; className?: string }) {
  const t = useTranslations();
  return (
    <div className={cn("flex flex-wrap items-center gap-x-[22px] gap-y-2.5", className)}>
      <span className="text-eyebrow text-[0.66rem] tracking-[0.22em] text-taupe lang-ar:text-[0.8rem]">{t("megaMenu.inDevelopment")}</span>
      {products.map((p) => (
        <Link key={p.slug} href={p.href} className="inline-flex min-h-11 items-center gap-2 no-underline hover:text-champagne">
          {p.name}
          <span className="badge-soon">{t("common.comingSoon")}</span>
        </Link>
      ))}
    </div>
  );
}
