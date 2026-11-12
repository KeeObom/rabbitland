"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatNaira } from "@/lib/format";
import { deliveryOptions, nigerianStates, whatsappLink } from "@/lib/config";

const inputCls = "w-full border border-forest/20 rounded px-3 py-2 bg-white";
const labelCls = "text-sm font-mono text-charcoal/70 block mb-1";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [method, setMethod] = useState("pickup");
  const [state, setState] = useState("Rivers");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const option = deliveryOptions.find((d) => d.id === method);
  const total = subtotal + (option?.fee || 0);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const waOrder = `Hello Rabbit Land! I'd like to order:\n${items
    .map((i) => `• ${i.quantity} × ${i.name}`)
    .join("\n")}\nSubtotal: ${formatNaira(subtotal)}`;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customer: form,
          delivery: { method, state, address },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.authorizationUrl; // Paystack payment page
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl text-forest-dark mb-3">Nothing to check out yet</h1>
        <Link href="/shop" className="inline-block mt-4 bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full">
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <Link href="/cart" className="text-sm text-charcoal/60 hover:text-gold-dark">← Back to cart</Link>
      <h1 className="font-display text-4xl text-forest-dark mt-3 mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* CONTACT */}
          <section>
            <h2 className="font-display text-2xl text-forest-dark mb-4">Your details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="name">Full name</label>
                <input id="name" required value={form.name} onChange={update("name")} className={inputCls} autoComplete="name" />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email} onChange={update("email")} className={inputCls} autoComplete="email" />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone / WhatsApp</label>
                <input id="phone" type="tel" required value={form.phone} onChange={update("phone")} className={inputCls} autoComplete="tel" placeholder="080..." />
              </div>
            </div>
          </section>

          {/* DELIVERY */}
          <section>
            <h2 className="font-display text-2xl text-forest-dark mb-4">Pickup or delivery</h2>
            <div className="flex flex-col gap-3">
              {deliveryOptions.map((d) => (
                <label
                  key={d.id}
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                    method === d.id ? "border-gold bg-gold/10" : "border-forest/15 bg-white/60 hover:border-forest/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={d.id}
                    checked={method === d.id}
                    onChange={() => setMethod(d.id)}
                    className="mt-1 accent-[#1B3B1F]"
                  />
                  <span className="flex-1">
                    <span className="flex justify-between gap-3">
                      <span className="font-display text-lg text-forest-dark">{d.label}</span>
                      <span className="font-mono text-sm text-forest-dark">{d.fee === 0 ? "Free" : formatNaira(d.fee)}</span>
                    </span>
                    <span className="block text-sm text-charcoal/65 mt-0.5">{d.description}</span>
                  </span>
                </label>
              ))}
            </div>

            {option?.needsAddress && (
              <div className="grid sm:grid-cols-3 gap-4 mt-5">
                <div>
                  <label className={labelCls} htmlFor="state">State</label>
                  <select id="state" value={state} onChange={(e) => setState(e.target.value)} className={inputCls}>
                    {nigerianStates.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="address">Delivery address</label>
                  <input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} autoComplete="street-address" placeholder="Street, area, city, nearest landmark" />
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className={labelCls} htmlFor="notes">Order notes (optional)</label>
              <textarea id="notes" rows={3} value={form.notes} onChange={update("notes")} className={inputCls} placeholder="e.g. preferred sex of rabbits, delivery time" />
            </div>
          </section>
        </div>

        {/* SUMMARY */}
        <aside className="border border-forest/15 rounded-xl p-6 bg-white/60 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-forest-dark mb-4">Order summary</h2>
          <ul className="space-y-2 mb-4">
            {items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-3 text-sm">
                <span className="text-charcoal/80">{i.quantity} × {i.name}</span>
                <span className="font-mono shrink-0">{formatNaira(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-forest/10 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/70">Subtotal</span>
              <span className="font-mono">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/70">{method === "pickup" ? "Pickup" : "Delivery"}</span>
              <span className="font-mono">{option?.fee ? formatNaira(option.fee) : "Free"}</span>
            </div>
          </div>
          <div className="border-t border-forest/10 mt-3 pt-4 flex justify-between font-display text-lg text-forest-dark mb-6">
            <span>Total</span>
            <span className="font-mono">{formatNaira(total)}</span>
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-60"
          >
            {submitting ? "Opening Paystack…" : `Pay ${formatNaira(total)}`}
          </button>
          <p className="text-xs text-charcoal/55 mt-3 text-center">
            Card, bank transfer or USSD via Paystack.
          </p>
          <a
            href={whatsappLink(waOrder)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm underline underline-offset-4 text-forest-dark hover:text-gold-dark mt-4"
          >
            Or send this order on WhatsApp
          </a>
        </aside>
      </form>
    </div>
  );
}
