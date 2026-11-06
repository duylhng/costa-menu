"""Generate menu photos with an AI image model, using the prompts in docs/photo-prompts.md.

Two providers:
  openai      OpenAI's image API directly.       export OPENAI_API_KEY=sk-...
  openrouter  OpenAI image models via OpenRouter. export OPENROUTER_API_KEY=sk-or-...

Usage:
    python3 scripts/generate_photos.py --provider openrouter --from "Steak Burger"
    python3 scripts/generate_photos.py --only "Chiko Roll" "Spring Roll"
    python3 scripts/generate_photos.py --list

With --provider openrouter and no --model, the newest OpenAI model on OpenRouter that can
output images is picked automatically (and printed).

Each image is saved as incoming-photos/<file-name>.png (the name the prompts page gives).
Existing files are skipped unless you pass --overwrite, so a run can be resumed.
Review the images, then convert the good ones with scripts/menu_photos.py.

Options: --quality low|medium|high (OpenAI only, default high), --model.
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
OPENROUTER = "https://openrouter.ai/api/v1"


def load_prompts():
    """Return [(item name, file name, prompt)] in the order they appear on the prompts page."""
    text = PROMPTS.read_text()
    pattern = re.compile(r"^### (.+?)\n\nSave as \*\*`([a-z0-9-]+)\.png`\*\*.*?```text\n(.+?)\n```", re.S | re.M)
    return [(m.group(1).strip(), m.group(2), m.group(3).strip()) for m in pattern.finditer(text)]


def _post_json(url, payload, key, timeout=300):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "X-Title": "Costa's menu photos"},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as res:
                return json.load(res)
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:400]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                wait = 10 * (attempt + 1)
                print(f"    {e.code}, retrying in {wait}s: {detail}")
                time.sleep(wait)
                continue
            raise SystemExit(f"API error {e.code}: {detail}")
    raise SystemExit("Gave up after repeated errors.")


def openrouter_best_model() -> str:
    """Newest OpenAI model on OpenRouter whose outputs include images."""
    with urllib.request.urlopen(f"{OPENROUTER}/models", timeout=60) as res:
        models = json.load(res)["data"]
    image_models = [
        m for m in models
        if m["id"].startswith("openai/") and "image" in (m.get("architecture", {}).get("output_modalities") or [])
    ]
    if not image_models:
        raise SystemExit("OpenRouter lists no OpenAI image models right now. Pass --model explicitly.")
    image_models.sort(key=lambda m: m.get("created", 0), reverse=True)
    print("OpenAI image models on OpenRouter (newest first):")
    for m in image_models:
        print(f"    {m['id']}  ({m.get('name', '')})")
    return image_models[0]["id"]


def generate_openrouter(prompt, model, key) -> bytes:
    data = _post_json(
        f"{OPENROUTER}/chat/completions",
        {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "modalities": ["image", "text"],
            "image_config": {"aspect_ratio": "3:2"},
        },
        key,
    )
    message = data["choices"][0]["message"]
    for image in message.get("images") or []:
        url = image.get("image_url", {}).get("url", "")
        if url.startswith("data:"):
            return base64.b64decode(url.split(",", 1)[1])
        if url:
            with urllib.request.urlopen(url, timeout=120) as res:
                return res.read()
    raise SystemExit(f"No image in the response. Model said: {str(message.get('content'))[:300]}")


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
    ap.add_argument("--provider", choices=["openai", "openrouter"], default="openai")
    ap.add_argument("--model", help="default: gpt-image-1 (openai) or the newest OpenAI image model (openrouter)")
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

    key_var = "OPENROUTER_API_KEY" if args.provider == "openrouter" else "OPENAI_API_KEY"
    key = os.environ.get(key_var)
    if not key:
        sys.exit(f"Set {key_var} first (see the top of this file).")
    model = args.model or (openrouter_best_model() if args.provider == "openrouter" else "gpt-image-1")

    OUT.mkdir(exist_ok=True)
    print(f"{len(items)} image(s) via {args.provider}, model {model}")
    for i, (name, file, prompt) in enumerate(items, 1):
        dest = OUT / f"{file}.png"
        if dest.exists() and not args.overwrite:
            print(f"[{i}/{len(items)}] {name}: already exists, skipped")
            continue
        print(f"[{i}/{len(items)}] {name} -> {dest.relative_to(ROOT)}")
        if args.provider == "openrouter":
            dest.write_bytes(generate_openrouter(prompt, model, key))
        else:
            dest.write_bytes(generate(prompt, model, args.quality, key))
    print("Done.")


if __name__ == "__main__":
    main()
