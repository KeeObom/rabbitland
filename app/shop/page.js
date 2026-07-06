import Link from "next/link";
import ImageSwatch from "@/components/ImageSwatch";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/lib/data/products";

export const metadata = {
  title: "Shop | Rabbit Land Agribusiness",
};

export default function ShopPage() {
  return (
    <div className="container-page py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Full catalogue
      </span>
      <h1 className="font-display text-4xl text-forest-dark mt-2 mb-3">Shop</h1>
      <p className="text-charcoal/75 max-w-xl mb-10">
        Feed, cages, manure and accessories, priced individually for small
        orders and discounted for bulk. Bulk and wholesale enquiries can go
        straight to <Link href="/contact" className="underline underline-offset-4 hover:text-gold-dark">the contact page</Link>.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="group bg-white/70 rounded-xl overflow-hidden border border-forest/10 hover:border-gold transition-colors"
          >
            <ImageSwatch label={c.name} className="h-24 w-full" tone="forest" />
            <div className="p-3">
              <h3 className="font-display text-base text-forest-dark group-hover:text-gold-dark">
                {c.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl text-forest-dark mb-6">All products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
