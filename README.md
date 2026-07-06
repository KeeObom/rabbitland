# Rabbit Land Agribusiness — Website

A Next.js 14 (App Router) site for Rabbit Land Agribusiness: rabbit info,
a shop for feed / cages / manure / accessories, a working cart, consultancy
info, and account/contact pages. Checkout & payment are intentionally left
as UI placeholders for now, as requested.

## Stack

- **Next.js 14** (App Router) + React 18
- **Tailwind CSS** for styling
- Cart state via React Context, persisted in `localStorage` (no backend yet)
- No database yet — products live in `/lib/data/products.js`

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Project structure

```
app/
  page.js                 → Home
  about/page.js           → About Us
  rabbits/page.js         → About Rabbits + photo gallery
  consultancy/page.js     → Consultancy packages
  shop/page.js            → Full shop / all products
  shop/[category]/page.js → Category pages (feed, cages, manure, accessories)
  product/[slug]/page.js  → Single product detail + add to cart
  cart/page.js            → Cart (view, edit quantities, order summary)
  account/page.js         → Login / register UI (not wired to a backend yet)
  contact/page.js         → Contact form UI

components/
  Navbar.js, Footer.js
  CartProvider.js         → cart context + localStorage persistence
  ProductCard.js / ProductPurchasePanel.js
  ImageSwatch.js          → placeholder "photo" swatches (see below)
  ArcDivider.js           → the sunrise-arc section divider (signature visual)

lib/data/
  products.js             → all products + categories + prices (edit this to add/change products)
  rabbits.js              → breed info + care topics shown on /rabbits
```

## Adding real photos

Right now, every "photo" on the site (product images, gallery, cage photos)
is a placeholder colored swatch with a text label — the `ImageSwatch`
component — so the site looks complete and works before you have real
photography.

To swap in real photos:

1. Drop image files into `public/images/products/` (for shop items) or
   `public/images/gallery/` (for the rabbits/farm gallery page).
2. In the relevant component (e.g. `ProductCard.js`, `app/rabbits/page.js`),
   replace the `<ImageSwatch .../>` with Next's `<Image src="/images/..." .../>`,
   the same way `logo.jpg` is already used in `Navbar.js` and `app/page.js`.

Your logo is already wired in at `public/images/logo.jpg` and used in the
navbar, footer area, and homepage hero.

## Editing products, prices, categories

Everything in the shop comes from one file: `lib/data/products.js`.
Add a new product by adding an object to the `products` array — no other
file needs to change for it to appear in the shop, its category page, and
search-style listings.

## Cart & checkout

The cart works fully client-side right now:
- Add to cart from product cards or the product detail page
- Adjust quantities / remove items on `/cart`
- Cart persists across page reloads via `localStorage`

There is **no payment processing yet** — the "Continue to checkout" button
on `/cart` currently links to `/account`. When you're ready to add real
checkout and payment (e.g. Paystack or Flutterwave, which are the common
choices for Nigerian businesses), that would plug in at:
- `/cart` — "Continue to checkout" button
- A new `/checkout` page for shipping/delivery details
- A payment provider's hosted checkout or inline SDK

Accounts (`/account`) are UI-only right now too — the form doesn't save
anything. Wiring up real accounts + checkout will need a backend/database
(e.g. Supabase, or a custom API) — happy to help with that as a next step.

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects Next.js — no configuration needed for the initial deploy.
4. Click Deploy.

Any time you push to the connected GitHub branch, Vercel redeploys
automatically.

## Design notes

- Colors: forest green `#1B3B1F`, gold `#C79A3D`, cream `#F5EFE1`, charcoal
  text `#2B2620`, sage `#7C9473` — pulled from the logo.
- Type: **Fraunces** for display/headings, **Inter** for body text,
  **IBM Plex Mono** for prices, labels and data (the "farm ledger" feel).
- The curved divider between sections (`ArcDivider.js`) echoes the
  rising-sun arc in the logo badge — it's the one recurring signature shape
  used through the site.
