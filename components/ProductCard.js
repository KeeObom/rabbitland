"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatNaira } from "@/lib/format";
import ProductImage from "./ProductImage";
import StockBadge, { isSoldOut } from "./StockBadge";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = isSoldOut(product);
  const max = product.stock ?? 1000;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group border border-forest/15 rounded-lg overflow-hidden bg-white/60 flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block">
        <ProductImage src={product.image} alt={product.name} className="h-44 w-full" />
        {product.rabbit && (
          <span className="absolute top-3 left-3 stamp-badge bg-cream/90 border-forest/30 text-forest-dark">
            {product.rabbit.purpose}
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg text-forest-dark leading-snug group-hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.rabbit ? (
          <p className="text-xs font-mono text-charcoal/60">
            {[product.rabbit.breed, product.rabbit.sex, product.rabbit.age].filter(Boolean).join(" · ")}
          </p>
        ) : (
          <p className="text-sm text-charcoal/70 line-clamp-2">{product.description}</p>
        )}
        <StockBadge product={product} />
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <div className="font-mono text-base text-forest-dark">{formatNaira(product.price)}</div>
            <div className="text-xs text-charcoal/60">{product.unit}</div>
          </div>
          {!soldOut && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={max}
                value={qty}
                onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
                className="w-14 border border-forest/20 rounded px-2 py-1 text-sm font-mono"
                aria-label={`Quantity for ${product.name}`}
              />
              <button
                onClick={handleAdd}
                className="bg-forest hover:bg-forest-light text-cream text-xs font-mono uppercase tracking-wide rounded px-3 py-2 transition-colors"
              >
                {added ? "Added" : "Add"}
              </button>
            </div>
          )}
        </div>
        {product.bulkNote && <p className="text-xs text-gold-dark mt-1">{product.bulkNote}</p>}
      </div>
    </div>
  );
}
