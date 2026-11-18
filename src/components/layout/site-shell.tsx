import { NextIntlClientProvider } from "next-intl";
import { Suspense, type ReactNode } from "react";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { AnchorScroll } from "@/components/providers/anchor-scroll";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { ToneController } from "@/components/providers/tone-controller";

/**
 * The site's shell: header, footer, smooth scroll (Lenis), the tone controller, the cursor, the
 * WhatsApp button and anchor landings, for every page but /links (app/[locale]/(site)/layout.tsx,
 * decision #36). Its translation provider sends the messages to the client components.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider>
      <LenisProvider>
        <SiteHeader />
        <div id="page-stage">
          {children}
          <SiteFooter />
        </div>
        <MobileCtaBar />
        <WhatsAppButton />
        <CustomCursor />
        <ToneController />
        {/* Suspense: AnchorScroll reads the search params; the pages stay static. */}
        <Suspense fallback={null}>
          <AnchorScroll />
        </Suspense>
      </LenisProvider>
    </NextIntlClientProvider>
  );
}
