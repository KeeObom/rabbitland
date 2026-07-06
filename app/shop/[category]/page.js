import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories, getProductsByCategory } from "@/lib/data/products";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  return { title: cat ? `${cat.name} | Rabbit Land Agribusiness` : "Shop" };
}

export default function CategoryPage({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return notFound();

  const items = getProductsByCategory(cat.slug);

  return (
    <div className="container-page py-14">
      <Link href="/shop" className="text-sm text-charcoal/60 hover:text-gold-dark">
        ← All products
      </Link>
      <h1 className="font-display text-4xl text-forest-dark mt-3 mb-2">{cat.name}</h1>
      <p className="text-charcoal/75 mb-10">{cat.tagline}</p>

      {items.length === 0 ? (
        <p className="text-charcoal/60">
          No products listed in this category yet — check back soon, or
          <Link href="/contact" className="underline underline-offset-4 ml-1">get in touch</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-14">
        {categories
          .filter((c) => c.slug !== cat.slug)
          .map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="stamp-badge border-forest/30 text-forest-dark hover:border-gold hover:text-gold-dark"
            >
              {c.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
