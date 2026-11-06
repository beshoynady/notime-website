import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/button";
import { LangToggle } from "./lang-toggle";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { getMenuData } from "./menu-data";
import { NAV_LINKS, QUOTE_HREF } from "./nav-links";
import type { Locale } from "@/content";

/**
 * Fixed 68px header. The outer [data-header-shell] is the only element the hero intro
 * fades (GSAP); the header itself switches tone via ToneController.
 * `menuSlot` holds the mobile burger (Task 7).
 */
export function SiteHeader({ menuSlot }: { menuSlot?: ReactNode }) {
  const t = useTranslations();
  const menu = getMenuData(useLocale() as Locale);
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
            <MegaMenu data={menu} />
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
