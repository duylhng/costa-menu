"""Generate menu photos with OpenAI's image API, using the prompts in docs/photo-prompts.md.

Usage:
    export OPENAI_API_KEY=sk-...           # an OpenAI API key (platform.openai.com), not ChatGPT
    python3 scripts/generate_photos.py --from "Onion Rings"
    python3 scripts/generate_photos.py --only "Chiko Roll" "Spring Roll"
    python3 scripts/generate_photos.py --list

Each image is saved as incoming-photos/<file-name>.png (the name the prompts page gives).
Existing files are skipped unless you pass --overwrite, so a run can be resumed.
Review the images, then convert the good ones with scripts/menu_photos.py.

Options: --quality low|medium|high (default high), --model (default gpt-image-1).
Uses only the Python standard library.
"""
import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROMPTS = ROOT / "docs/photo-prompts.md"
OUT = ROOT / "incoming-photos"
API = "https://api.openai.com/v1/images/generations"


def load_prompts():
    """Return [(item name, file name, prompt)] in the order they appear on the prompts page."""
    text = PROMPTS.read_text()
    pattern = re.compile(r"^### (.+?)\n\nSave as \*\*`([a-z0-9-]+)\.png`\*\*.*?```text\n(.+?)\n```", re.S | re.M)
    return [(m.group(1).strip(), m.group(2), m.group(3).strip()) for m in pattern.finditer(text)]


def generate(prompt, model, quality, key):
    body = json.dumps({"model": model, "prompt": prompt, "size": "1536x1024", "quality": quality, "n": 1}).encode()
    req = urllib.request.Request(API, data=body, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300) as res:
                data = json.load(res)["data"][0]
            if "b64_json" in data:
                return base64.b64decode(data["b64_json"])
            with urllib.request.urlopen(data["url"], timeout=120) as res:
                return res.read()
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                wait = 10 * (attempt + 1)
                print(f"    {e.code}, retrying in {wait}s: {detail}")
                time.sleep(wait)
                continue
            raise SystemExit(f"OpenAI API error {e.code}: {detail}")
    raise SystemExit("Gave up after repeated errors.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--from", dest="start", help="start at this item name (inclusive) and do the rest")
    ap.add_argument("--only", nargs="+", help="only these item names")
    ap.add_argument("--list", action="store_true", help="list items and file names, then stop")
    ap.add_argument("--quality", default="high", choices=["low", "medium", "high"])
    ap.add_argument("--model", default=os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1"))
    ap.add_argument("--overwrite", action="store_true")
    args = ap.parse_args()

    items = load_prompts()
    if args.list:
        for name, file, _ in items:
            print(f"{name:32} {file}.png")
        return
    names = [n.lower() for n, _, _ in items]
    if args.start:
        if args.start.lower() not in names:
            sys.exit(f"No item called {args.start!r}. Use --list to see the names.")
        items = items[names.index(args.start.lower()):]
    if args.only:
        wanted = {n.lower() for n in args.only}
        missing = wanted - set(names)
        if missing:
            sys.exit(f"Unknown item(s): {', '.join(sorted(missing))}. Use --list to see the names.")
        items = [i for i in items if i[0].lower() in wanted]

    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        sys.exit("Set OPENAI_API_KEY first (see the top of this file).")

    OUT.mkdir(exist_ok=True)
    print(f"{len(items)} image(s), model {args.model}, quality {args.quality}")
    for i, (name, file, prompt) in enumerate(items, 1):
        dest = OUT / f"{file}.png"
        if dest.exists() and not args.overwrite:
            print(f"[{i}/{len(items)}] {name}: already exists, skipped")
            continue
        print(f"[{i}/{len(items)}] {name} -> {dest.relative_to(ROOT)}")
        dest.write_bytes(generate(prompt, args.model, args.quality, key))
    print("Done.")


if __name__ == "__main__":
    main()
