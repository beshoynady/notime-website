import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Category, Locale } from "@/content";

/**
 * Act 3 · the FAQ (spec §4, part 4). Native `<details>`: Enter and Space open and close it with
 * no script, and the answers stay in the page for search and for find-in-page. The FAQPage
 * JSON-LD (jsonld.ts) is emitted only for answers that are written.
 */
export async function CategoryFaq({ category, locale, tone }: { category: Category; locale: Locale; tone: "dark" | "light" }) {
  const t = await getTranslations("category");
  return (
    <section className="cat-faq cat-end" data-tone={tone} aria-labelledby="faq-title">
      <div className="cat-end-grid frame">
        <header className="cat-end-head">
          <p className="text-eyebrow">{t("faqEyebrow")}</p>
          <h2 id="faq-title" className="cat-faq-title">
            {t("faqHeading")}
          </h2>
        </header>
        {/* TODO: replace placeholder — each category's FAQ is written with its copy deck (Task 3.1 and later). */}
        <div className="cat-faq-list">
          {category.faq.map((item, i) => (
            <details key={i} className="cat-faq-item">
              <summary>
                <span>{item.q[locale]}</span>
                <Plus aria-hidden="true" strokeWidth={1.25} className="cat-faq-icon" />
              </summary>
              <div className="cat-faq-a">
                <p>{item.a[locale]}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
