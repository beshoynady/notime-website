import { CopyrightYear } from "./copyright-year";
import { Logo } from "./logo";
import { SectionRef } from "@/components/review/section-ref";
import { HOME_REF } from "@/lib/review";

/** Build year for the prerendered HTML (cached, so cacheComponents can prerender it). */
async function copyrightYear() {
  "use cache";
  return String(new Date().getFullYear());
}

/**
 * Footer stub for Phase 1. A dark tone section (data-bg="own" keeps its espresso fill),
 * so the header switches to its dark tone over it.
 */
export async function SiteFooter() {
  const year = await copyrightYear();
  return (
    <footer>
      <section data-tone="dark" data-bg="own" className="border-t border-line-dark">
        <SectionRef id={HOME_REF.footer} />
        <div className="frame flex flex-wrap items-end justify-between gap-x-8 gap-y-6 py-14 pb-[calc(56px+env(safe-area-inset-bottom,0px))]">
          <Logo tone="dark" />
          <div className="grid gap-1.5 text-[0.85rem] text-ivory/70">
            <CopyrightYear buildYear={year} />
          </div>
        </div>
      </section>
    </footer>
  );
}
