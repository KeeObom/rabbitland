import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSwatch from "@/components/ImageSwatch";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import { products, getProductBySlug, categories } from "@/lib/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  return { title: product ? `${product.name} | Rabbit Land Agribusiness` : "Product" };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const cat = categories.find((c) => c.slug === product.category);

  return (
    <div className="container-page py-14">
      <Link href={`/shop/${product.category}`} className="text-sm text-charcoal/60 hover:text-gold-dark">
        ← {cat?.name || "Shop"}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <ImageSwatch label={product.name} className="h-80 md:h-full rounded-xl" tone="sage" />

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
            {cat?.name}
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-forest-dark mt-2 mb-4">
            {product.name}
          </h1>
          <p className="text-charcoal/75 leading-relaxed mb-6">{product.description}</p>

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
