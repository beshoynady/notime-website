import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { ORGANIZATION_NAME, type Locale } from "@/content";
import { visualArabicWord } from "@/lib/arabic-shape";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

/**
 * The site's share image (D57, D103): espresso ground, a champagne kicker, an ivory title and a
 * short line; Alexandria for Arabic. Every `opengraph-image.tsx` renders through here, at build
 * time. Fonts are static TTF instances of the site's variable faces (satori reads no WOFF2):
 * regenerate them with `python scripts/og-fonts.py`.
 */
export const OG_SIZE = { width: 1200, height: 630 };

// Read once at module load, as in the Next docs: request-time IO is not allowed under Cache Components.
const font = (name: string) => readFile(join(process.cwd(), "assets/og-fonts", name));
const [m300, m500, a300, al300] = await Promise.all([
  font("montserrat-300.ttf"),
  font("montserrat-500.ttf"),
  font("alexandria-arabic-300.ttf"),
  font("alexandria-latin-300.ttf"),
]);

/**
 * A message by its dotted key. Share images read the files directly: next-intl's getTranslations
 * reaches for the root params, which `generateImageMetadata` doesn't have at build time.
 */
export function ogText(locale: string, key: string): string {
  const v = key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], locale === "ar" ? ar : en);
  if (typeof v !== "string") throw new Error(`og-image: no message "${key}"`);
  return v;
}

/** The image's metadata entry: one PNG, its alt the page's title and the house name. */
export const ogMeta = (title?: string) => [{ id: "og", size: OG_SIZE, contentType: "image/png", alt: title ? `${title} · ${ORGANIZATION_NAME}` : ORGANIZATION_NAME }];

/** Keeps a share line to about three lines on the image: cut at a word, with an ellipsis. */
export function clipLine(text: string, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,،.:;؛]+$/, "")}…`;
}

/**
 * satori has no bidi and mis-measures joined Arabic: Arabic goes in word by word, each word
 * pre-shaped in visual order (src/lib/arabic-shape.ts), in a reversed, wrapping row. A Latin
 * word (QR, a product name) keeps its letters in order; its trailing punctuation moves to its
 * visual left, where the sentence reads it.
 */
const ARABIC = /[ؠ-يٱ-ۓ]/; // letters only, so "QR،" stays Latin

export function visualWord(word: string) {
  if (ARABIC.test(word)) return visualArabicWord(word);
  const m = /^(.*?)([.,:;!?،؛]+)$/.exec(word);
  return m ? `${m[2]}${m[1]}` : word;
}

function Words({ text, rtl, style }: { text: string; rtl: boolean; style: CSSProperties }) {
  if (!rtl) return <div style={{ display: "flex", ...style }}>{text}</div>;
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
      {text.split(/\s+/).map((word, i) => (
        <span key={i}>{visualWord(word)}</span>
      ))}
    </div>
  );
}

export function ogImage({ locale, kicker, title, summary }: { locale: Locale; kicker?: string; title: string; summary?: string }) {
  const ar = locale === "ar";
  const long = title.length > 34;
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
          fontFamily: ar ? "Alexandria" : "Montserrat",
        }}
      >
        <div style={{ display: "flex", justifyContent: ar ? "flex-end" : "flex-start", fontFamily: "Montserrat", fontWeight: 500, fontSize: 20, letterSpacing: 6, color: "#EAD4AB" }}>
          NO TIME CREATIVE HOUSE
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: ar ? "flex-end" : "flex-start" }}>
          {kicker && (
            <Words text={kicker} rtl={ar && ARABIC.test(kicker)} style={{ fontFamily: ar && ARABIC.test(kicker) ? "Alexandria" : "Montserrat", fontWeight: 500, fontSize: 28, letterSpacing: ar ? 0 : 4, color: "#EAD4AB", marginBottom: 24 }} />
          )}
          <Words
            text={title}
            rtl={ar}
            style={{ maxWidth: 1040, fontWeight: 300, fontSize: long ? (ar ? 60 : 64) : ar ? 76 : 84, lineHeight: ar ? 1.35 : 1.05, letterSpacing: ar ? 0 : -1.5 }}
          />
          {summary && (
            <Words text={clipLine(summary)} rtl={ar} style={{ marginTop: 28, maxWidth: 900, fontWeight: 300, fontSize: 28, lineHeight: 1.5, color: "rgba(245,233,211,0.78)" }} />
          )}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Montserrat", data: m300, weight: 300, style: "normal" },
        { name: "Montserrat", data: m500, weight: 500, style: "normal" },
        { name: "Alexandria", data: a300, weight: 300, style: "normal" },
        { name: "Alexandria", data: al300, weight: 300, style: "normal" },
      ],
    },
  );
}
