import { getProducts, productHref, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { fill } from "@/content/form-copy";
import { hero, productsCopy as p } from "@/content/software/page";
import { InterestDisclosure } from "./interest-disclosure";
import { InvitelyScreens, SmartMenuScreens } from "./product-screens";

const ORDER = ["invitely", "smart-menu"] as const;

/**
 * Products, Coming soon (brief §11): Invitely and Smart Menu (D78 names). Each card: the
 * problem, 3 key features (drafts the client confirms, OQ #24), concept screens labelled
 * "Preview" with "Example" data, and "Register interest" (the interest form, D92). Kept apart
 * from the service visuals so a demo is never mistaken for a product (§5.5).
 */
export function Products({ locale }: { locale: Locale }) {
  const products = getProducts();
  return (
    <section id={p.anchor} data-tone="light" aria-labelledby="products-title" className="sw-section sw-products">
      <div className="frame">
        <header className="sw-head">
          <p className="sw-block-kicker">{p.eyebrow[locale]}</p>
          <h2 id="products-title" className="sw-h2">
            {p.title[locale]}
          </h2>
          <p className="sw-lead">{p.intro[locale]}</p>
        </header>
        <div className="sw-product-list">
          {ORDER.map((id) => {
            const item = p.items[id];
            const product = products.find((x) => x.slug === item.slug)!;
            const name = product.name[locale];
            return (
              <article key={id} className="sw-product" aria-labelledby={`${id}-title`}>
                <div className="sw-product-visual">
                  <span className="sw-product-tags">
                    <span className="sw-tag sw-tag-fill">{hero.ui.preview[locale]}</span>
                    <span className="sw-tag">{hero.ui.example[locale]}</span>
                  </span>
                  {id === "invitely" ? <InvitelyScreens locale={locale} /> : <SmartMenuScreens locale={locale} />}
                </div>
                <div className="sw-product-body">
                  <span className="badge badge-soon">{hero.ui.soon[locale]}</span>
                  <h3 id={`${id}-title`} className="sw-product-name">
                    {name}
                    <span className="sw-product-desc"> · {product.descriptor[locale]}</span>
                  </h3>
                  <p className="sw-product-problem">
                    <span className="sw-mini-label">{p.problem[locale]}</span>
                    {item.problem[locale]}
                  </p>
                  <details className="sw-more">
                    <summary>{p.features[locale]}</summary>
                    <ul className="sw-product-features">
                      {item.features.map((f, k) => (
                        <li key={k}>{f[locale]}</li>
                      ))}
                    </ul>
                  </details>
                  <Link href={productHref(id)} className="sw-link">
                    {fill(p.more[locale], { product: name })}
                  </Link>
                  <InterestDisclosure
                    locale={locale}
                    product={id}
                    productName={name}
                    label={fill(p.registerFor[locale], { product: name })}
                    closeLabel={p.close[locale]}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
