"""
Static TTF instances of the site's variable WOFF2 faces, for the Open Graph images.

next/og (satori) reads TTF/OTF/WOFF only, not WOFF2, and renders variable fonts at their
default instance. This pins each weight the OG images use and writes plain TTFs to
assets/og-fonts/ (read at build time only; never shipped to the browser).

satori also has no bidi and measures text before shaping it, so the OG images pass Arabic
pre-shaped as presentation forms (src/lib/arabic-shape.ts). Alexandria maps the final, initial
and medial forms but not the isolated ones (U+FE80, U+FE8D ...); for those, the Arabic font
gets cmap entries pointing at the base letter's glyph, which is the isolated shape.

Needs fontTools and brotli (pip install --user fonttools brotli; DECISIONS D59).
Run from the repo root:  python scripts/og-fonts.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "fonts"
OUT = ROOT / "assets" / "og-fonts"

# (source woff2, weight, output name)
INSTANCES = [
    ("montserrat-latin.v1.woff2", 300, "montserrat-300.ttf"),
    ("montserrat-latin.v1.woff2", 500, "montserrat-500.ttf"),
    ("alexandria-arabic.v1.woff2", 300, "alexandria-arabic-300.ttf"),
    ("alexandria-latin.v1.woff2", 300, "alexandria-latin-300.ttf"),
]


# Isolated presentation form -> base letter (the glyph Alexandria draws for it).
ISOLATED = {
    0xFE80: 0x0621, 0xFE81: 0x0622, 0xFE83: 0x0623, 0xFE85: 0x0624, 0xFE87: 0x0625,
    0xFE89: 0x0626, 0xFE8D: 0x0627, 0xFE8F: 0x0628, 0xFE93: 0x0629, 0xFE95: 0x062A,
    0xFE99: 0x062B, 0xFE9D: 0x062C, 0xFEA1: 0x062D, 0xFEA5: 0x062E, 0xFEA9: 0x062F,
    0xFEAB: 0x0630, 0xFEAD: 0x0631, 0xFEAF: 0x0632, 0xFEB1: 0x0633, 0xFEB5: 0x0634,
    0xFEB9: 0x0635, 0xFEBD: 0x0636, 0xFEC1: 0x0637, 0xFEC5: 0x0638, 0xFEC9: 0x0639,
    0xFECD: 0x063A, 0xFED1: 0x0641, 0xFED5: 0x0642, 0xFED9: 0x0643, 0xFEDD: 0x0644,
    0xFEE1: 0x0645, 0xFEE5: 0x0646, 0xFEE9: 0x0647, 0xFEED: 0x0648, 0xFEEF: 0x0649,
    0xFEF1: 0x064A,
}


def map_isolated_forms(font: TTFont) -> None:
    for table in font["cmap"].tables:
        if not table.isUnicode():
            continue
        for form, base in ISOLATED.items():
            if form not in table.cmap and base in table.cmap:
                table.cmap[form] = table.cmap[base]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src, weight, name in INSTANCES:
        font = TTFont(SRC / src)
        static = instantiateVariableFont(font, {"wght": weight}) if "fvar" in font else font
        static.flavor = None  # plain TTF
        if "arabic" in src:
            map_isolated_forms(static)
        static.save(OUT / name)
        print(f"{name}: {(OUT / name).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
