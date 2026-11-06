"""Turn ordinary photos into the two WebP sizes the menu uses.

Usage:
    pip install pillow
    python3 scripts/menu_photos.py path/to/cod-fish.jpg [more photos...]

For each photo this writes, using the photo's file name:
    src/assets/photos/<name>.webp   about 900px wide, for cards and the item pop-up
    src/assets/thumbs/<name>.webp   144x144 square crop, for the small round images

Name the photo after the menu item's existing photo (e.g. cod-fish.jpg) to replace it,
or give it a new name and point the item at it in src/data/menu.ts with ...pic("new-name").
Phone photos are rotated the right way up automatically.
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "src/assets/photos"
THUMBS = ROOT / "src/assets/thumbs"


def convert(src: Path) -> None:
    name = src.stem.lower().replace(" ", "-")
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")

    photo = im.copy()
    photo.thumbnail((900, 1800), Image.LANCZOS)
    photo.save(PHOTOS / f"{name}.webp", quality=72, method=6)

    thumb = ImageOps.fit(im, (144, 144), Image.LANCZOS)
    thumb.save(THUMBS / f"{name}.webp", quality=70, method=6)

    kb = ((PHOTOS / f"{name}.webp").stat().st_size + (THUMBS / f"{name}.webp").stat().st_size) // 1024
    print(f"{src.name} -> {name}.webp ({photo.width}x{photo.height} + thumbnail, {kb} KB total)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for arg in sys.argv[1:]:
        convert(Path(arg))
