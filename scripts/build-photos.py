#!/usr/bin/env python3
"""Build web variants for the client-supplied factory and installation photos.

Unlike the catalog images, these sources are 1.8-24MP, so nothing is upscaled --
every variant is a downscale and the cap logic in build-images.py is not needed.

Crops are chosen per photo rather than centre-cropped. Several are tall phone
shots where the subject sits well below centre (the scalloped parasols have
~2000px of empty sky above them), so a naive centre crop would frame the sky.
`focus` is the vertical centre of interest as a fraction of source height;
`focus_x` does the same horizontally.
"""

import os
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent.parent / "Correspondence" / "20260816"
OUT = ROOT / "assets" / "images"
QUALITY = 82

FACTORY = SRC / "factory-pic"
CLIENT = SRC / "client-pic"

# (name, source, aspect w/h, focus_y, focus_x, widths, subdir)
JOBS = [
    # ---- factory -------------------------------------------------------
    # 6000x4000 aluminium fabrication hall, workers mid-frame right.
    ("factory-floor", FACTORY / "微信图片_20260816172214_49_4.jpg",
     4 / 3, 0.50, 0.50, (700, 1400, 2100), "factory"),
    # Same shot cropped tall over the stacked frames for the material tile.
    ("material-aluminium", FACTORY / "微信图片_20260816172214_49_4.jpg",
     3 / 4, 0.55, 0.72, (440, 880), "material"),
    # 2459x1844 teak chair frames on the assembly floor — already 4:3.
    # Runs full shell width on the Factory screen, so it needs a 2100 tier.
    ("factory-teak", FACTORY / "archive" / "微信图片_20260816172215_50_4.jpg",
     4 / 3, 0.50, 0.50, (700, 1400, 2100), "factory"),
    ("material-teak", FACTORY / "archive" / "微信图片_20260816172215_50_4.jpg",
     3 / 4, 0.55, 0.45, (440, 880), "material"),
    # 2400x1800 finished teak loungers in the yard, factory shed behind.
    ("factory-yard", FACTORY / "archive" / "微信图片_20260816172217_51_4.jpg",
     4 / 3, 0.50, 0.50, (440, 880, 1320), "factory"),

    # ---- installations -------------------------------------------------
    # 2848x1600 seaside suite, native 16:9 — used as the wide feature.
    ("proj-seaside-suite", CLIENT / "微信图片_2026-08-16_172205_820.jpg",
     16 / 9, 0.50, 0.50, (960, 1600, 2200), "projects"),
    # 1170x1543 courtyard parasol over curved bench; subject below centre.
    ("proj-courtyard", CLIENT / "微信图片_2026-08-16_172244_299.jpg",
     4 / 3, 0.57, 0.50, (440, 880, 1170), "projects"),
    # 1280x1707 bistro chair over the water; chair sits in the lower third.
    ("proj-waterside", CLIENT / "微信图片_2026-08-16_172248_018.jpg",
     4 / 3, 0.62, 0.50, (440, 880, 1280), "projects"),
    # 3199x4266 scalloped parasols — ~2000px of sky above the canopies.
    ("proj-parasols", CLIENT / "微信图片_2026-08-16_172251_148.jpg",
     4 / 3, 0.62, 0.50, (440, 880, 1320), "projects"),
    # 3024x4032 rooftop cantilever parasols over rope dining.
    ("proj-rooftop", CLIENT / "微信图片_2026-08-16_172254_198.jpg",
     4 / 3, 0.47, 0.50, (440, 880, 1320), "projects"),
    # 1920x1440 lakeside terracotta rope lounge — already 4:3. Bias right to
    # drop the watering can and clutter along the left edge.
    ("proj-lakeside", CLIENT / "微信图片_2026-08-16_172257_880.jpg",
     4 / 3, 0.50, 0.58, (440, 880, 1320), "projects"),
    # 2216x2956 resort pool, loungers and parasols along the far edge.
    ("proj-resort-pool", CLIENT / "微信图片_2026-08-16_172300_920.jpg",
     4 / 3, 0.58, 0.50, (440, 880, 1320), "projects"),
]


def crop_to(im, aspect, focus_y, focus_x):
    """Largest crop of `aspect` that fits, centred on the focal point."""
    w, h = im.size
    if w / h > aspect:          # too wide -> full height, trim sides
        cw, ch = int(round(h * aspect)), h
    else:                       # too tall -> full width, trim top/bottom
        cw, ch = w, int(round(w / aspect))
    left = int(round(focus_x * w - cw / 2))
    top = int(round(focus_y * h - ch / 2))
    left = max(0, min(left, w - cw))
    top = max(0, min(top, h - ch))
    return im.crop((left, top, left + cw, top + ch))


def main():
    made, total_bytes = 0, 0
    for name, path, aspect, fy, fx, widths, subdir in JOBS:
        if not path.exists():
            raise SystemExit(f"missing source: {path}")
        dest_dir = OUT / subdir
        dest_dir.mkdir(parents=True, exist_ok=True)
        with Image.open(path) as im:
            im = im.convert("RGB")
            src_w, src_h = im.size
            cropped = crop_to(im, aspect, fy, fx)
            for w in widths:
                if w > cropped.width:
                    continue        # never upscale; sources are large enough
                h = max(1, round(w / aspect))
                out = cropped.resize((w, h), Image.LANCZOS)
                out = out.filter(ImageFilter.UnsharpMask(radius=0.6, percent=55, threshold=3))
                f = dest_dir / f"{name}-{w}.webp"
                out.save(f, "WEBP", quality=QUALITY, method=6)
                total_bytes += f.stat().st_size
                made += 1
        print(f"{name:22} {src_w}x{src_h} -> crop {cropped.width}x{cropped.height} "
              f"({'x'.join(str(x) for x in widths)})")
    print(f"\n{made} files, {total_bytes/1048576:.1f} MB")


if __name__ == "__main__":
    main()
