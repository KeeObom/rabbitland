"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatNaira } from "@/lib/format";
import { whatsappLink } from "@/lib/config";
import StockBadge, { isSoldOut } from "./StockBadge";

export default function ProductPurchasePanel({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = isSoldOut(product);
  const max = product.stock ?? 1000;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const waMessage = soldOut
    ? `Hello Rabbit Land! When will "${product.name}" be available again?`
    : `Hello Rabbit Land! I'd like to order ${qty} × ${product.name} (${formatNaira(product.price)} ${product.unit}).`;

  return (
    <div className="border border-forest/15 rounded-xl p-6 bg-white/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-2xl text-forest-dark">{formatNaira(product.price)}</div>
          <div className="text-sm text-charcoal/60 mb-3">{product.unit}</div>
        </div>
        <StockBadge product={product} />
      </div>

      {product.bulkNote && <p className="text-sm text-gold-dark mb-4">{product.bulkNote}</p>}

      {!soldOut && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="qty" className="text-sm font-mono text-charcoal/70">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={max}
              value={qty}
              onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
              className="w-20 border border-forest/20 rounded px-2 py-1.5 text-sm font-mono"
            />
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-forest hover:bg-forest-light text-cream font-mono text-sm uppercase tracking-wide rounded-full px-6 py-3 transition-colors"
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </>
      )}

      <a
        href={whatsappLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full flex items-center justify-center gap-2 border border-[#25D366] text-forest-dark font-mono text-sm uppercase tracking-wide rounded-full px-6 py-3 hover:bg-[#25D366]/10 transition-colors"
      >
        {soldOut ? "Ask about availability on WhatsApp" : "Order on WhatsApp"}
      </a>

      {!soldOut && (
        <Link
          href="/cart"
          className="block text-center mt-4 text-sm underline underline-offset-4 text-forest-dark hover:text-gold-dark"
        >
          Go to cart
        </Link>
      )}

      <p className="text-xs text-charcoal/55 mt-4 leading-relaxed">
        Pay securely online with Paystack. Pickup in Port Harcourt or delivery nationwide.
      </p>
    </div>
  );
}
