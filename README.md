# Costa's Takeaway

Website for Costa's Takeaway, a fish and chips shop at Shop 3, 153 Smith Rd, Woodridge QLD 4114.

Built with Vite, React, TypeScript and Tailwind CSS.

## Running locally

Requires Node.js and npm.

```sh
npm install
npm run dev
```

Other scripts:

- `npm run build` builds the production site into `dist/`
- `npm run preview` serves the built site
- `npm run lint` runs ESLint

## Updating prices and favourites (no code needed)

Sign in at **https://costastakeaway.info/admin** to change prices, mark items as popular
(★ badge on the menu and in the front-page ticker) and pick the front page's "Favourites".
Changes are stored in Supabase and show on the website immediately. Every change is logged with
who made it, under "Recent changes".

Prices in `src/data/menu.ts` are the built-in defaults: the website uses them for any
item without a saved price, and for everything if Supabase can't be reached.

### One-time Supabase setup

1. In the Supabase dashboard, open **SQL Editor** and run these two files, in order
   (both are safe to run again):
   - `supabase/migrations/20261106000000_menu_prices.sql`
   - `supabase/migrations/20261107000000_menu_settings.sql`
2. **Authentication → Users → Add user**: enter the admin's email and a password, and tick
   "Auto Confirm User".
3. Back in **SQL Editor**, make that account an admin (change the email):

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

4. **Authentication → Sign In / Providers**: turn off **Allow new users to sign up**, so
   nobody else can create an account. (Accounts without the admin role can't change prices
   anyway; this just keeps things tidy.)

To remove someone's access later: `delete from public.user_roles where user_id = (select id from auth.users where email = '...');`

## Updating the menu itself

Menu items and descriptions live in `src/data/menu.ts`. Prices there are stored
in cents (e.g. `priceCents: 850` is $8.50).

Photos are WebP files in two sizes with the same name: `src/assets/photos/` (about 900px wide,
for cards) and `src/assets/thumbs/` (144px square, for the small round images). An item uses
them with `...pic("cod-fish")`.

The menu page itself is `src/pages/Menu.tsx`, with its components and styles in `src/pages/menu/`.

## Logo and brand files

The logo is the Costa's rooster in a red stamp badge. All the files are in `brand/`:

| File | What it is | Use it for |
|---|---|---|
| `brand/costas-badge.svg` | Full badge with "Costa's · Takeaway · Woodridge" around the edge | Print: signs, menus, stickers, bags. Scales to any size. |
| `brand/costas-badge-2048.png` | The same, as a 2048px PNG with a transparent background | Facebook, Instagram, Google Business Profile, Canva, Word |
| `brand/costas-icon.svg` | The rooster in the badge, without lettering | Small sizes, where the lettering wouldn't be readable |
| `brand/costas-icon-2048.png` | The same, as a 2048px transparent PNG | Profile pictures, app icons |

The lettering in the SVGs is converted to shapes, so they print correctly on any computer
without the fonts installed.

Colours: tomato `#c9442a` · ink `#1d1915` · paper `#f3ecdf` · mustard `#e2a12f`.
Fonts: Fraunces (headings) and JetBrains Mono (small capitals), both free from Google Fonts.

Where the website uses them:

| File | Used as |
|---|---|
| `src/assets/costas-icon.svg` | Logo in the navigation bar |
| `public/favicon.svg`, `public/favicon-32.png` | Browser tab icon |
| `public/apple-touch-icon.png` | Icon when the site is saved to a phone's home screen |
| `public/og-image.jpg` | Preview image when a link to the site is shared (1200×630) |

To change the logo, edit and run `brand/make_logo.py` (instructions at the top of the file), then
copy `brand/costas-icon.svg` over `src/assets/costas-icon.svg` and `public/favicon.svg`, and
re-export the PNGs.

## Deployment

The site is hosted on GitHub Pages at https://costastakeaway.info. Every push to `main`
builds and deploys automatically via `.github/workflows/deploy.yml` (usually live within
2–3 minutes). The custom domain is set by `public/CNAME`; DNS is managed at IONOS.
