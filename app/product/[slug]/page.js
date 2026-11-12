import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import { categories, getProductBySlug } from "@/lib/catalog";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} | Rabbit Land Agribusiness` : "Product" };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const cat = categories.find((c) => c.slug === product.category);
  const rabbitFacts = product.rabbit
    ? [
        ["Breed", product.rabbit.breed],
        ["Sex", product.rabbit.sex],
        ["Age", product.rabbit.age],
        ["Weight", product.rabbit.weight],
        ["Best for", product.rabbit.purpose],
      ].filter(([, v]) => v)
    : [];

  return (
    <div className="container-page py-14">
      <Link href={`/shop/${product.category}`} className="text-sm text-charcoal/60 hover:text-gold-dark">
        ← {cat?.name || "Shop"}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <ProductImage src={product.image} alt={product.name} className="h-80 md:h-full min-h-[20rem] w-full rounded-xl" />

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">{cat?.name}</span>
          <h1 className="font-display text-3xl md:text-4xl text-forest-dark mt-2 mb-4">{product.name}</h1>
          <p className="text-charcoal/75 leading-relaxed mb-6">{product.description}</p>

          {rabbitFacts.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 mb-6">
              {rabbitFacts.map(([label, value]) => (
                <div key={label} className="border border-forest/10 rounded-lg px-4 py-3 bg-white/50">
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-gold-dark">{label}</dt>
                  <dd className="text-sm text-forest-dark mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.specs?.length > 0 && (
            <ul className="mb-8 space-y-1.5">
              {product.specs.map((s) => (
                <li key={s} className="text-sm text-charcoal/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  {s}
                </li>
              ))}
            </ul>
          )}

          <ProductPurchasePanel product={product} />
        </div>
      </div>
    </div>
  );
}
