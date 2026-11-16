import { SiteShell } from "@/components/layout/site-shell";

/**
 * Every page but /links, in the site's shell (src/components/layout/site-shell.tsx). The
 * document, fonts, translations and the lead source stay in [locale]/layout.tsx, so /links can do
 * without the shell's script (decision #36). A route group: no URL changes.
 */
export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  return <SiteShell>{children}</SiteShell>;
}
