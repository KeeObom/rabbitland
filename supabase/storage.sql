-- Creates the public bucket for product photos.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- (Or create it by hand: Storage → New bucket → name "product-images" → tick "Public bucket".)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set public = true;
