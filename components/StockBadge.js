export function isSoldOut(product) {
  return product.stock !== null && product.stock !== undefined && product.stock <= 0;
}

export default function StockBadge({ product }) {
  if (product.stock === null || product.stock === undefined) return null;
  if (product.stock <= 0) {
    return (
      <span className="inline-block font-mono text-[0.65rem] uppercase tracking-widest bg-charcoal/10 text-charcoal/70 rounded-full px-2 py-0.5">
        Sold out
      </span>
    );
  }
  return (
    <span
      className={`inline-block font-mono text-[0.65rem] uppercase tracking-widest rounded-full px-2 py-0.5 ${
        product.stock <= 5 ? "bg-gold/25 text-gold-dark" : "bg-sage/25 text-forest-dark"
      }`}
    >
      {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} available`}
    </span>
  );
}
