#!/usr/bin/env python3
"""Crop three KORDIA Signature renders down to a single product each.

The source renders are contact-sheet style: p003 carries two sofa sets, p009 a
white product strip above a lifestyle scene, p010 a set beside a tabletop
detail. The client asked for one subject per tile, so each is reframed here
rather than relying on object-fit, which would crop from the centre.

Crops keep the sheet's own 1.49 ratio so the two-column grid stays level; a
panoramic crop would be cover-cropped back to its neighbour's height anyway.
"""

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "Correspondence" / "20260806" / "extracted" / "kordia"
OUT = ROOT / "assets" / "images" / "signature"
ASPECT = 2350 / 1572          # 1.4949, the sheets' native ratio
QUALITY = 84

# (out name, source, focus_x, focus_y, zoom) — fractions of the source frame.
JOBS = [
    # Lower-left three-seat set; the upper-right set is dropped.
    ("kordia-p003c", "kf-p003-01-2350x1572.jpeg", 0.266, 0.734, 1.88),
    # Lifestyle scene only; the white product strip along the top is dropped.
    ("kordia-p009c", "kf-p009-01-2350x1572.jpeg", 0.470, 0.707, 1.71),
    # Left round dining set; the tabletop detail on the right is dropped.
    ("kordia-p010c", "kf-p010-01-2350x1572.jpeg", 0.303, 0.577, 1.68),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, src_name, fx, fy, zoom in JOBS:
        src = SRC / src_name
        if not src.exists():
            raise SystemExit(f"missing source: {src}")
        with Image.open(src) as im:
            im = im.convert("RGB")
            w, h = im.size
            cw = int(round((h * ASPECT if w / h > ASPECT else w) / zoom))
            ch = int(round(cw / ASPECT))
            left = max(0, min(int(round(fx * w - cw / 2)), w - cw))
            top = max(0, min(int(round(fy * h - ch / 2)), h - ch))
            crop = im.crop((left, top, left + cw, top + ch))

            widths = [w for w in (440, 880, 1320) if w <= crop.width]
            if crop.width not in widths and crop.width < 1320:
                widths.append(crop.width)
            for tw in widths:
                th = max(1, round(tw / ASPECT))
                out = crop.resize((tw, th), Image.LANCZOS)
                out = out.filter(ImageFilter.UnsharpMask(radius=0.6, percent=55, threshold=3))
                out.save(OUT / f"{name}-{tw}.webp", "WEBP", quality=QUALITY, method=6)
            print(f"{name:16} crop {crop.width}x{crop.height} at ({left},{top}) "
                  f"-> {'/'.join(str(x) for x in widths)}")


if __name__ == "__main__":
    main()
