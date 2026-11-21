import type { Locale } from "@/content";
import { MENU } from "@/content/modules/menu-majlis";
import { EventPhoto } from "../event-photo";
import "../events-modules.css";

/**
 * A dallah in one line (an original drawing): lid and finial, the waisted body, the crescent beak
 * at inline-start, the handle at inline-end. Each stroke has pathLength 1, so GSAP draws it with
 * stroke-dashoffset 1 → 0; the server draws it complete.
 */
export function DallahLine() {
  const stroke = { pathLength: 1, strokeDasharray: 1, className: "mm-stroke" } as const;
  return (
    <svg className="mm-dallah" viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path {...stroke} d="M66 8a3 3 0 1 0 0.01 0M66 11L56 30H76L66 11M52 30H80" />
      <path {...stroke} d="M56 32C54 44 58 50 60 54C50 64 42 82 46 100C48 114 40 128 38 136H94C92 128 84 114 86 100C90 82 82 64 72 54C74 50 78 44 76 32" />
      <path {...stroke} d="M48 84C34 76 20 58 8 46L6 50C16 64 30 86 46 98" />
      <path {...stroke} d="M84 62C108 66 110 108 88 116" />
      <path {...stroke} d="M34 136H98M40 142H92" />
    </svg>
  );
}

/** The menu card and its photos (no hooks: shared by the fallback and the client module). */
export function MenuView({ locale }: { locale: Locale }) {
  return (
    <div className="evm" data-evm="menu">
      <div className="mm-grid">
        <article className="mm-card" aria-labelledby="mm-title">
          <header className="mm-top">
            <div>
              <h3 id="mm-title" className="mm-title">
                {MENU.title[locale]}
              </h3>
              <p className="mm-sub">{MENU.subtitle[locale]}</p>
            </div>
            <DallahLine />
          </header>
          <div className="mm-sections">
            {MENU.sections.map((s) => (
              <section key={s.title.en} className="mm-sec">
                <h4>{s.title[locale]}</h4>
                <ul>
                  {s.items.map((it) => (
                    <li key={it.en}>{it[locale]}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mm-foot">{MENU.footer[locale]}</p>
        </article>
        <figure className="mm-photos">
          {MENU.photos.map((p) => (
            <EventPhoto key={p.src} photo={p} locale={locale} sizes="(min-width: 900px) 26vw, 45vw" />
          ))}
          <figcaption className="mm-photos-note">{MENU.photosNote[locale]}</figcaption>
        </figure>
      </div>
    </div>
  );
}
