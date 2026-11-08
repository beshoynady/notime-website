import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { ORGANIZATION_NAME, getCategory, type CategorySlug, type Locale } from "@/content";
import { visualArabicWord } from "@/lib/arabic-shape";
import { toRoman } from "@/lib/roman";

/**
 * Category page share image (D57): espresso ground, champagne numeral, ivory title; Alexandria
 * for Arabic. Built at build time. Fonts are static TTF instances of the site's variable faces
 * (satori reads no WOFF2): regenerate them with `python scripts/og-fonts.py`.
 */
type Params = Promise<{ locale: string; category: string }>;

const SIZE = { width: 1200, height: 630 };
// Read once at module load, as in the Next docs: request-time IO is not allowed under Cache Components.
const font = (name: string) => readFile(join(process.cwd(), "assets/og-fonts", name));
const [m300, m500, a300, al300] = await Promise.all([
  font("montserrat-300.ttf"),
  font("montserrat-500.ttf"),
  font("alexandria-arabic-300.ttf"),
  font("alexandria-latin-300.ttf"),
]);

/**
 * satori has no bidi and mis-measures joined Arabic: Arabic goes in word by word, each word
 * pre-shaped in visual order (src/lib/arabic-shape.ts), in a reversed, wrapping row.
 */
function Words({ text, rtl, style }: { text: string; rtl: boolean; style: CSSProperties }) {
  if (!rtl) return <div style={{ display: "flex", ...style }}>{text}</div>;
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
      {text.split(/\s+/).map((word, i) => (
        <span key={i}>{visualArabicWord(word)}</span>
      ))}
    </div>
  );
}

export async function generateImageMetadata({ params }: { params: Params }) {
  const { locale, category } = await params;
  const c = getCategory(category as CategorySlug);
  return [{ id: "og", size: SIZE, contentType: "image/png", alt: c ? `${c.title[locale as Locale]} · ${ORGANIZATION_NAME}` : ORGANIZATION_NAME }];
}

export default async function Image({ params }: { params: Params }) {
  const { locale: l, category: slug } = await params;
  const locale = l as Locale;
  const c = getCategory(slug as CategorySlug);
  if (!c) return new Response(null, { status: 404 });
  const ar = locale === "ar";
  const face = ar ? "Alexandria" : "Montserrat";

  return new ImageResponse(
    (
      <div
        dir={ar ? "rtl" : "ltr"}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 78% 18%, rgba(234,212,171,0.14), rgba(46,32,23,0) 55%), #2E2017",
          color: "#F5E9D3",
          fontFamily: face,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: ar ? "flex-end" : "flex-start",
            fontFamily: "Montserrat",
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: 6,
            color: "#EAD4AB",
          }}
        >
          NO TIME CREATIVE HOUSE
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: ar ? "flex-end" : "flex-start" }}>
          <div style={{ display: "flex", fontFamily: "Montserrat", fontWeight: 500, fontSize: 28, letterSpacing: 4, color: "#EAD4AB" }}>
            {toRoman(c.order)}
          </div>
          <Words
            text={c.title[locale]}
            rtl={ar}
            style={{ marginTop: 24, fontWeight: 300, fontSize: ar ? 76 : 84, lineHeight: ar ? 1.35 : 1.05, letterSpacing: ar ? 0 : -1.5 }}
          />
          <Words
            text={c.summary[locale]}
            rtl={ar}
            style={{ marginTop: 28, maxWidth: 860, fontWeight: 300, fontSize: 28, lineHeight: 1.5, color: "rgba(245,233,211,0.78)" }}
          />
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Montserrat", data: m300, weight: 300, style: "normal" },
        { name: "Montserrat", data: m500, weight: 500, style: "normal" },
        { name: "Alexandria", data: a300, weight: 300, style: "normal" },
        { name: "Alexandria", data: al300, weight: 300, style: "normal" },
      ],
    },
  );
}
