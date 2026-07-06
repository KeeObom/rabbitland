"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatNaira } from "@/lib/data/products";

export default function ProductPurchasePanel({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="border border-forest/15 rounded-xl p-6 bg-white/60">
      <div className="font-mono text-2xl text-forest-dark">
        {formatNaira(product.price)}
      </div>
      <div className="text-sm text-charcoal/60 mb-4">{product.unit}</div>

      {product.bulkNote && (
        <p className="text-sm text-gold-dark mb-4">{product.bulkNote}</p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="qty" className="text-sm font-mono text-charcoal/70">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 border border-forest/20 rounded px-2 py-1.5 text-sm font-mono"
        />
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-forest hover:bg-forest-light text-cream font-mono text-sm uppercase tracking-wide rounded-full px-6 py-3 transition-colors"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>

      <Link
        href="/cart"
        className="block text-center mt-3 text-sm underline underline-offset-4 text-forest-dark hover:text-gold-dark"
      >
        Go to cart
      </Link>
    </div>
  );
}
