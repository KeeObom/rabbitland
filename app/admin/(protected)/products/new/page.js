import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import Notice from "@/components/admin/Notice";

export default function NewProductPage({ searchParams }) {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-charcoal/60 hover:text-gold-dark">← Products</Link>
      <h1 className="font-display text-3xl text-forest-dark mt-3 mb-6">Add product</h1>
      <Notice searchParams={searchParams} />
      <ProductForm />
    </div>
  );
}
