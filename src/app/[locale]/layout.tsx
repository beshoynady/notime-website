import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { DirectionProvider } from "@/components/providers/direction-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { ToneController } from "@/components/providers/tone-controller";
import { dirOf, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Runs before first paint: marks JS as available and records reduced motion, so
 * intro-only states (shutters, hidden chars) apply only when they can be animated
 * away. Without JS the page renders complete and static (DECISIONS D15).
 */
const BOOT_SCRIPT = `(function(d){d.dataset.js="";try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.reduced=""}catch(e){}})(document.documentElement)`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const dir = dirOf(locale);

  return (
    // suppressHydrationWarning: BOOT_SCRIPT adds data-js / data-reduced before hydration.
    <html lang={locale} dir={dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <DirectionProvider direction={dir}>
            <LenisProvider>
              <SiteHeader />
              <div id="stage">
                {children}
                <SiteFooter />
              </div>
              <WhatsAppButton />
              <CustomCursor />
              <ToneController />
            </LenisProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
