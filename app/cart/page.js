"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl text-forest-dark mb-3">Your cart is empty</h1>
        <p className="text-charcoal/70 mb-8">
          Nothing added yet — browse live rabbits, feed, cages and more.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-4xl text-forest-dark mb-2">Your cart</h1>
      <p className="text-charcoal/60 mb-10 text-sm">
        Review your order, then continue to checkout to choose pickup or
        delivery and pay securely with Paystack.
      </p>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex gap-4 border border-forest/15 rounded-lg p-4 bg-white/60"
            >
              <ProductImage src={item.image} alt={item.name} className="w-24 h-24 rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="font-display text-lg text-forest-dark hover:text-gold-dark">
                  {item.name}
                </Link>
                <div className="text-xs text-charcoal/60">{item.unit}</div>
                <div className="font-mono text-sm text-forest-dark mt-1">
                  {formatNaira(item.price)}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <label className="text-xs font-mono text-charcoal/60">Qty</label>
                  <input
                    type="number"
                    max={item.stock ?? undefined}
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.slug, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-16 border border-forest/20 rounded px-2 py-1 text-sm font-mono"
                  />
                  <button
                    onClick={() => removeItem(item.slug)}
                    className="text-xs font-mono text-charcoal/50 hover:text-red-700 underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-mono text-sm text-forest-dark self-start">
                {formatNaira(item.price * item.quantity)}
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="self-start text-xs font-mono text-charcoal/50 hover:text-red-700 underline underline-offset-4 mt-2"
          >
            Clear cart
          </button>
        </div>

        <div className="border border-forest/15 rounded-xl p-6 bg-white/60 h-fit">
          <h2 className="font-display text-xl text-forest-dark mb-4">Order summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal/70">Subtotal</span>
            <span className="font-mono">{formatNaira(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-charcoal/50">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-forest/10 pt-4 mb-6" />

          <Link
            href="/checkout"
            className="block text-center bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
          >
            Continue to checkout
          </Link>
          <p className="text-xs text-charcoal/50 mt-3 text-center">
            Pickup in Port Harcourt or delivery nationwide. Prefer to talk
            first? Tap the WhatsApp bubble.
          </p>
        </div>
      </div>
    </div>
  );
}
