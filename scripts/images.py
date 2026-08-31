#!/usr/bin/env python3
"""Resize every raster in `public` and write the table the components read.

Run after adding or replacing a photo:

    python3 scripts/images.py

The source files are 1600px wide, which is the width a desktop hero needs and
roughly four times what a phone does. Each one is resized to the widths
in `PHOTO_WIDTHS` (or `LOGO_WIDTHS`) and written beside the original as `<name>-<width>.webp`, and
the table in `src/lib/images.js` is rewritten from what is on disk, so a photo
with no variants cannot be referenced as though it had them.
"""

from __future__ import annotations

import pathlib
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover - the failure is the message
    sys.exit("Pillow is required: python3 -m pip install Pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
TABLE = ROOT / "src" / "lib" / "images.js"
PHOTO_WIDTHS = (800, 1200)
LOGO_WIDTHS = (320, 640)
ALL_WIDTHS = PHOTO_WIDTHS + LOGO_WIDTHS
QUALITY = {"photo": 76, "logo": 88}

HEADER = '''/*
 * Every raster the site serves, with the box it occupies and the widths it
 * is offered at.
 *
 * The browser picks a file before layout runs, so the choice is made from
 * `srcset` and `sizes` and from nothing else. A single 1600px file means a
 * 390 point phone downloads the desktop image; the intrinsic dimensions in
 * the same record are what hold the box while it arrives.
 *
 * `scripts/images.py` writes the variants and this table together, so a
 * photo added to `public/brand` without a run of that script is a photo with
 * no small file behind it.
 */
const SOURCES = {
'''

FOOTER = '''}

/**
 * The intrinsic box of a source, so an `img` can declare it and hold its space.
 *
 * @param {string} src - a site-absolute path under `public`
 * @returns {{ width: number, height: number } | undefined}
 */
export function imageBox(src) {
  return SOURCES[src]
}

/**
 * A `srcset` offering every variant that is smaller than the original, plus the
 * original itself at its own width.
 *
 * @param {string} src - a site-absolute path under `public`
 * @returns {string | undefined} undefined when the source has no variants, which
 *   leaves the `img` with its single `src` rather than a broken candidate list
 */
export function imageSrcSet(src) {
  const source = SOURCES[src]
  if (!source) return undefined
  const stem = src.replace(/\\.webp$/, '')
  const candidates = source.variants.map(width => `${stem}-${width}.webp ${width}w`)
  if (!candidates.length) return undefined
  return [...candidates, `${src} ${source.width}w`].join(', ')
}
'''


def is_variant(path: pathlib.Path) -> bool:
    return any(path.stem.endswith(f"-{width}") for width in ALL_WIDTHS)


def originals() -> list[pathlib.Path]:
    found = [p for p in sorted(PUBLIC.glob("brand/*.webp")) if not is_variant(p)]
    logo = PUBLIC / "deluxfit-logo.webp"
    if logo.exists():
        found.append(logo)
    return found


def main() -> int:
    records = []
    for path in originals():
        image = Image.open(path)
        kind = "logo" if "logo" in path.stem else "photo"
        widths = LOGO_WIDTHS if kind == "logo" else PHOTO_WIDTHS
        emitted = []
        for width in widths:
            if image.width <= width:
                continue
            height = round(image.height * width / image.width)
            out = path.with_name(f"{path.stem}-{width}.webp")
            image.resize((width, height), Image.LANCZOS).save(
                out, "WEBP", quality=QUALITY[kind], method=6
            )
            emitted.append(width)
        records.append(
            ("/" + path.relative_to(PUBLIC).as_posix(), image.width, image.height, emitted)
        )

    body = "".join(
        f"  '{src}': {{ width: {width}, height: {height}, variants: {variants} }},\n"
        for src, width, height, variants in records
    )
    TABLE.write_text(HEADER + body + FOOTER)
    print(f"{len(records)} source(s) resized; wrote {TABLE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
