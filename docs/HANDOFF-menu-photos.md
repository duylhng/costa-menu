# Handoff: swap in the new menu photos

**For:** Claude Code running locally on the owner's computer, where the new photos are.
**Why local:** the generated images are too large for GitHub's web upload. They don't need to
go to GitHub at all: convert them here and commit only the small WebP versions (~40 KB each).

## The task

The owner has generated new AI food photos for the menu (one per item, made from the prompts in
`docs/photo-prompts.md`). Replace the current photos with them, check them, and put them live.

Ask the owner where the photos are on this computer if they haven't said.

## Repo and site at a glance

- Repo: `github.com/duylhng/costa-menu`. Vite + React + TypeScript site for Costa's Takeaway
  (fish & chips, Woodridge QLD). Live at https://costastakeaway.info on **GitHub Pages**.
- **Pushing to `main` deploys automatically** (`.github/workflows/deploy.yml`, ~1 minute). Anything
  on `main` goes live, so check before pushing. Work on a branch (`site-broadsheet` is the usual
  one) and fast-forward `main` when the owner approves.
- Prices, "popular" stars and front-page favourites are edited by the owner at `/admin` and live in
  Supabase. Not part of this task; don't touch `.env`, `supabase/` or `src/data/prices.ts`.

## How photos work

Each menu item names its photo in `src/data/menu.ts`, e.g. `...pic("cod-fish")`. Every photo
exists in two sizes with the same file name:

| Folder | Size | Used for |
|---|---|---|
| `src/assets/photos/<name>.webp` | 900px wide (1600px for `hero-fish-chips`) | Cards, item pop-up, front-page favourites |
| `src/assets/thumbs/<name>.webp` | 144×144 square crop | Small round images in lists, search, order |

`scripts/menu_photos.py` makes both from an original image of any size, named after the photo it
replaces (`cod-fish.png` → `cod-fish.webp`):

```sh
pip install pillow
python3 scripts/menu_photos.py /path/to/photos/*.png
```

It resizes, crops, compresses and fixes phone rotation, and overwrites the existing pair.

The full list of item → file names is in `docs/photo-prompts.md` (each item says "Save as
`name.png`"), or run `python3 scripts/generate_photos.py --list`. There are 54: 53 existing photos
plus `lasagna-topper`, which is new.

## Steps

1. `git checkout site-broadsheet && git pull` (and make sure it contains everything on `main`).
2. **Match the files to names.** Compare the owner's file names with the list. Some may be named
   loosely ("dim sim.png", "Hamburger w Lot.jpg"); rename copies to the exact names, and ask the
   owner about anything you can't match. List any items that have no new photo; they keep the
   current one.
3. **Look at every image before using it** (open them). Flag anything wrong for the owner rather
   than silently using it: wrong food (potato scallops drawn as seafood scallops, American-style
   items), extra items the prompt said not to include (sauce cups, garnish, chips with the plain
   fish), text or watermarks, mangled shapes. The rules the owner set:
   - show only the item itself; sides, sauces and drinks only where the menu lists them;
   - every fish fillet has a lemon wedge; the four plain fish (Cod, Hoki, Snapper, Barramundi)
     have no chips;
   - "the lot" on burgers includes beetroot and pineapple; the chicken burger is just a crumbed
     chicken schnitzel in a bun.
4. **Convert** the approved ones with `scripts/menu_photos.py`. Originals stay out of git
   (`incoming-photos/*` is gitignored; keep originals outside the repo or in that folder).
5. **Lasagna Topper** has never had a photo. If there's a `lasagna-topper` image, add
   `...pic("lasagna-topper")` to the `lasagna-topper` item in `src/data/menu.ts`.
6. **Front-page photo:** if `hero-fish-chips` was replaced, the link-preview image
   `public/og-image.jpg` (1200×630: photo on the left, logo badge and "Costa's Takeaway" on the
   right) still shows the old photo. Offer to regenerate it to match.
7. **Check:** `npx tsc -p tsconfig.app.json --noEmit`, `npm run build`, then `npm run preview` and
   look at `/` and `/menu` at desktop and phone widths, light and dark mode. Thumbnails should be
   centred on the food (the square crop is from the middle; re-crop an original by hand if the
   food is off-centre).
8. **Show the owner** before/after screenshots and get a yes before anything goes live.
9. Commit only `src/assets/photos/`, `src/assets/thumbs/` (and `menu.ts` / `og-image.jpg` if
   changed), push the branch, then fast-forward `main` and push. Confirm the GitHub Actions
   "Deploy to GitHub Pages" run succeeds (`gh run list -R duylhng/costa-menu -L 1`).

## Conventions the owner cares about

- Plain, short explanations; the owner isn't a developer. Show screenshots rather than describing.
- Ask before anything goes live.
- Commit messages end with a `Co-Authored-By` line for Claude, as in the existing history.

## Background (only if needed)

- The current photos were made by Lovable's AI generator in Oct 2025, when the site was first built.
- `scripts/generate_photos.py` can generate photos itself through OpenAI or OpenRouter
  (`--provider openrouter --from "Steak Burger"`), but it needs an API key with credit. The owner
  made the photos in ChatGPT instead, so it isn't needed for this task.
