import Link from "next/link";
import ImageSwatch from "@/components/ImageSwatch";
import ProductCard from "@/components/ProductCard";
import { categories, getProducts } from "@/lib/catalog";

export const revalidate = 60;

export const metadata = {
  title: "Shop | Rabbit Land Agribusiness",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container-page py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Full catalogue
      </span>
      <h1 className="font-display text-4xl text-forest-dark mt-2 mb-3">Shop</h1>
      <p className="text-charcoal/75 max-w-xl mb-10">
        Live rabbits, feed, cages, manure and accessories. Pay online, then
        pick up in Port Harcourt or have it delivered anywhere in Nigeria.
        Bulk and wholesale enquiries can go straight to{" "}
        <Link href="/contact" className="underline underline-offset-4 hover:text-gold-dark">the contact page</Link>.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="group bg-white/70 rounded-xl overflow-hidden border border-forest/10 hover:border-gold transition-colors"
          >
            <ImageSwatch label={c.name} className="h-24 w-full" tone={c.slug === "rabbits" ? "gold" : "forest"} />
            <div className="p-3">
              <h3 className="font-display text-base text-forest-dark group-hover:text-gold-dark">
                {c.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {categories.map((c) => {
        const items = products.filter((p) => p.category === c.slug);
        if (items.length === 0) return null;
        return (
          <section key={c.slug} className="mb-14">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl text-forest-dark">{c.name}</h2>
              <Link href={`/shop/${c.slug}`} className="text-sm font-mono underline underline-offset-4 hover:text-gold-dark">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
