"""Foreground cutout for a scene layer (scripts/scene-layers.mjs): writes an RGBA PNG.

    python scripts/lib/rembg-cut.py   (no -I: rembg lives in the user site) <in.png> <out.png>

Model isnet-general-use with alpha matting, so hair-thin edges (flowers, steam, glass) keep a
soft edge instead of a hard halo. The model is fetched once into ~/.u2net by rembg itself.
"""
import sys

from PIL import Image
from rembg import new_session, remove

src, dst = sys.argv[1], sys.argv[2]
session = new_session("isnet-general-use")
out = remove(
    Image.open(src).convert("RGB"),
    session=session,
    alpha_matting=True,
    alpha_matting_foreground_threshold=240,
    alpha_matting_background_threshold=12,
    alpha_matting_erode_size=8,
)
out.save(dst)
