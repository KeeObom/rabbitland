# Rabbit Land Agribusiness — Website

A Next.js 14 (App Router) site for Rabbit Land Agribusiness, Port Harcourt:
buy live rabbits and farm supplies online, register for live online
training, and pay securely with Paystack. Pickup in Port Harcourt or
delivery nationwide. A WhatsApp chat bubble is on every page.

## What it does

- **Buy Rabbits** (`/shop/rabbits`) — live rabbits with breed, sex, age,
  weight, purpose and live stock counts ("Only 3 left", "Sold out").
- **Shop** — feed, cages, manure, accessories, all from the same catalogue.
- **Cart → Checkout** — customer details, pickup or delivery zone (fee added
  to the total), then full payment on Paystack. Stock is reduced
  automatically once payment is confirmed.
- **Online Training** (`/training`) — upcoming sessions with seats left;
  register and pay in one step.
- **WhatsApp** — floating chat bubble, plus "Order on WhatsApp" on every
  product with the order pre-filled.
- **Contact form** — messages are saved to the database.

Without Supabase/Paystack keys the site still runs on the placeholder data
in `lib/data/`, and payment buttons explain that online payment isn't on yet.

## Setup

### 1. Install and run

```bash
npm install
cp .env.example .env.local   # then fill it in (steps 2–4)
npm run dev
```

Open http://localhost:3000

### 2. Supabase (database)

1. Create a project at https://supabase.com
2. **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, click **Run**.
   This creates the tables and loads PLACEHOLDER products and training sessions.
3. **Project Settings → API**: copy the Project URL into `SUPABASE_URL` and
   the `service_role` key into `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Paystack (payments)

1. **Settings → API Keys & Webhooks**: copy the **secret** key into
   `PAYSTACK_SECRET_KEY` (start with the `sk_test_` key).
2. Once the site is deployed, set the **Webhook URL** to
   `https://YOUR-DOMAIN/api/paystack/webhook`. This confirms payments even
   if a customer closes their browser before returning to the site.

### 4. Your details

Edit `lib/config.js`: phone, email, pickup location and **delivery fees**
(currently placeholders). Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`.

### Testing a payment

With test keys, use Paystack's test card `4084 0840 8408 4081`, any future
expiry, CVV `408`, PIN `0000`, OTP `123456`.

## Running the business day to day (Supabase → Table Editor)

| Task | Where |
| --- | --- |
| Add / edit rabbits & products, prices, stock | `products` table (set `active` false to hide) |
| Add a product photo | Storage → create a public bucket → upload → copy URL into `image_url` |
| See paid orders | `orders` table, filter `status = paid`; update status as you dispatch |
| Add a training session | `training_sessions` table |
| See who registered | `training_registrations`, filter `status = paid` |
| Read contact messages | `contact_messages` |

Pages refresh their data from the database every 60 seconds.

## Deploying

Vercel is the easiest: import the GitHub repo, add the four environment
variables from `.env.example` (with your real domain in
`NEXT_PUBLIC_SITE_URL`), deploy, then set the Paystack webhook URL.

## Stack

- **Next.js 14** (App Router) + React 18
- **Tailwind CSS** for styling
- Cart state via React Context, persisted in `localStorage`
- Supabase (Postgres) via its REST API — no extra npm packages
- Paystack for payments (server-side initialize + verify + webhook)

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
  cart/page.js            → Cart (view, edit quantities)
  checkout/page.js        → Details + pickup/delivery + pay with Paystack
  checkout/verify/page.js → Payment confirmation (orders & training)
  training/page.js        → Upcoming online training sessions
  training/[slug]/page.js → Session details + registration form
  contact/page.js         → Contact form (saved to Supabase)
  api/checkout            → Creates order, starts Paystack payment
  api/training/register   → Creates registration, starts Paystack payment
  api/contact             → Saves contact messages
  api/paystack/webhook    → Paystack payment notifications

components/
  Navbar.js, Footer.js
  CartProvider.js         → cart context + localStorage persistence
  WhatsAppBubble.js       → floating WhatsApp chat button
  ProductImage.js         → real photo if image URL set, else placeholder
  StockBadge.js           → "Only X left" / "Sold out"
  TrainingRegisterForm.js
  ProductCard.js / ProductPurchasePanel.js
  ImageSwatch.js          → placeholder "photo" swatches (see below)
  ArcDivider.js           → the sunrise-arc section divider (signature visual)

lib/
  config.js               → business details, WhatsApp number, delivery fees
  catalog.js              → reads products & sessions (Supabase or fallback)
  supabase.js, paystack.js, fulfil.js → server-only helpers
  data/                   → placeholder fallback data + breed/care info

supabase/schema.sql       → database tables, payment functions, starter data
```

## Design notes

- Colors: forest green `#1B3B1F`, gold `#C79A3D`, cream `#F5EFE1`, charcoal
  text `#2B2620`, sage `#7C9473` — pulled from the logo.
- Type: **Fraunces** for display/headings, **Inter** for body text,
  **IBM Plex Mono** for prices, labels and data (the "farm ledger" feel).
- The curved divider between sections (`ArcDivider.js`) echoes the
  rising-sun arc in the logo badge — it's the one recurring signature shape
  used through the site.
