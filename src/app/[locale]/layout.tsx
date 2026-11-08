import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { DirectionProvider } from "@/components/providers/direction-provider";
import { AnchorScroll } from "@/components/providers/anchor-scroll";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { ToneController } from "@/components/providers/tone-controller";
import { SITE_URL } from "@/config/site";
import { dirOf, routing, type AppLocale } from "@/i18n/routing";
import { FONT_PRELOADS } from "@/lib/fonts";
import { localeAlternates } from "@/lib/seo";
import "../fonts.css";
import "../globals.css";

/**
 * Runs before first paint: marks JS as available and records reduced motion, so
 * intro-only states (shutters, hidden chars) apply only when they can be animated
 * away. Without JS the page renders complete and static (DECISIONS D15).
 */
// Before first paint: data-js (JS runs), data-reduced (reduced motion), data-intro-seen
// (the hero intro already played this session, or the URL has a hash: a deep link such as
// /en#services lands on its section with the header visible, D53; no shutters, no hidden header).
// data-fonts: the locale's brand face has loaded, or 1.1s have passed. On desktop first visits
// the hero content waits for it behind the shutters, so the font swap is not a layout shift
// (hero.css, D45). The load starts in a frame callback, once the @font-face rules are known.
const BOOT_SCRIPT = `(function(d){d.dataset.js="";try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.reduced=""}catch(e){}try{if(sessionStorage.getItem("nt-intro")||location.hash.length>1)d.dataset.introSeen=""}catch(e){}var f=function(){d.dataset.fonts=""};setTimeout(f,1100);requestAnimationFrame(function(){try{var a=d.lang==="ar";document.fonts.load("1em "+(a?"Alexandria":"Montserrat"),a?"\\u0628A1":"A1").then(f,f)}catch(e){f()}})})(document.documentElement)`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    alternates: localeAlternates(locale as AppLocale, ""),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const dir = dirOf(locale);

  return (
    // suppressHydrationWarning: BOOT_SCRIPT adds data-js / data-reduced before hydration.
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {FONT_PRELOADS[locale].map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body>
        <NextIntlClientProvider>
          <DirectionProvider direction={dir}>
            <LenisProvider>
              <SiteHeader />
              <div id="page-stage">
                {children}
                <SiteFooter />
              </div>
              <WhatsAppButton />
              <CustomCursor />
              <ToneController />
              {/* Suspense: AnchorScroll reads the search params; the pages stay static. */}
              <Suspense fallback={null}>
                <AnchorScroll />
              </Suspense>
            </LenisProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
