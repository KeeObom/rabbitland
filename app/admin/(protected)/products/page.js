import Link from "next/link";
import { listProducts } from "@/lib/admin-data";
import { categories, resolveImage } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

export default async function AdminProducts() {
  const products = await listProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-forest-dark">Products</h1>
        <Link href="/admin/products/new" className="bg-forest text-cream font-mono text-xs uppercase tracking-wide px-5 py-2.5 rounded-full hover:bg-forest-light">
          + Add product
        </Link>
      </div>

      {categories.map((c) => {
        const items = products.filter((p) => p.category === c.slug);
        return (
          <section key={c.slug} className="mb-10">
            <h2 className="font-display text-xl text-forest-dark mb-3">{c.name}</h2>
            {items.length === 0 ? (
              <p className="text-sm text-charcoal/55">None yet.</p>
            ) : (
              <ul className="divide-y divide-forest/10 border border-forest/15 rounded-xl bg-white/70 overflow-hidden">
                {items.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/admin/products/${p.slug}`} className={`flex items-center gap-4 px-4 py-3 hover:bg-cream ${p.active ? "" : "opacity-55"}`}>
                      <ProductImage src={resolveImage(p)} alt={p.name} className="w-14 h-14 rounded-md shrink-0" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-forest-dark font-medium truncate">{p.name}</span>
                        <span className="block text-xs text-charcoal/55">
                          {formatNaira(p.price)} {p.unit}{!p.active && " · Hidden from site"}
                        </span>
                      </span>
                      <span className={`font-mono text-xs shrink-0 ${p.stock === 0 ? "text-red-700" : p.stock !== null && p.stock <= 5 ? "text-gold-dark" : "text-charcoal/60"}`}>
                        {p.stock === null ? "Not tracked" : p.stock === 0 ? "Sold out" : `${p.stock} in stock`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
