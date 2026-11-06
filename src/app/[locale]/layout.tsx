import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { DirectionProvider } from "@/components/providers/direction-provider";
import { dirOf, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    <html lang={locale} dir={dir} className={fontVariables}>
      <body>
        <NextIntlClientProvider>
          <DirectionProvider direction={dir}>{children}</DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
