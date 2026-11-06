import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/button";
import { LangToggle } from "./lang-toggle";
import { Logo } from "./logo";

// TODO: replace placeholder — these anchors point at homepage sections until the pages exist.
export const NAV_LINKS = [
  { key: "work", href: "/#work" },
  { key: "digital", href: "/#digital" },
  { key: "about", href: "/#about" },
  { key: "contact", href: "/#contact" },
] as const;
export const QUOTE_HREF = "/#contact"; // TODO: replace placeholder — quote form page

/**
 * Fixed 68px header. The outer [data-header-shell] is the only element the hero intro
 * fades (GSAP); the header itself switches tone via ToneController.
 * `servicesSlot` holds the mega-menu trigger and `menuSlot` the mobile burger.
 */
export function SiteHeader({ servicesSlot, menuSlot }: { servicesSlot?: ReactNode; menuSlot?: ReactNode }) {
  const t = useTranslations();
  return (
    <div data-header-shell="">
      <a
        href="#main"
        className="text-eyebrow fixed start-4 top-3 z-[70] -translate-y-24 rounded-[var(--radius)] bg-champagne px-4 py-3 text-espresso focus-visible:translate-y-0"
      >
        {t("common.skipToContent")}
      </a>
      <div className="safe-top-strip" aria-hidden="true" />
      <header id="site-header" data-header-tone="hero" className="fixed inset-x-0 top-[env(safe-area-inset-top,0px)] z-50">
        <div className="frame flex h-[var(--header-h)] items-center justify-between gap-4">
          <Logo />
          <nav aria-label={t("nav.label")} className="hidden items-center gap-[30px] text-[0.78rem] tracking-[0.16em] uppercase min-[900px]:flex lang-ar:text-[0.9rem] lang-ar:tracking-normal lang-ar:normal-case">
            {servicesSlot ?? (
              <Link href="/#services" className="nav-link no-underline">
                {t("nav.services")}
              </Link>
            )}
            {NAV_LINKS.map((l) => (
              <Link key={l.key} href={l.href} className="nav-link no-underline">
                {t(`nav.${l.key}`)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LangToggle />
            <ButtonLink href={QUOTE_HREF} size="sm" className="hidden min-[1100px]:inline-flex">
              {t("header.quote")}
            </ButtonLink>
            {menuSlot}
          </div>
        </div>
      </header>
    </div>
  );
}
