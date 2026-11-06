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

## Updating prices (no code needed)

Sign in at **https://costastakeaway.info/admin** to change prices. Saved prices are
stored in Supabase and show on the website immediately. Every change is logged with
who made it, under "Recent changes".

Prices in `src/data/menu.ts` are the built-in defaults: the website uses them for any
item without a saved price, and for everything if Supabase can't be reached.

### One-time Supabase setup

1. In the Supabase dashboard, open **SQL Editor**, paste in
   `supabase/migrations/20261106000000_menu_prices.sql` and run it. (It's safe to run again.)
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

Menu items, descriptions and photos live in `src/data/menu.ts`. Prices there are stored
in cents (e.g. `priceCents: 850` is $8.50).

The menu page itself is `src/pages/Menu.tsx`, with its components and styles in `src/pages/menu/`.

## Deployment

The site is hosted on GitHub Pages at https://costastakeaway.info. Every push to `main`
builds and deploys automatically via `.github/workflows/deploy.yml` (usually live within
2–3 minutes). The custom domain is set by `public/CNAME`; DNS is managed at IONOS.
