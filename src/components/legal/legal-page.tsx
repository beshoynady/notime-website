import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { contact } from "@/config/contact";
import { legal } from "@/config/legal";
import { getLegalDoc } from "@/content/legal";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { resolveLegal, type LegalDoc, type LegalValues } from "@/lib/legal";
import { localeAlternates } from "@/lib/seo";
import "./legal.css";

const LANGUAGE_NAME = { en: { ar: "Arabic", en: "English" }, ar: { ar: "العربية", en: "الإنجليزية" } } as const;

/** The config values the legal text needs, for one locale (D78: empty values hide their lines). */
export function legalValues(locale: Locale): LegalValues {
  return {
    legalName: legal.legalName,
    address: legal.address[locale],
    dataRequestContact: legal.dataRequestContact,
    whatsapp: contact.whatsapp,
    analytics: legal.analytics,
    courts: legal.courts[locale],
    prevailingLanguage: LANGUAGE_NAME[locale][legal.prevailingLanguage],
  };
}

/** Noindex until the owner's final read (`legal.reviewed`, CONTENT_CHECKLIST #24, D89). */
export async function legalMetadata(slug: LegalDoc["slug"], locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: getLegalDoc(slug).title[locale],
    description: t(`description.${slug}`),
    alternates: localeAlternates(locale, `/${slug}`),
    ...(legal.reviewed ? {} : { robots: { index: false, follow: true } }),
  };
}

/** "[label](/path)" in the legal text becomes a localized link; everything else stays text. */
function withLinks(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\(\/[a-z-]+\))/).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\((\/[a-z-]+)\)$/);
    return m ? (
      <Link key={i} href={m[2]} className="legal-link">
        {m[1]}
      </Link>
    ) : (
      part
    );
  });
}

/**
 * Privacy Policy, Terms of Use and Cookie Policy (D78): one quiet reading column on a light
 * ground, with the contents list beside it from 900px. Lines whose config value is missing are
 * already gone (resolveLegal), so nothing here shows a placeholder.
 */
export async function LegalPage({ slug, locale }: { slug: LegalDoc["slug"]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const doc = resolveLegal(getLegalDoc(slug), legalValues(locale), locale);
  const updated = new Intl.DateTimeFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { dateStyle: "long" }).format(new Date(`${doc.updated}T12:00:00Z`));
  return (
    <main id="main">
      <section data-tone="light" aria-labelledby="legal-title" className="legal section-pad">
        <div className="frame grid-12 legal-grid">
          <header className="legal-head">
            <p className="text-eyebrow legal-eyebrow">{t("eyebrow")}</p>
            <h1 id="legal-title" className="text-h1">
              {doc.title}
            </h1>
            <p className="legal-updated">
              {t("updated")} <time dateTime={doc.updated}>{updated}</time>
            </p>
          </header>
          <nav aria-label={t("contents")} className="legal-toc">
            <p className="text-eyebrow legal-eyebrow">{t("contents")}</p>
            <ul>
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading}</a>
                </li>
              ))}
            </ul>
          </nav>
          <article className="legal-body">
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="legal-section">
                <h2 id={`${s.id}-title`} className="legal-h2">
                  {s.heading}
                </h2>
                {s.blocks.map((b, i) =>
                  "p" in b ? (
                    <p key={i}>{withLinks(b.p)}</p>
                  ) : "list" in b ? (
                    <ul key={i} className="legal-list">
                      {b.list.map((item, j) => (
                        <li key={j}>{withLinks(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <div key={i} className="legal-cards">
                      {b.table.rows.map((row, j) => (
                        <dl key={j} className="legal-card">
                          {row.map((cell, k) => (
                            <div key={k}>
                              <dt>{b.table.head[k]}</dt>
                              <dd>{k === 0 ? <code>{cell}</code> : cell}</dd>
                            </div>
                          ))}
                        </dl>
                      ))}
                    </div>
                  ),
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}
