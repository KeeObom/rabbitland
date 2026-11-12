// Paystack sends the customer back here after paying:
//   /checkout/verify?reference=RL-...  (shop order)
//   /checkout/verify?reference=RLT-... (training registration)

import Link from "next/link";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { confirmPayment } from "@/lib/fulfil";
import { formatNaira } from "@/lib/format";
import { deliveryOptions, whatsappLink } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata = { title: "Payment | Rabbit Land Agribusiness" };

export default async function VerifyPage({ searchParams }) {
  const reference = searchParams?.reference || searchParams?.trxref;
  let result = { ok: false, reason: "No payment reference was provided." };

  if (reference) {
    try {
      result = await confirmPayment(reference);
    } catch (err) {
      console.error(err);
      result = { ok: false, reason: "We couldn't confirm your payment just now." };
    }
  }

  if (!result.ok) {
    return (
      <div className="container-page py-20 max-w-xl text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">Payment not confirmed</span>
        <h1 className="font-display text-3xl text-forest-dark mt-2 mb-4">We couldn't confirm this payment</h1>
        <p className="text-charcoal/70 mb-2">{result.reason}</p>
        <p className="text-charcoal/70 mb-8">
          If you were debited, don't worry — send us your reference and we'll sort it out.
        </p>
        {reference && <p className="font-mono text-sm mb-8">Reference: {reference}</p>}
        <a
          href={whatsappLink(`Hello Rabbit Land! I need help with my payment. Reference: ${reference || "N/A"}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  const r = result.record;

  if (result.kind === "training") {
    return (
      <div className="container-page py-20 max-w-xl text-center">
        <span className="stamp-badge border-gold text-gold-dark">Registration confirmed</span>
        <h1 className="font-display text-3xl text-forest-dark mt-4 mb-4">You're in, {r.full_name.split(" ")[0]}!</h1>
        <p className="text-charcoal/75 mb-6">
          We've received your payment of {formatNaira(r.amount)}. The class link and joining
          details will be sent to <strong>{r.email}</strong> and your WhatsApp before the session.
        </p>
        <p className="font-mono text-sm mb-8">Reference: {r.reference}</p>
        <Link href="/training" className="inline-block bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full">
          Back to training
        </Link>
      </div>
    );
  }

  const delivery = deliveryOptions.find((d) => d.id === r.delivery_method);

  return (
    <div className="container-page py-20 max-w-2xl">
      <ClearCartOnMount />
      <div className="text-center mb-10">
        <span className="stamp-badge border-gold text-gold-dark">Payment received</span>
        <h1 className="font-display text-3xl md:text-4xl text-forest-dark mt-4 mb-3">
          Thank you, {r.customer_name.split(" ")[0]}!
        </h1>
        <p className="text-charcoal/75">
          Your order is confirmed. We'll contact you on <strong>{r.customer_phone}</strong> to arrange{" "}
          {r.delivery_method === "pickup" ? "pickup in Port Harcourt" : "delivery"}.
        </p>
      </div>

      <div className="border border-forest/15 rounded-xl p-6 bg-white/60">
        <div className="flex justify-between text-sm mb-4">
          <span className="font-mono text-charcoal/60">Order reference</span>
          <span className="font-mono">{r.reference}</span>
        </div>
        <ul className="space-y-2 border-t border-forest/10 pt-4">
          {r.items.map((i) => (
            <li key={i.slug} className="flex justify-between text-sm">
              <span>{i.quantity} × {i.name}</span>
              <span className="font-mono">{formatNaira(i.price * i.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between text-sm text-charcoal/70">
            <span>{delivery?.label || "Delivery"}</span>
            <span className="font-mono">{r.delivery_fee ? formatNaira(r.delivery_fee) : "Free"}</span>
          </li>
        </ul>
        <div className="border-t border-forest/10 mt-4 pt-4 flex justify-between font-display text-lg text-forest-dark">
          <span>Total paid</span>
          <span className="font-mono">{formatNaira(r.total)}</span>
        </div>
        {r.delivery_address && (
          <p className="text-sm text-charcoal/70 mt-4">
            Delivering to: {r.delivery_address}, {r.delivery_state}
          </p>
        )}
      </div>

      <div className="text-center mt-8">
        <Link href="/shop" className="text-sm underline underline-offset-4 hover:text-gold-dark">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
