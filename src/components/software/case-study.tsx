import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { caseStudyNamed } from "@/config/software";
import type { Locale } from "@/content";
import { caseStudy as c } from "@/content/software/page";
import { Laptop, Phone } from "./device-frames";
import { RedrawLaptop, RedrawPhone } from "./redraws";

/**
 * The case study (brief §6, the page's peak): Challenge → Approach → What we built → Result,
 * verified facts only (profile p16, p18; case-studies.md §2). Anonymised by default (D67):
 * stylised redraws in the brand palette, no name, logo, URL or screenshot. `caseStudyNamed()`
 * (WORK_NAMED.uaeaf, off) switches every text and visual to the named version with the real
 * profile screens, only once the client approves (OQ #17).
 */
export function CaseStudy({ locale }: { locale: Locale }) {
  const named = caseStudyNamed();
  const client = (named ? c.named.client : c.anonymous.client)[locale];
  const p = c.parts;
  return (
    <section id={c.anchor} data-tone="light" aria-labelledby="case-title" className="sw-section sw-case">
      <div className="frame sw-case-layout">
        <div className="sw-case-visual" data-sw-devices="">
          <Laptop className="sw-case-laptop">{named ? <Image src={c.named.screens.laptop} alt={c.named.alt.laptop[locale]} sizes="(min-width: 900px) 45vw, 90vw" fill className="object-cover" /> : <RedrawLaptop />}</Laptop>
          <Phone className="sw-case-phone">{named ? <Image src={c.named.screens.phone} alt={c.named.alt.phone[locale]} sizes="(min-width: 900px) 14vw, 30vw" fill className="object-cover" /> : <RedrawPhone />}</Phone>
          {!named && <p className="sw-case-note">{c.redraw[locale]}</p>}
        </div>
        <div className="sw-case-copy">
          <p className="sw-block-kicker">
            {c.eyebrow[locale]}
            <span aria-hidden="true"> · </span>
            {client}
          </p>
          <h2 id="case-title" className="sw-h2">
            {c.title[locale]}
          </h2>
          <dl className="sw-case-parts" data-sw-reveal="">
            <div>
              <dt>{p.challenge.label[locale]}</dt>
              <dd>{p.challenge.body[locale]}</dd>
            </div>
            <div>
              <dt>{p.approach.label[locale]}</dt>
              <dd>{p.approach.body[locale]}</dd>
            </div>
            <div>
              <dt>{p.built.label[locale]}</dt>
              <dd>
                <ul className="sw-check" data-sw-checklist="">
                  {p.built.items.map((it, i) => (
                    <li key={i}>
                      <Check aria-hidden="true" strokeWidth={1.75} className="size-4 shrink-0" />
                      {it[locale]}
                    </li>
                  ))}
                </ul>
                <p className="sw-case-modules">{p.built.modules[locale]}</p>
              </dd>
            </div>
            <div>
              <dt>{p.result.label[locale]}</dt>
              <dd>
                <span className="sw-live-inline">
                  <i aria-hidden="true" />
                  {p.result.body[locale]}
                </span>
              </dd>
            </div>
          </dl>
          {named && (
            <a href={c.named.url} className="sw-link" target="_blank" rel="noopener noreferrer">
              {c.visit[locale]}
              <ArrowUpRight aria-hidden="true" strokeWidth={1.25} className="size-4 rtl:-scale-x-100" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
