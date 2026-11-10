import { getLocale, getTranslations } from "next-intl/server";
import { CopyrightYear } from "./copyright-year";
import { Logo } from "./logo";
import { SectionRef } from "@/components/review/section-ref";
import { legal } from "@/config/legal";
import { imageCredits } from "@/content/credits";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { isFilled } from "@/lib/content-status";
import { HOME_REF } from "@/lib/review";

/** Build year for the prerendered HTML (cached, so cacheComponents can prerender it). */
async function copyrightYear() {
  "use cache";
  return String(new Date().getFullYear());
}

/**
 * The footer's closing rows (D78; the columns above them arrive with the homepage, Phase B).
 * A dark tone section (data-bg="own" keeps its espresso fill), so the header switches to its
 * dark tone over it. Fill or hide: the licence line waits for `config/legal.ts`, and "Image
 * credits" for the first credited stock image.
 */
export async function SiteFooter() {
  const [year, locale, t] = await Promise.all([copyrightYear(), getLocale() as Promise<Locale>, getTranslations("footer")]);
  const links = [
    { href: "/privacy", label: t("legal.privacy") },
    { href: "/terms", label: t("legal.terms") },
    { href: "/cookies", label: t("legal.cookies") },
    ...(imageCredits.length > 0 ? [{ href: "/credits", label: t("credits") }] : []),
  ];
  const licence = legal.licence[locale];

  return (
    <footer>
      <section data-tone="dark" data-bg="own" className="border-t border-line-dark">
        <SectionRef id={HOME_REF.footer} />
        <div className="frame grid gap-10 pt-14 pb-[calc(48px+env(safe-area-inset-bottom,0px))]">
          <Logo tone="dark" />
          <div className="grid gap-5 border-t border-line-dark pt-6 text-[0.85rem] text-ivory/70">
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
              <CopyrightYear buildYear={year} />
              <nav aria-label={t("legalNav")}>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 text-[0.8rem] text-ivory/60">
              <p>{t("disclosure")}</p>
              {isFilled(licence) && <p>{licence}</p>}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
