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

## Updating the menu

Every menu item and price lives in `src/data/menu.ts`. Prices are stored in cents
(e.g. `priceCents: 850` is $8.50). Change a price there and push to `main`.

The menu page itself is `src/pages/Menu.tsx`, with its components and styles in `src/pages/menu/`.

## Deployment

The site is hosted on GitHub Pages at https://costastakeaway.info. Every push to `main`
builds and deploys automatically via `.github/workflows/deploy.yml` (usually live within
2–3 minutes). The custom domain is set by `public/CNAME`; DNS is managed at IONOS.
