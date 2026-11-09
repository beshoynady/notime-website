import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/components/legal/legal.css";
import { SectionRef } from "@/components/review/section-ref";
import { imageCredits } from "@/content/credits";
import type { Locale } from "@/content/types";
import { localeAlternates } from "@/lib/seo";

/**
 * "Image credits" (D80): the photographer and the source page of every licensed stock image on the
 * site. Neither licence requires credit, both welcome it, and it keeps the record public. While
 * no stock image is installed the page doesn't exist (404) and the footer doesn't link it (D78).
 */
const SOURCE = { pexels: "Pexels", unsplash: "Unsplash" } as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/credits">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return { title: t("title"), description: t("description"), alternates: localeAlternates(locale as Locale, "/credits") };
}

export default async function Page({ params }: PageProps<"/[locale]/credits">) {
  const { locale } = await params;
  if (imageCredits.length === 0) notFound();
  const t = await getTranslations({ locale, namespace: "credits" });
  // One line per photographer and page: a photo used in two crops is credited once.
  const seen = new Set<string>();
  const rows = imageCredits.filter((c) => c.source !== "chatgpt" && !seen.has(c.pageUrl) && seen.add(c.pageUrl));
  return (
    <main id="main">
      <section data-tone="light" aria-labelledby="credits-title" className="legal section-pad">
        <SectionRef id="LG-04" />
        <div className="frame">
          <header className="legal-head">
            <p className="text-eyebrow legal-eyebrow">{t("eyebrow")}</p>
            <h1 id="credits-title" className="text-h1">
              {t("title")}
            </h1>
            <p className="text-lead mt-6 max-w-[60ch]">{t("intro")}</p>
          </header>
          <ul className="credits-list mt-12 grid gap-4 border-t border-line-light pt-8">
            {rows.map((c) => (
              <li key={c.file} className="flex flex-wrap items-baseline gap-x-2 border-b border-line-light pb-4">
                <span className="font-medium">{c.photographer}</span>
                <span className="text-cocoa">·</span>
                <a href={c.pageUrl} target="_blank" rel="noopener noreferrer" className="legal-link">
                  {t("on", { source: SOURCE[c.source as keyof typeof SOURCE] })}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[60ch] text-[0.95rem] text-cocoa">{t("aiNote")}</p>
        </div>
      </section>
    </main>
  );
}
