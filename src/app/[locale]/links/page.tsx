import type { Metadata } from "next";
import { ArrowRight, Camera, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { contact } from "@/config/contact";
import { categoryHref, CONTACT_HREF, type Locale, WORK_INDEX_HREF } from "@/content";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";
import { whatsappHref } from "@/lib/whatsapp";
import "./links.css";

/**
 * /[locale]/links (final pass §6.1, D110): the link-in-bio page for Instagram and other profiles.
 * Mobile-first, static, no client code of its own: six large rows, WhatsApp first and Instagram
 * last, each shown only once its address is set (src/config/contact.ts). noindex (a duplicate of
 * the navigation, not a search landing) and out of the sitemap. Tag the profile link with UTM
 * (docs/marketing/utm-guide-ar.md): the forms then report it.
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/links">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "linksPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/links"),
    robots: { index: false, follow: true },
  };
}

type Row = { key: string; href: string; external?: boolean; icon?: ReactNode; primary?: boolean };

export default async function Page({ params }: PageProps<"/[locale]/links">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "linksPage" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const wa = whatsappHref(contact.whatsapp, tw("prefill"));
  const icon = "size-5 shrink-0";
  const rows: Row[] = [
    ...(wa ? [{ key: "whatsapp", href: wa, external: true, primary: true, icon: <MessageCircle aria-hidden="true" strokeWidth={1.5} className={icon} /> }] : []),
    { key: "quote", href: CONTACT_HREF, primary: !wa },
    { key: "work", href: WORK_INDEX_HREF },
    { key: "celebrations", href: `${categoryHref("events-hospitality")}#celebrations` },
    { key: "software", href: categoryHref("software-digital") },
    ...(contact.instagram ? [{ key: "instagram", href: contact.instagram, external: true, icon: <Camera aria-hidden="true" strokeWidth={1.5} className={icon} /> }] : []),
  ];

  return (
    <main id="main" className="lk">
      <section data-tone="dark" aria-labelledby="lk-title" className="lk-section">
        <div className="lk-col">
          <header className="lk-head">
            <p className="text-eyebrow text-champagne">{t("eyebrow")}</p>
            <h1 id="lk-title" className="lk-title">
              {t("title")}
            </h1>
            <p className="lk-lead">{t("lead")}</p>
          </header>
          <nav aria-label={t("listLabel")}>
            <ul className="lk-list">
              {rows.map((r) => {
                const inner = (
                  <>
                    {r.icon}
                    <span className="lk-text">
                      <span className="lk-row-title">{t(`${r.key}.title`)}</span>
                      <span className="lk-row-note">{t(`${r.key}.note`)}</span>
                    </span>
                    <ArrowRight aria-hidden="true" strokeWidth={1.25} className="lk-arrow size-5 shrink-0 rtl:-scale-x-100" />
                  </>
                );
                return (
                  <li key={r.key}>
                    {r.external ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="lk-row" data-primary={r.primary ? "" : undefined}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={r.href} className="lk-row" data-primary={r.primary ? "" : undefined}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          {contact.email && (
            <p className="lk-email">
              {t("email")}{" "}
              <a href={`mailto:${contact.email}`} className="text-link" dir="ltr">
                {contact.email}
              </a>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
