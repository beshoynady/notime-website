import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFoundMetadata } from "@/components/pages/not-found-page";

// The site's 404, inside the shell (src/components/pages/not-found-page.tsx).
export { NotFoundPage as default } from "@/components/pages/not-found-page";

export async function generateMetadata(): Promise<Metadata> {
  return notFoundMetadata({ locale: await getLocale() });
}
