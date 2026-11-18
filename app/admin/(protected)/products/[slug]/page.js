import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductRow } from "@/lib/admin-data";
import { resolveImage } from "@/lib/catalog";
import ProductForm from "@/components/admin/ProductForm";
import Notice from "@/components/admin/Notice";

export default async function EditProductPage({ params, searchParams }) {
  const product = await getProductRow(params.slug);
  if (!product) return notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-charcoal/60 hover:text-gold-dark">← Products</Link>
      <h1 className="font-display text-3xl text-forest-dark mt-3 mb-6">{product.name}</h1>
      <Notice searchParams={searchParams} />
      {/* key resets the form after each save so it shows the saved values */}
      <ProductForm key={JSON.stringify(product)} product={product} imageUrl={resolveImage(product)} />
    </div>
  );
}
