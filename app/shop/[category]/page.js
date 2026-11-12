import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories, getProductsByCategory } from "@/lib/catalog";
import { whatsappLink } from "@/lib/config";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  return { title: cat ? `${cat.name} | Rabbit Land Agribusiness` : "Shop" };
}

export default async function CategoryPage({ params }) {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return notFound();

  const items = await getProductsByCategory(cat.slug);
  const isRabbits = cat.slug === "rabbits";

  return (
    <div className="container-page py-14">
      <Link href="/shop" className="text-sm text-charcoal/60 hover:text-gold-dark">
        ← All products
      </Link>
      <h1 className="font-display text-4xl text-forest-dark mt-3 mb-2">{cat.name}</h1>
      <p className="text-charcoal/75 mb-6">{cat.tagline}</p>

      {isRabbits && (
        <div className="border border-gold/40 bg-gold/10 rounded-xl p-5 mb-10 grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">Health-checked</span>
            Every rabbit is checked and dewormed before it leaves the farm.
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">Pickup or delivery</span>
            Collect in Port Harcourt, or we deliver live rabbits nationwide.
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">Need advice first?</span>
            <a href={whatsappLink("Hello Rabbit Land! I need help choosing rabbits.")} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Chat with us on WhatsApp
            </a>{" "}
            before you buy.
          </div>
        </div>
      )}

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
