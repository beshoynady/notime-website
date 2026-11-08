# OG image fonts

Static TTF instances of the site's variable faces, read at build time by
`src/app/[locale]/services/[category]/opengraph-image.tsx` (satori reads no WOFF2). Never served
to the browser. Regenerate with `python scripts/og-fonts.py` (DECISIONS D60).

- Montserrat (300, 500) and Alexandria (300), both under the SIL Open Font License 1.1, from
  the WOFF2 files in `public/fonts/`.
- The Arabic file adds cmap entries for the isolated Arabic presentation forms, pointing at the
  base letters' glyphs (see the script).
