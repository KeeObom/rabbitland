// Server-side data access. Reads from Supabase when configured, otherwise
// falls back to the local placeholder data so the site always renders.

import { hasSupabase, sb, inList } from "@/lib/supabase";
import { products as localProducts, categories } from "@/lib/data/products";
import { trainingSessions as localSessions } from "@/lib/data/training";

export { categories };

const CACHE_SECONDS = 60;

// Product photos live in the public Supabase Storage bucket "product-images".
// If image_url is empty, the site looks for "<slug>.jpg" in that bucket,
// so uploading a file named after the product is all that's needed.
// image_url can also hold a different file name (e.g. "trio.png") or a full URL.
const IMAGE_BUCKET = "product-images";

export function resolveImage(row) {
  const value = (row.image_url || "").trim();
  if (/^https?:\/\//.test(value)) return value;
  const file = value || `${row.slug}.jpg`;
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${encodeURIComponent(file)}`;
}

function mapProduct(row) {
  const isRabbit = row.category === "rabbits";
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    unit: row.unit,
    bulkNote: row.bulk_note,
    image: resolveImage(row),
    description: row.description,
    specs: row.specs || [],
    stock: row.stock,
    rabbit: isRabbit
      ? {
          breed: row.breed,
          sex: row.sex,
          age: row.age_label,
          weight: row.weight_label,
          purpose: row.purpose,
        }
      : null,
  };
}

function mapSession(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    topics: row.topics || [],
    startsAt: row.starts_at,
    durationLabel: row.duration_label,
    platform: row.platform,
    price: row.price,
    capacity: row.capacity,
    seatsTaken: row.seats_taken,
  };
}

export async function getProducts() {
  if (!hasSupabase) return localProducts;
  const rows = await sb("products?select=*&active=eq.true&order=sort_order.asc,name.asc", {
    revalidate: CACHE_SECONDS,
  });
  return rows.map(mapProduct);
}

export async function getProductsByCategory(category) {
  const all = await getProducts();
  return all.filter((p) => p.category === category);
}

export async function getProductBySlug(slug) {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

// Uncached lookup used at checkout so prices and stock are always current.
export async function getProductsForCheckout(slugs) {
  if (!hasSupabase) return localProducts.filter((p) => slugs.includes(p.slug));
  const rows = await sb(`products?select=*&active=eq.true&slug=in.${inList(slugs)}`);
  return rows.map(mapProduct);
}

export async function getTrainingSessions() {
  if (!hasSupabase) return localSessions;
  const rows = await sb("training_sessions?select=*&active=eq.true&order=starts_at.asc", {
    revalidate: CACHE_SECONDS,
  });
  return rows.map(mapSession);
}

export async function getTrainingSessionBySlug(slug, { fresh = false } = {}) {
  if (!hasSupabase) return localSessions.find((s) => s.slug === slug) || null;
  const rows = await sb(
    `training_sessions?select=*&active=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    fresh ? {} : { revalidate: CACHE_SECONDS }
  );
  return rows[0] ? mapSession(rows[0]) : null;
}
