"use client";

import { useState } from "react";
import { saveProduct } from "@/app/admin/actions";
import { categories } from "@/lib/data/products";
import SubmitButton from "./SubmitButton";
import ProductImage from "@/components/ProductImage";

const input = "w-full border border-forest/20 rounded px-3 py-2 bg-white text-sm";
const label = "text-xs font-mono uppercase tracking-wide text-charcoal/65 block mb-1";

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export default function ProductForm({ product, imageUrl }) {
  const isNew = !product;
  const p = product || { category: "rabbits", active: true, specs: [], sort_order: 100 };
  const [category, setCategory] = useState(p.category);
  const [name, setName] = useState(p.name || "");
  const [slug, setSlug] = useState(p.slug || "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [preview, setPreview] = useState(null);

  return (
    <form action={saveProduct} className="flex flex-col gap-8 max-w-3xl">
      <input type="hidden" name="mode" value={isNew ? "new" : "edit"} />
      {!isNew && <input type="hidden" name="original_slug" value={p.slug} />}

      {/* BASICS */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="name">Product name</label>
          <input id="name" name="name" required className={input} value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (isNew && !slugEdited) setSlug(slugify(e.target.value));
            }} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="slug">Web address (slug)</label>
          {isNew ? (
            <input id="slug" name="slug" required className={`${input} font-mono`} value={slug}
              onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }} />
          ) : (
            <div className="font-mono text-sm text-charcoal/70 py-2">/product/{p.slug}</div>
          )}
          {isNew && <p className="text-xs text-charcoal/50 mt-1">The page will be /product/{slug || "…"}. This can't be changed later.</p>}
        </div>
        <div>
          <label className={label} htmlFor="category">Category</label>
          <select id="category" name="category" className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm py-2">
            <input type="checkbox" name="active" defaultChecked={p.active} className="w-4 h-4 accent-[#1B3B1F]" />
            Show on website
          </label>
        </div>
      </section>

      {/* PRICE & STOCK */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label} htmlFor="price">Price (₦)</label>
          <input id="price" name="price" required inputMode="numeric" className={`${input} font-mono`} defaultValue={p.price ?? ""} placeholder="12000" />
        </div>
        <div>
          <label className={label} htmlFor="unit">Sold</label>
          <input id="unit" name="unit" className={input} defaultValue={p.unit || ""} placeholder={category === "rabbits" ? "per rabbit" : "per 25kg bag"} />
        </div>
        <div>
          <label className={label} htmlFor="stock">Stock</label>
          <input id="stock" name="stock" inputMode="numeric" className={`${input} font-mono`} defaultValue={p.stock ?? ""} placeholder="Leave empty = not tracked" />
        </div>
        <div className="sm:col-span-3">
          <label className={label} htmlFor="bulk_note">Bulk / extra note (optional)</label>
          <input id="bulk_note" name="bulk_note" className={input} defaultValue={p.bulk_note || ""} placeholder="e.g. Bulk price available from 10 bags" />
        </div>
      </section>

      {/* RABBIT DETAILS */}
      {category === "rabbits" && (
        <section className="border border-gold/40 bg-gold/5 rounded-xl p-5">
          <h2 className="font-display text-lg text-forest-dark mb-4">Rabbit details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="breed">Breed</label>
              <input id="breed" name="breed" className={input} defaultValue={p.breed || ""} placeholder="New Zealand White" list="breeds" />
              <datalist id="breeds">
                <option value="New Zealand White" /><option value="Californian" /><option value="Chinchilla" /><option value="Dutch" />
              </datalist>
            </div>
            <div>
              <label className={label} htmlFor="sex">Sex</label>
              <input id="sex" name="sex" className={input} defaultValue={p.sex || ""} placeholder="Doe (female) / Buck (male) / Mixed" list="sexes" />
              <datalist id="sexes">
                <option value="Doe (female)" /><option value="Buck (male)" /><option value="Mixed" />
              </datalist>
            </div>
            <div>
              <label className={label} htmlFor="age_label">Age</label>
              <input id="age_label" name="age_label" className={input} defaultValue={p.age_label || ""} placeholder="8 weeks" />
            </div>
            <div>
              <label className={label} htmlFor="weight_label">Weight</label>
              <input id="weight_label" name="weight_label" className={input} defaultValue={p.weight_label || ""} placeholder="1.2–1.5kg" />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="purpose">Best for</label>
              <input id="purpose" name="purpose" className={input} defaultValue={p.purpose || ""} placeholder="Breeding / Meat / grow-out / Pet" list="purposes" />
              <datalist id="purposes">
                <option value="Breeding" /><option value="Meat / grow-out" /><option value="Pet" />
              </datalist>
            </div>
          </div>
        </section>
      )}

      {/* DESCRIPTION */}
      <section className="flex flex-col gap-4">
        <div>
          <label className={label} htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className={input} defaultValue={p.description || ""} />
        </div>
        <div>
          <label className={label} htmlFor="specs">Key points (one per line)</label>
          <textarea id="specs" name="specs" rows={4} className={`${input} font-mono`} defaultValue={(p.specs || []).join("\n")} placeholder={"Dewormed\nHealth-checked before dispatch"} />
        </div>
      </section>

      {/* PHOTO */}
      <section>
        <label className={label}>Photo</label>
        <div className="flex flex-wrap items-start gap-5">
          <div className="w-40 h-32 rounded-lg overflow-hidden border border-forest/15 shrink-0">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="New photo preview" className="w-full h-full object-cover" />
            ) : (
              <ProductImage src={imageUrl} alt={name || "Product"} className="w-full h-full" />
            )}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <input type="file" name="image" accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : null);
              }} />
            <p className="text-xs text-charcoal/55">JPG, PNG or WebP, under 5 MB. Landscape works best.</p>
            {!isNew && p.image_url && (
              <label className="flex items-center gap-2 text-xs text-charcoal/70">
                <input type="checkbox" name="remove_image" /> Remove current photo
              </label>
            )}
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label} htmlFor="sort_order">Display order</label>
          <input id="sort_order" name="sort_order" inputMode="numeric" className={`${input} font-mono`} defaultValue={p.sort_order ?? 100} />
          <p className="text-xs text-charcoal/50 mt-1">Lower numbers show first.</p>
        </div>
      </section>

      <div className="flex items-center gap-4 border-t border-forest/10 pt-6">
        <SubmitButton>{isNew ? "Add product" : "Save changes"}</SubmitButton>
        {!isNew && (
          <a href={`/product/${p.slug}`} target="_blank" className="text-sm underline underline-offset-4 text-charcoal/70">View on site ↗</a>
        )}
      </div>
    </form>
  );
}
