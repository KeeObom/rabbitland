-- Rabbit Land Agribusiness — database schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: it uses "if not exists" / "or replace" where possible.

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS (feed, cages, manure, accessories AND live rabbits)
-- ─────────────────────────────────────────────────────────────
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,          -- used in the URL, e.g. nzw-weaner-8wk
  name          text not null,
  category      text not null check (category in ('rabbits','feed','cages','manure','accessories')),
  price         integer not null check (price >= 0),   -- in Naira
  unit          text not null default 'per unit',
  bulk_note     text,
  image_url     text,                          -- paste a Supabase Storage public URL
  description   text,
  specs         text[] default '{}',
  stock         integer check (stock is null or stock >= 0), -- null = not tracked
  -- live-rabbit details (leave empty for other products)
  breed         text,
  sex           text,
  age_label     text,
  weight_label  text,
  purpose       text,
  active        boolean not null default true, -- untick to hide from the site
  sort_order    integer not null default 100,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  reference        text unique not null,       -- Paystack reference, e.g. RL-...
  status           text not null default 'pending'
                   check (status in ('pending','paid','processing','dispatched','completed','cancelled')),
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  delivery_method  text not null,              -- pickup / ph / south / nationwide
  delivery_state   text,
  delivery_address text,
  notes            text,
  items            jsonb not null,             -- [{slug,name,price,quantity,unit}]
  subtotal         integer not null,
  delivery_fee     integer not null default 0,
  total            integer not null,           -- Naira
  paid_at          timestamptz,
  created_at       timestamptz not null default now()
);
create index if not exists orders_status_idx on orders (status, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- ONLINE TRAINING
-- ─────────────────────────────────────────────────────────────
create table if not exists training_sessions (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  summary         text,
  description     text,
  topics          text[] default '{}',
  starts_at       timestamptz,
  duration_label  text,                        -- e.g. "2 evenings · 2 hours each"
  platform        text default 'Zoom',
  price           integer not null default 0,  -- Naira
  capacity        integer not null default 50,
  seats_taken     integer not null default 0,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

create table if not exists training_registrations (
  id          uuid primary key default gen_random_uuid(),
  reference   text unique not null,            -- Paystack reference, e.g. RLT-...
  session_id  uuid not null references training_sessions(id),
  status      text not null default 'pending' check (status in ('pending','paid','cancelled')),
  full_name   text not null,
  email       text not null,
  phone       text not null,
  location    text,
  experience  text,
  amount      integer not null,                -- Naira
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists training_reg_session_idx on training_registrations (session_id, status);

-- ─────────────────────────────────────────────────────────────
-- CONTACT MESSAGES
-- ─────────────────────────────────────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  topic       text,
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- SECURITY
-- The website talks to the database only from the server, using the
-- service-role key. Row Level Security is switched on with NO public
-- policies, so the public anon key can't read customer data.
-- ─────────────────────────────────────────────────────────────
alter table products               enable row level security;
alter table orders                 enable row level security;
alter table training_sessions      enable row level security;
alter table training_registrations enable row level security;
alter table contact_messages       enable row level security;

-- ─────────────────────────────────────────────────────────────
-- PAYMENT FULFILMENT
-- Called after Paystack confirms a payment. Only acts on records that are
-- still 'pending' and whose total matches the amount paid, so calling it
-- twice (redirect + webhook) is harmless.
-- ─────────────────────────────────────────────────────────────
create or replace function fulfil_order(p_reference text, p_amount_kobo integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_items jsonb;
  v_item  jsonb;
begin
  update orders
     set status = 'paid', paid_at = now()
   where reference = p_reference
     and status = 'pending'
     and total * 100 = p_amount_kobo
  returning items into v_items;

  if v_items is null then
    return false;
  end if;

  for v_item in select * from jsonb_array_elements(v_items) loop
    update products
       set stock = greatest(stock - (v_item->>'quantity')::int, 0)
     where slug = v_item->>'slug'
       and stock is not null;
  end loop;

  return true;
end;
$$;

create or replace function fulfil_registration(p_reference text, p_amount_kobo integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session uuid;
begin
  update training_registrations
     set status = 'paid', paid_at = now()
   where reference = p_reference
     and status = 'pending'
     and amount * 100 = p_amount_kobo
  returning session_id into v_session;

  if v_session is null then
    return false;
  end if;

  update training_sessions
     set seats_taken = seats_taken + 1
   where id = v_session;

  return true;
end;
$$;

revoke execute on function fulfil_order(text, integer) from public, anon, authenticated;
revoke execute on function fulfil_registration(text, integer) from public, anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- STARTER DATA — PLACEHOLDERS. Edit or delete in the Table Editor.
-- ─────────────────────────────────────────────────────────────
insert into products (slug, name, category, price, unit, bulk_note, description, specs, stock, breed, sex, age_label, weight_label, purpose, sort_order) values
('nzw-weaner-8wk', 'New Zealand White Weaner', 'rabbits', 12000, 'per rabbit', 'Starter batches of 10+ — chat with us on WhatsApp',
 'Healthy, fully weaned New Zealand White rabbits ready for a grow-out pen.', '{"Weaned & eating pellets","Dewormed","Sexed on request"}', 24,
 'New Zealand White', 'Mixed', '8 weeks', '1.2–1.5kg', 'Meat / grow-out', 1),
('californian-breeding-doe', 'Californian Breeding Doe', 'rabbits', 25000, 'per doe', null,
 'Mature Californian doe selected from productive lines, ready to join a breeding programme.', '{"Breeding age","Selected from good litters","Health-checked before dispatch"}', 8,
 'Californian', 'Doe (female)', '5–6 months', '3–3.5kg', 'Breeding', 2),
('nzw-breeding-buck', 'New Zealand White Breeding Buck', 'rabbits', 28000, 'per buck', null,
 'Proven-quality New Zealand White buck for improving or starting a breeding herd.', '{"Breeding age","Health-checked before dispatch"}', 5,
 'New Zealand White', 'Buck (male)', '6 months', '3.5–4kg', 'Breeding', 3),
('starter-trio', 'Starter Breeding Trio', 'rabbits', 72000, '1 buck + 2 does', 'Pair it with a 3-tier hutch for a complete starter setup',
 'One buck and two unrelated does of breeding age — everything needed to start breeding.', '{"Unrelated buck and does","Breeding age","Free care guide with every trio"}', 4,
 'NZW / Californian', '1 buck, 2 does', '5–6 months', '3–4kg each', 'Breeding', 4),
('grower-pellets-25kg', 'Grower Pellet Feed', 'feed', 18500, 'per 25kg bag', 'Bulk price available from 10 bags',
 'Balanced pellet ration for rabbits from weaning to 12 weeks.', '{"16% crude protein","Pelleted, low-dust","25kg woven bag"}', null, null, null, null, null, null, 10),
('breeder-formula-25kg', 'Breeder & Doe Formula', 'feed', 20500, 'per 25kg bag', 'Bulk price available from 10 bags',
 'Higher-density formulation for pregnant and lactating does.', '{"18% crude protein","Added calcium & minerals","25kg woven bag"}', null, null, null, null, null, null, 11),
('tiered-hutch-3-level', '3-Tier Welded Mesh Hutch', 'cages', 85000, 'per unit', null,
 'Space-saving three-level hutch with droppings trays.', '{}', null, null, null, null, null, null, 20),
('manure-bag-25kg', 'Composted Rabbit Manure', 'manure', 4500, 'per 25kg bag', 'Bulk price available from 20 bags',
 'Cold, low-odour organic fertiliser for gardens and farms.', '{}', null, null, null, null, null, null, 30),
('nipple-waterer-set', 'Nipple Waterer (Set of 5)', 'accessories', 6800, 'per set of 5', null,
 'Screw-fit nipple drinkers that connect to a header tank line.', '{"Fits standard PVC line","Set of 5 nipples"}', null, null, null, null, null, null, 40)
on conflict (slug) do nothing;

insert into training_sessions (slug, title, summary, description, topics, starts_at, duration_label, platform, price, capacity) values
('rabbit-farming-foundations', 'Rabbit Farming Foundations',
 'A live online class for complete beginners: from choosing breeds to selling your first batch.',
 'Two evenings of live online training covering everything you need to start a small commercial rabbitry with confidence.',
 '{"Choosing breeds and buying healthy stock","Housing, cages and stocking density","Feeding by growth stage","Breeding schedules and kindling","Common diseases and prevention","Costing, pricing and where to sell"}',
 '2026-12-05 17:00:00+01', '2 evenings · 2 hours each', 'Zoom', 15000, 40),
('scaling-a-commercial-rabbitry', 'Scaling a Commercial Rabbitry',
 'For farmers already running does who want better litters, lower feed costs and real records.',
 'An intermediate online workshop on running a rabbitry as a business.',
 '{"Production planning for steady supply","Feed cost control","Record keeping that shows profit per doe","Biosecurity as you grow","Finding and keeping buyers"}',
 '2026-12-19 16:00:00+01', '1 day · 4 hours', 'Google Meet', 25000, 30)
on conflict (slug) do nothing;
