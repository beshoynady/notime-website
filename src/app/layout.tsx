import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Temporary root layout: replaced by src/app/[locale]/layout.tsx in Task 2.
export const metadata: Metadata = {
  title: "NO TIME Creative House",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
