"use server";

// Every action that changes data checks the admin login first.

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { checkPassword, startSession, endSession, requireAdmin, adminConfigured } from "@/lib/admin-auth";
import { sb, uploadToStorage } from "@/lib/supabase";
import { ORDER_STATUSES } from "@/lib/admin-data";
import { categories } from "@/lib/data/products";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const text = (fd, k) => String(fd.get(k) ?? "").trim();
const lines = (fd, k) => text(fd, k).split("\n").map((l) => l.trim()).filter(Boolean);
const intOrNull = (fd, k) => {
  const v = text(fd, k);
  if (v === "") return null;
  const n = Math.floor(Number(v.replace(/[,₦\s]/g, "")));
  return Number.isFinite(n) ? n : NaN;
};

// Make the public site show changes straight away (instead of within 60s).
function refreshSite() {
  revalidateTag("catalog");
  revalidatePath("/", "layout");
}

function back(path, error) {
  redirect(`${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(error)}`);
}

// ── Login ─────────────────────────────────────────────────────

export async function login(_prev, formData) {
  if (!adminConfigured()) {
    return { error: "ADMIN_PASSWORD isn't set in .env.local yet." };
  }
  if (!checkPassword(text(formData, "password"))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "Wrong password." };
  }
  startSession();
  redirect("/admin");
}

export async function logout() {
  endSession();
  redirect("/admin/login");
}

// ── Orders ────────────────────────────────────────────────────

export async function updateOrderStatus(formData) {
  requireAdmin();
  const reference = text(formData, "reference");
  const status = text(formData, "status");
  if (!ORDER_STATUSES.includes(status) || status === "pending") {
    back(`/admin/orders/${reference}`, "Invalid status");
  }
  await sb(`orders?reference=eq.${encodeURIComponent(reference)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { status },
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/orders/${reference}?saved=1`);
}

// ── Products ──────────────────────────────────────────────────

export async function saveProduct(formData) {
  requireAdmin();
  const isNew = text(formData, "mode") === "new";
  const slug = isNew ? text(formData, "slug").toLowerCase() : text(formData, "original_slug");
  const formPath = isNew ? "/admin/products/new" : `/admin/products/${slug}`;

  const category = text(formData, "category");
  const price = intOrNull(formData, "price");
  const stock = intOrNull(formData, "stock");
  const sortOrder = intOrNull(formData, "sort_order");

  if (!SLUG_RE.test(slug)) back(formPath, "The web address (slug) can only use lowercase letters, numbers and dashes, e.g. nzw-weaner-8wk");
  if (!text(formData, "name")) back(formPath, "Please enter a product name.");
  if (!categories.some((c) => c.slug === category)) back(formPath, "Please choose a category.");
  if (price === null || Number.isNaN(price) || price < 0) back(formPath, "Please enter a valid price in Naira.");
  if (Number.isNaN(stock) || (stock !== null && stock < 0)) back(formPath, "Stock must be a number (or empty for 'not tracked').");

  const isRabbit = category === "rabbits";
  const row = {
    name: text(formData, "name"),
    category,
    price,
    unit: text(formData, "unit") || "per unit",
    bulk_note: text(formData, "bulk_note") || null,
    description: text(formData, "description") || null,
    specs: lines(formData, "specs"),
    stock,
    breed: isRabbit ? text(formData, "breed") || null : null,
    sex: isRabbit ? text(formData, "sex") || null : null,
    age_label: isRabbit ? text(formData, "age_label") || null : null,
    weight_label: isRabbit ? text(formData, "weight_label") || null : null,
    purpose: isRabbit ? text(formData, "purpose") || null : null,
    sort_order: Number.isNaN(sortOrder) || sortOrder === null ? 100 : sortOrder,
    active: formData.get("active") === "on",
  };

  // Optional photo upload
  const file = formData.get("image");
  if (file && typeof file === "object" && file.size > 0) {
    const ext = IMAGE_TYPES[file.type];
    if (!ext) back(formPath, "Photo must be a JPG, PNG or WebP image.");
    if (file.size > 5 * 1024 * 1024) back(formPath, "Photo is too large — please keep it under 5 MB.");
    // A new file name each time, so browsers don't keep showing the old photo
    const objectName = `${slug}-${Date.now()}.${ext}`;
    try {
      await uploadToStorage("product-images", objectName, file);
    } catch (err) {
      console.error(err);
      back(formPath, "Photo upload failed. Did you run supabase/storage.sql to create the product-images bucket?");
    }
    row.image_url = objectName;
  }
  if (formData.get("remove_image") === "on") row.image_url = null;

  try {
    if (isNew) {
      const existing = await sb(`products?select=slug&slug=eq.${slug}`);
      if (existing.length) throw new Error("SLUG_TAKEN");
      await sb("products", { method: "POST", prefer: "return=minimal", body: { slug, ...row } });
    } else {
      await sb(`products?slug=eq.${encodeURIComponent(slug)}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: row,
      });
    }
  } catch (err) {
    console.error(err);
    back(formPath, err.message === "SLUG_TAKEN" ? "Another product already uses that web address (slug)." : "Couldn't save the product. Please try again.");
  }

  refreshSite();
  redirect(`/admin/products/${slug}?saved=1`);
}

// ── Training ──────────────────────────────────────────────────

export async function saveSession(formData) {
  requireAdmin();
  const isNew = text(formData, "mode") === "new";
  const slug = isNew ? text(formData, "slug").toLowerCase() : text(formData, "original_slug");
  const formPath = isNew ? "/admin/training/new" : `/admin/training/${slug}`;

  const price = intOrNull(formData, "price");
  const capacity = intOrNull(formData, "capacity");
  const startsLocal = text(formData, "starts_at"); // "2026-12-05T17:00" in Nigeria time

  if (!SLUG_RE.test(slug)) back(formPath, "The web address (slug) can only use lowercase letters, numbers and dashes.");
  if (!text(formData, "title")) back(formPath, "Please enter a title.");
  if (price === null || Number.isNaN(price) || price < 0) back(formPath, "Please enter a valid fee in Naira.");
  if (capacity === null || Number.isNaN(capacity) || capacity < 1) back(formPath, "Please enter how many seats are available.");

  const row = {
    title: text(formData, "title"),
    summary: text(formData, "summary") || null,
    description: text(formData, "description") || null,
    topics: lines(formData, "topics"),
    // Nigeria is UTC+1 all year (no daylight saving)
    starts_at: startsLocal ? `${startsLocal}:00+01:00` : null,
    duration_label: text(formData, "duration_label") || null,
    platform: text(formData, "platform") || "Zoom",
    price,
    capacity,
    active: formData.get("active") === "on",
  };

  try {
    if (isNew) {
      const existing = await sb(`training_sessions?select=slug&slug=eq.${slug}`);
      if (existing.length) throw new Error("SLUG_TAKEN");
      await sb("training_sessions", { method: "POST", prefer: "return=minimal", body: { slug, ...row } });
    } else {
      await sb(`training_sessions?slug=eq.${encodeURIComponent(slug)}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: row,
      });
    }
  } catch (err) {
    console.error(err);
    back(formPath, err.message === "SLUG_TAKEN" ? "Another session already uses that web address (slug)." : "Couldn't save the session. Please try again.");
  }

  refreshSite();
  redirect(`/admin/training/${slug}?saved=1`);
}

// ── Messages ──────────────────────────────────────────────────

export async function setMessageHandled(formData) {
  requireAdmin();
  const id = text(formData, "id");
  const handled = text(formData, "handled") === "true";
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  await sb(`contact_messages?id=eq.${id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { handled },
  });
  revalidatePath("/admin", "layout");
}
