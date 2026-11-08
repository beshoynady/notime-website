import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import type { Category, Locale, Service } from "@/content";
import { QuoteActions, QuoteActionsView } from "./quote-actions";

/**
 * Act 3 · the closing (spec §4, part 5): `section#quote`, the target of every "Request a quote"
 * link (`?service=<anchor>#quote`). Its H2 is the category's closing line, which answers the
 * opening (storyboards, Act 3). Until the quote form exists (Phase 4) it offers WhatsApp and
 * email, each only once it is set in src/config/contact.ts.
 *
 * The service named in the link is read on the client (`useSearchParams`), so the page stays
 * prerendered; the shell renders the same actions without it.
 */
export async function CategoryQuote({
  category,
  services,
  locale,
  tone,
}: {
  category: Category;
  services: Service[];
  locale: Locale;
  tone: "dark" | "light";
}) {
  const t = await getTranslations("category.quote");
  const titles = Object.fromEntries(services.map((s) => [s.anchor, s.title[locale]]));
  return (
    <section id="quote" className="cat-quote cat-end" data-tone={tone} aria-labelledby="quote-title">
      <div className="cat-end-grid frame">
        <p className="text-eyebrow cat-end-head">{t("eyebrow")}</p>
        <div className="cat-quote-body">
          <h2 id="quote-title" className="cat-quote-title">
            {category.closing[locale]}
          </h2>
          {/* TODO: replace placeholder — the quote form (Phase 4) replaces this note and the direct actions. */}
          <p className="cat-quote-note">{t("body")}</p>
          <Suspense fallback={<QuoteActionsView tone={tone} />}>
            <QuoteActions titles={titles} tone={tone} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
