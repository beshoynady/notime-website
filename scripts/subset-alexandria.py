"""Subset Alexandria's Arabic file to the characters Arabic copy can use (Task 16).

    python scripts/subset-alexandria.py

The Google "arabic" file also carries Arabic Supplement, Extended-A/B, the presentation forms and
the math alphabet; Gulf Arabic copy needs none of them (shaping goes through the font's GSUB
from the base letters, which the subsetter keeps). Kept: the Arabic block (letters, harakat,
Arabic-Indic digits, punctuation), the joiners and direction marks, hyphens, the ornate
parentheses. Every OpenType feature and the variable weight axis stay. Writes a new versioned
file (/fonts/* is cached as immutable): update fonts.css and src/lib/fonts.ts to match.
"""
from fontTools import subset
from fontTools.ttLib import TTFont

SRC = "public/fonts/alexandria-arabic.v1.woff2"
OUT = "public/fonts/alexandria-arabic.v2.woff2"
UNICODES = "U+0600-06FF,U+200C-200F,U+2010-2011,U+FD3E-FD3F"

opts = subset.Options()
opts.layout_features = ["*"]
opts.flavor = "woff2"
opts.name_IDs = ["*"]
opts.notdef_outline = True
opts.hinting = True
font = TTFont(SRC)
sub = subset.Subsetter(opts)
sub.populate(unicodes=subset.parse_unicodes(UNICODES))
sub.subset(font)
font.flavor = "woff2"
font.save(OUT)
print(OUT)
