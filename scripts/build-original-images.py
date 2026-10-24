#!/usr/bin/env python3
"""Export reviewed client photographs without cropping, enhancement or upscaling.

Usage: python scripts/build-original-images.py /path/to/维妮美图片
The committed manifest records the reviewed photo-to-product mapping and checksums.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'catalog' / 'original-images.json'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    made = 0
    for record in manifest['products']:
        path = args.source / record['sourceFile']
        raw = path.read_bytes()
        if hashlib.sha256(raw).hexdigest() != record['sha256']:
            raise ValueError(f'Source checksum mismatch: {path.name}')
        with Image.open(io.BytesIO(raw)) as source:
            image = ImageOps.exif_transpose(source)
            if image.size != (record['sourceWidth'], record['sourceHeight']):
                raise ValueError(f'Source dimensions changed: {path.name}')
            profile = image.info.get('icc_profile')
            if profile:
                image = ImageCms.profileToProfile(
                    image, ImageCms.ImageCmsProfile(io.BytesIO(profile)),
                    ImageCms.createProfile('sRGB'), outputMode='RGB')
            else:
                image = image.convert('RGB')
            for variant in record['variants']:
                if variant['w'] > image.width:
                    raise ValueError(f'Upscaling is prohibited: {path.name}')
                output = ROOT / variant['src']
                size = (variant['w'], variant['h'])
                if args.check:
                    with Image.open(output) as actual:
                        if actual.size != size:
                            raise ValueError(f'Wrong output dimensions: {output}')
                else:
                    output.parent.mkdir(parents=True, exist_ok=True)
                    image.resize(size, Image.Resampling.LANCZOS).save(
                        output, 'WEBP', quality=92, method=6, icc_profile=None, exif=b'')
                made += 1
    print(f"{'Checked' if args.check else 'Built'} {made} variants for {len(manifest['products'])} original photographs")


if __name__ == '__main__':
    main()
