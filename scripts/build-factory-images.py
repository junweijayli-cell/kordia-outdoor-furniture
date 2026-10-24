#!/usr/bin/env python3
"""Export the reviewed factory photos, preserving colour and avoiding upscaling.

Usage: python scripts/build-factory-images.py [source-folder] [--check]
"""
import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / 'drive-download-20261024T021118Z-1-001'
UPSCALED = 'drive-download-20261024T022254Z-1-001'
OUTPUT = ROOT / 'assets/images/factory-intro'
WIDTHS = (480, 960, 1600, 2400)
# Output name, source, aspect ratio, vertical focal point.
JOBS = [
    ('factory-overview', 'f19e3cf88a84f6ebaf84d8e643752b35.jpg', 3 / 2, .50),
    ('wood-workshop', f'{UPSCALED}/21 Topaz Gigapixel 2x scale.jpg', 3 / 2, .57),
    ('wood-workshop-detail', f'{UPSCALED}/22 Topaz Gigapixel 2x scale.jpg', 2.7, .65),
    ('teak-loungers', f'{UPSCALED}/29 Topaz Gigapixel 2x scale.jpg', 3 / 2, .57),
    ('chair-frames', f'{UPSCALED}/28 Topaz Gigapixel 2x scale.jpg', 2.7, .57),
    ('frame-production', '210d174fbefacc7ece5e9526ebcf24e6.jpg', 3 / 2, .53),
    ('seating-stock', f'{UPSCALED}/25 Topaz Gigapixel 2x scale.jpg', 2.7, .58),
    ('production-floor', 'f19e3cf88a84f6ebaf84d8e643752b35.jpg', 4 / 3, .53),
    ('aluminium-stock', '59382e654dc808e6ca5645985affd2d3.jpg', 4 / 3, .57),
    ('showroom', '53d981bad47926415120ecc303191a65.jpg', 4 / 3, .57),
    ('fabrication-equipment', f'{UPSCALED}/23 Topaz Gigapixel 2x scale.jpg', 4 / 3, .53),
]


def crop(image, aspect, focus_y):
    width, height = image.size
    crop_width = min(width, round(height * aspect))
    crop_height = min(height, round(crop_width / aspect))
    left = (width - crop_width) // 2
    top = max(0, min(height - crop_height, round(height * focus_y - crop_height / 2)))
    return image.crop((left, top, left + crop_width, top + crop_height))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    records = []
    for name, filename, aspect, focus_y in JOBS:
        path = args.source / filename
        raw = path.read_bytes()
        with Image.open(io.BytesIO(raw)) as source:
            source = ImageOps.exif_transpose(source)
            native_size = source.size
            profile = source.info.get('icc_profile')
            image = (ImageCms.profileToProfile(source, ImageCms.ImageCmsProfile(io.BytesIO(profile)),
                     ImageCms.createProfile('sRGB'), outputMode='RGB') if profile else source.convert('RGB'))
            image = crop(image, aspect, focus_y)
            variants = []
            for width in WIDTHS:
                if width > image.width:
                    continue
                size = (width, round(width / aspect))
                output = OUTPUT / f'{name}-{width}.webp'
                if args.check:
                    with Image.open(output) as actual:
                        if actual.size != size:
                            raise ValueError(f'Incorrect image dimensions: {output}')
                        actual.verify()
                else:
                    OUTPUT.mkdir(parents=True, exist_ok=True)
                    image.resize(size, Image.Resampling.LANCZOS).save(
                        output, 'WEBP', quality=90, method=6, icc_profile=None, exif=b'')
                variants.append({'src':output.relative_to(ROOT).as_posix(), 'w':size[0], 'h':size[1]})
            records.append({'name':name, 'sourceFile':filename, 'sourceSha256':hashlib.sha256(raw).hexdigest(),
                            'sourceWidth':native_size[0], 'sourceHeight':native_size[1],
                            'cropAspect':aspect, 'focusY':focus_y, 'variants':variants})
    manifest = {'received':'2026-10-24', 'colour':'sRGB; no enhancement or additional AI processing', 'images':records}
    manifest_path = ROOT / 'catalog/factory-images.json'
    if args.check:
        if json.loads(manifest_path.read_text(encoding='utf-8')) != manifest:
            raise ValueError('Factory image manifest is out of date')
    else:
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"{'Checked' if args.check else 'Built'} {sum(len(r['variants']) for r in records)} variants from {len(records)} factory photographs")


if __name__ == '__main__':
    main()
