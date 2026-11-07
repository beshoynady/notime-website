import { getTranslations } from "next-intl/server";
import { ScrubColorWords } from "@/components/motion/scrub-color-words";
import "./about.css";

const FIGURES = ["markets", "integrated"] as const; // the profile's two figures (copy-deck rules)

/**
 * Home · About (dark, continuing the hero). One large statement whose words colour in as it
 * scrolls through (GSAP scrub, ScrubColorWords); the body and the two profile figures stay
 * still beneath it, so the statement is the only moving thing here.
 */
export async function About() {
  const t = await getTranslations("about");
  return (
    <section id="about" data-tone="dark" aria-labelledby="about-title" className="section-pad">
      <div className="frame">
        <h2 id="about-title" className="sec-eyebrow text-eyebrow text-champagne">
          {t("eyebrow")}
        </h2>
        <ScrubColorWords text={t("statement")} className="about-statement" />
        <div className="about-foot">
          <p className="about-body text-lead">{t("body")}</p>
          <dl className="about-figures">
            {FIGURES.map((k) => (
              <div key={k}>
                <dt className="text-eyebrow">{t(`stats.${k}.label`)}</dt>
                <dd className="tabular">{t(`stats.${k}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
