import { getLocale, getTranslations } from "next-intl/server";
import { CopyrightYear } from "./copyright-year";
import { Logo } from "./logo";
import { SectionRef } from "@/components/review/section-ref";
import { NAV_LINKS } from "./nav-links";
import { contact } from "@/config/contact";
import { legal } from "@/config/legal";
import { categoryHref, getCategories, SERVICES_INDEX_HREF } from "@/content";
import { imageCredits } from "@/content/credits";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { contactStatus, isFilled, liveLinks } from "@/lib/content-status";
import { HOME_REF } from "@/lib/review";
import { whatsappHref } from "@/lib/whatsapp";

/** Build year for the prerendered HTML (cached, so cacheComponents can prerender it). */
async function copyrightYear() {
  "use cache";
  return String(new Date().getFullYear());
}

/**
 * The footer (H-11): the logo and the columns (services, company, contact, follow), then the
 * closing rows (D78). A dark tone section (data-bg="own" keeps its espresso fill), so the header
 * switches to its dark tone over it. Fill or hide: company links show once their page exists
 * (`liveLinks`); email, WhatsApp and the socials once `config/contact.ts` has them (the Follow
 * column hides with no social link); the licence line waits for `config/legal.ts`, and "Image
 * credits" for the first credited stock image.
 */
export async function SiteFooter() {
  const [year, locale, t, tn, tw] = await Promise.all([
    copyrightYear(),
    getLocale() as Promise<Locale>,
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("whatsapp"),
  ]);
  const has = contactStatus(contact);
  const wa = has.whatsapp ? whatsappHref(contact.whatsapp, tw("prefill")) : null;
  // Digital Solutions is already in the services column.
  const company = [
    { href: SERVICES_INDEX_HREF, label: tn("services") },
    ...liveLinks(NAV_LINKS.filter((l) => l.key !== "digital")).map((l) => ({ href: l.href, label: tn(l.key) })),
  ];
  const social = [
    { key: "instagram", href: contact.instagram, label: "Instagram" },
    { key: "facebook", href: contact.facebook, label: "Facebook" },
  ].filter((l) => has[l.key as "instagram" | "facebook"]);
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
          <div className="footer-top">
            <Logo tone="dark" />
            <div className="footer-cols">
              <nav aria-labelledby="footer-services">
                <h2 id="footer-services" className="footer-col-title text-eyebrow">
                  {t("columns.services")}
                </h2>
                <ul>
                  {getCategories().map((c) => (
                    <li key={c.slug}>
                      <Link href={categoryHref(c.slug)} className="footer-link">
                        {c.title[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-labelledby="footer-company">
                <h2 id="footer-company" className="footer-col-title text-eyebrow">
                  {t("columns.company")}
                </h2>
                <ul>
                  {company.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div>
                <h2 className="footer-col-title text-eyebrow">{t("columns.contact")}</h2>
                <ul>
                  <li>
                    <address className="not-italic">{t("address")}</address>
                  </li>
                  {has.email && (
                    <li>
                      <a href={`mailto:${contact.email}`} className="footer-link" dir="ltr">
                        {contact.email}
                      </a>
                    </li>
                  )}
                  {wa && (
                    <li>
                      <a href={wa} className="footer-link" target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              {social.length > 0 && (
                <div>
                  <h2 className="footer-col-title text-eyebrow">{t("columns.follow")}</h2>
                  <ul>
                    {social.map((l) => (
                      <li key={l.key}>
                        <a href={l.href} className="footer-link" target="_blank" rel="noopener noreferrer">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
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
