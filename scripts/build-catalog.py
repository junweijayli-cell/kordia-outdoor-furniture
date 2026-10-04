#!/usr/bin/env python3
"""Build the published KORDIA catalogue and 2027 image assets.

The public JavaScript file is generated from the immutable 2026 base snapshot plus
the reviewed 2027 PDF manifest. Product imagery is extracted directly from the
archived PDF and converted to sRGB without saturation, contrast, or tone changes.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
from collections import Counter
from pathlib import Path

import fitz
from PIL import Image, ImageCms, ImageOps


ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "catalog" / "base-catalog.json"
IMPORT_PATH = ROOT / "catalog" / "kordia-2027.json"
OUTPUT_PATH = ROOT / "assets" / "catalog-data.js"
IMAGE_DIR = ROOT / "assets" / "images" / "catalog-2027"
PRODUCT_WIDTHS = (400, 800)
SERIES_WIDTHS = (440, 880, 1196)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def slug_filename(product_id: str) -> str:
    return product_id.lower().replace("_", "-")


def image_to_srgb(raw: bytes) -> Image.Image:
    image = ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
    icc = image.info.get("icc_profile")
    if icc:
        try:
            source_profile = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            target_profile = ImageCms.createProfile("sRGB")
            image = ImageCms.profileToProfile(image, source_profile, target_profile, outputMode="RGB")
        except (ImageCms.PyCMSError, OSError):
            image = image.convert("RGB")
    else:
        image = image.convert("RGB")
    return image


def image_has_black_edge(image: Image.Image) -> bool:
    gray = image.convert("L")
    width, height = gray.size
    edges = [
        [gray.getpixel((x, 0)) for x in range(width)],
        [gray.getpixel((x, height - 1)) for x in range(width)],
        [gray.getpixel((0, y)) for y in range(height)],
        [gray.getpixel((width - 1, y)) for y in range(height)],
    ]
    return any(sum(value < 12 for value in edge) / len(edge) > 0.92 for edge in edges)


def save_variants(image: Image.Image, base: str, widths: tuple[int, ...]) -> list[dict]:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    source_width, source_height = image.size
    variants = []
    for width in widths:
        height = max(1, round(source_height * width / source_width))
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        filename = f"{base}-{width}.webp"
        output = IMAGE_DIR / filename
        resized.save(output, "WEBP", quality=90, method=6, icc_profile=None, exif=b"")
        variants.append({
            "w": width,
            "h": height,
            "src": f"assets/images/catalog-2027/{filename}",
        })
    return variants


def extract_image(document: fitz.Document, page_number: int, xref: int) -> tuple[Image.Image, int, int]:
    page_images = {item[0]: item for item in document[page_number - 1].get_images(full=True)}
    if xref not in page_images:
        raise ValueError(f"xref {xref} is not present on PDF page {page_number}")
    source = document.extract_image(xref)
    soft_mask = page_images[xref][1]
    if soft_mask:
        base_pixmap = fitz.Pixmap(document, xref)
        mask_pixmap = fitz.Pixmap(document, soft_mask)
        rgba_pixmap = fitz.Pixmap(base_pixmap, mask_pixmap)
        transparent = Image.open(io.BytesIO(rgba_pixmap.tobytes("png"))).convert("RGBA")
        background = Image.new("RGBA", transparent.size, "#FFFFFF")
        background.alpha_composite(transparent)
        image = background.convert("RGB")
    else:
        image = image_to_srgb(source["image"])
    if image.width < 250 or image.height < 180:
        raise ValueError(f"xref {xref} on page {page_number} is unexpectedly small: {image.size}")
    if image_has_black_edge(image):
        raise ValueError(f"xref {xref} on page {page_number} contains a near-solid black edge")
    return image, source["width"], source["height"]


def merge_unique(values: list[list[str]]) -> list[str]:
    result = []
    for group in values:
        for value in group:
            if value not in result:
                result.append(value)
    return result


def build_catalog(write_images: bool = True) -> dict:
    catalog = read_json(BASE_PATH)
    imported = read_json(IMPORT_PATH)
    source = imported["source"]
    pdf_path = (ROOT / source["archivedPdf"]).resolve()

    if not pdf_path.exists():
        raise FileNotFoundError(f"Archived source PDF is missing: {pdf_path}")
    actual_hash = sha256(pdf_path)
    if actual_hash != source["sha256"]:
        raise ValueError(f"Source PDF checksum mismatch: {actual_hash}")

    if len(imported["products"]) != source["canonicalProductCount"]:
        raise ValueError("Canonical 2027 product count does not match the manifest source record")
    if len(imported["series"]) != 8:
        raise ValueError("Expected exactly eight 2027 series")

    document = fitz.open(pdf_path)
    if len(document) != source["pdfPages"]:
        raise ValueError(f"Expected {source['pdfPages']} PDF pages, found {len(document)}")

    series_by_slug = {series["slug"]: series for series in imported["series"]}
    if len(series_by_slug) != len(imported["series"]):
        raise ValueError("Series slugs must be unique")

    published_series = []
    for series in imported["series"]:
        cover = series["cover"]
        image, source_width, source_height = extract_image(
            document, cover["sourcePdfPage"], cover["xref"]
        )
        base = f"series-{series['slug']}"
        variants = save_variants(image, base, SERIES_WIDTHS) if write_images else [
            {
                "w": width,
                "h": max(1, round(source_height * width / source_width)),
                "src": f"assets/images/catalog-2027/{base}-{width}.webp",
            }
            for width in SERIES_WIDTHS
        ]
        published_series.append({
            "slug": series["slug"],
            "name": series["name"],
            "catalogEdition": "2027",
            "patentCodes": series["patentCodes"],
            "materials": series["materials"],
            "sourcePdfPage": cover["sourcePdfPage"],
            "focalPoint": cover["focalPoint"],
            "image": variants[-1]["src"],
            "width": variants[-1]["w"],
            "height": variants[-1]["h"],
            "sourceWidth": source_width,
            "sourceHeight": source_height,
            "variants": variants,
        })

    new_subcategories = imported["subcategories"]
    existing_sub_slugs = {item["slug"] for item in catalog["subcategories"]}
    for subcategory in new_subcategories:
        if subcategory["slug"] in existing_sub_slugs:
            raise ValueError(f"New subcategory already exists: {subcategory['slug']}")
        catalog["subcategories"].append({**subcategory, "photoCount": 0})

    collection_names = {item["slug"]: item["name"] for item in catalog["collections"]}
    subcategory_names = {item["slug"]: item["name"] for item in catalog["subcategories"]}
    max_position = max(item.get("position", 0) for item in catalog["products"])
    new_products = []
    supplier_code_usage: Counter[str] = Counter()

    for offset, record in enumerate(imported["products"], start=1):
        for slug in record["seriesSlugs"]:
            if slug not in series_by_slug:
                raise ValueError(f"Unknown series {slug} for {record['id']}")
        for code in record["supplierCodes"]:
            supplier_code_usage[code] += 1

        source_image, source_width, source_height = extract_image(
            document, record["sourcePdfPage"], record["xref"]
        )
        base = slug_filename(record["id"])
        variants = save_variants(source_image, base, PRODUCT_WIDTHS) if write_images else [
            {
                "w": width,
                "h": max(1, round(source_height * width / source_width)),
                "src": f"assets/images/catalog-2027/{base}-{width}.webp",
            }
            for width in PRODUCT_WIDTHS
        ]

        series_defs = [series_by_slug[slug] for slug in record["seriesSlugs"]]
        materials = {
            "frame": merge_unique([item["materials"].get("frame", []) for item in series_defs]),
            "ropeWicker": merge_unique([item["materials"].get("ropeWicker", []) for item in series_defs]),
            "ropeGauge": " / ".join(merge_unique([[item["materials"].get("ropeGauge", "")] for item in series_defs if item["materials"].get("ropeGauge")])),
            "fabric": merge_unique([item["materials"].get("fabric", []) for item in series_defs]),
            "tableTop": merge_unique([item["materials"].get("tableTop", []) for item in series_defs]),
        }
        patents = merge_unique([item["patentCodes"] for item in series_defs])
        series_names = [item["name"] for item in series_defs]

        product = {
            "id": record["id"],
            "ref": " / ".join(record["supplierCodes"]),
            "catalogPage": f"2027-{record['printedPage']}",
            "catalogEdition": "2027",
            "sourcePdfPage": record["sourcePdfPage"],
            "sourcePdfPages": record.get("sourcePdfPages", [record["sourcePdfPage"]]),
            "sourcePdfTitle": source["title"],
            "item": offset,
            "collection": record["collection"],
            "subcategory": record["subcategory"],
            "name": record["name"],
            "collectionName": collection_names[record["collection"]],
            "subcategoryName": subcategory_names[record["subcategory"]],
            "series": record["seriesSlugs"][0],
            "seriesSlugs": record["seriesSlugs"],
            "seriesNames": series_names,
            "supplierCodes": record["supplierCodes"],
            "patentCodes": patents,
            "materials": materials,
            "image": variants[-1]["src"],
            "width": variants[-1]["w"],
            "height": variants[-1]["h"],
            "sourceWidth": source_width,
            "sourceHeight": source_height,
            "variants": variants,
            "imageFit": "contain",
            "focalPoint": "50% 50%",
            "position": max_position + offset,
            "model": " / ".join(record["supplierCodes"]),
            "specSourcePage": record["sourcePdfPage"],
            "dimensions": [
                {**dimension, "labelZh": record["name"]["zh"]}
                for dimension in record["dimensions"]
            ],
            "setting": record["setting"],
            "style": "natural-teak-rope",
            "imageStatus": "SOURCE - extracted from KORDIA 2027 PDF; sRGB conversion only; no colour adjustment"
        }
        if record.get("codeStatus"):
            product["codeStatus"] = record["codeStatus"]
            product["codeNote"] = record["codeNote"]
        new_products.append(product)

    duplicate_codes = {code: count for code, count in supplier_code_usage.items() if count > 1}
    if duplicate_codes != {"0009501": 2}:
        raise ValueError(f"Unexpected duplicate supplier codes: {duplicate_codes}")

    existing_ids = {item["id"] for item in catalog["products"]}
    new_ids = [item["id"] for item in new_products]
    if len(new_ids) != len(set(new_ids)) or existing_ids.intersection(new_ids):
        raise ValueError("Product IDs must be unique across the complete catalogue")

    catalog["products"].extend(new_products)
    catalog["total"] = len(catalog["products"])
    collection_counts = Counter(item["collection"] for item in catalog["products"])
    subcategory_counts = Counter(item["subcategory"] for item in catalog["products"])
    for collection in catalog["collections"]:
        collection["photoCount"] = collection_counts[collection["slug"]]
    for subcategory in catalog["subcategories"]:
        subcategory["photoCount"] = subcategory_counts[subcategory["slug"]]

    catalog["series"] = published_series
    catalog["editions"] = ["2026", "2027"]
    catalog["version"] = "V5-20271004"
    catalog["sources"] = [
        {"edition": "2026", "description": catalog.get("specSource", "2026 catalogue")},
        {
            "edition": "2027",
            "description": source["title"],
            "sha256": source["sha256"],
            "pdfPages": source["pdfPages"],
            "picturedRecords": source["picturedRecordCount"],
            "canonicalProducts": source["canonicalProductCount"],
        },
    ]
    catalog["sourceReview"] = {
        "status": "reviewed",
        "knownSupplierCodeCollision": {
            "supplierCode": "0009501",
            "productIds": [
                "KD-27-FREE-FORM-0009501-STOOL",
                "KD-27-FREE-FORM-0009501-CART",
            ],
            "action": "Verify both codes with the supplier before order confirmation",
        },
    }

    if catalog["total"] != 402:
        raise ValueError(f"Expected 402 total products, found {catalog['total']}")
    if len(catalog["subcategories"]) != 24:
        raise ValueError(f"Expected 24 subcategories, found {len(catalog['subcategories'])}")
    return catalog


def serialize(catalog: dict) -> str:
    payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
    return f"window.KORDIA_CATALOG = {payload};\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Validate inputs and generated output without writing")
    args = parser.parse_args()

    catalog = build_catalog(write_images=not args.check)
    output = serialize(catalog)
    if args.check:
        if not OUTPUT_PATH.exists() or OUTPUT_PATH.read_text(encoding="utf-8") != output:
            raise SystemExit("assets/catalog-data.js is not up to date; run scripts/build-catalog.py")
        missing = [
            variant["src"]
            for product in catalog["products"]
            for variant in product.get("variants", [])
            if not (ROOT / variant["src"]).exists()
        ]
        if missing:
            raise SystemExit(f"Missing generated images: {missing[:5]}")
        print(f"OK: {catalog['total']} products, {len(catalog['subcategories'])} subcategories, {len(catalog['series'])} 2027 series")
        return

    OUTPUT_PATH.write_text(output, encoding="utf-8")
    print(f"Built {catalog['total']} products and {len(catalog['series'])} series into {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
