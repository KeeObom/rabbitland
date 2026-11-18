import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/admin-data";
import { updateOrderStatus } from "@/app/admin/actions";
import { deliveryOptions } from "@/lib/config";
import { formatNaira, formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";
import Notice from "@/components/admin/Notice";
import SubmitButton from "@/components/admin/SubmitButton";

const NEXT_STEPS = [
  { status: "processing", label: "Mark as processing", hint: "You're preparing the order" },
  { status: "dispatched", label: "Mark as dispatched", hint: "Sent out / ready for pickup" },
  { status: "completed", label: "Mark as completed", hint: "Customer has received it" },
];

function waNumber(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  return d.startsWith("234") ? d : d.startsWith("0") ? "234" + d.slice(1) : d;
}

export default async function AdminOrderDetail({ params, searchParams }) {
  const o = await getOrder(params.reference);
  if (!o) return notFound();

  const delivery = deliveryOptions.find((d) => d.id === o.delivery_method);
  const isPaid = o.status !== "pending";
  const firstName = o.customer_name.split(" ")[0];
  const waText = encodeURIComponent(
    isPaid
      ? `Hello ${firstName}, this is Rabbit Land about your order ${o.reference}. `
      : `Hello ${firstName}, this is Rabbit Land. We noticed you started an order but the payment wasn't completed. Can we help?`
  );

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-charcoal/60 hover:text-gold-dark">← Orders</Link>
      <div className="flex flex-wrap items-center gap-3 mt-3 mb-6">
        <h1 className="font-display text-3xl text-forest-dark">{o.customer_name}</h1>
        <StatusBadge status={o.status} />
      </div>
      <Notice searchParams={searchParams} />

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="border border-forest/15 rounded-xl p-5 bg-white/70 text-sm space-y-1.5">
          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-gold-dark mb-2">Customer</div>
          <div>{o.customer_name}</div>
          <div><a href={`tel:${o.customer_phone}`} className="underline">{o.customer_phone}</a></div>
          <div><a href={`mailto:${o.customer_email}`} className="underline">{o.customer_email}</a></div>
          <a
            href={`https://wa.me/${waNumber(o.customer_phone)}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-[#25D366] text-white font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-full"
          >
            WhatsApp customer
          </a>
        </div>
        <div className="border border-forest/15 rounded-xl p-5 bg-white/70 text-sm space-y-1.5">
          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-gold-dark mb-2">Delivery</div>
          <div className="font-medium">{delivery?.label || o.delivery_method}</div>
          {o.delivery_address && <div>{o.delivery_address}</div>}
          {o.delivery_state && o.delivery_method !== "pickup" && <div>{o.delivery_state} State</div>}
          {o.notes && <div className="pt-2 text-charcoal/75"><span className="font-medium">Note:</span> {o.notes}</div>}
        </div>
      </div>

      <div className="border border-forest/15 rounded-xl p-5 bg-white/70 mb-8">
        <ul className="space-y-2 text-sm">
          {o.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-3">
              <span>{i.quantity} × {i.name} <span className="text-charcoal/50">({formatNaira(i.price)} {i.unit})</span></span>
              <span className="font-mono">{formatNaira(i.price * i.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between text-charcoal/70">
            <span>{delivery?.label || "Delivery"}</span>
            <span className="font-mono">{o.delivery_fee ? formatNaira(o.delivery_fee) : "Free"}</span>
          </li>
        </ul>
        <div className="border-t border-forest/10 mt-3 pt-3 flex justify-between font-display text-lg text-forest-dark">
          <span>{isPaid ? "Paid" : "Total (not paid)"}</span>
          <span className="font-mono">{formatNaira(o.total)}</span>
        </div>
        <div className="text-xs text-charcoal/55 mt-3 space-y-0.5 font-mono">
          <div>Ref: {o.reference}</div>
          <div>Placed: {formatDateTime(o.created_at)}</div>
          {o.paid_at && <div>Paid: {formatDateTime(o.paid_at)}</div>}
        </div>
      </div>

      {isPaid && o.status !== "cancelled" && (
        <section>
          <h2 className="font-display text-xl text-forest-dark mb-3">Update status</h2>
          <div className="flex flex-wrap gap-3">
            {NEXT_STEPS.filter((s) => s.status !== o.status).map((s) => (
              <form key={s.status} action={updateOrderStatus}>
                <input type="hidden" name="reference" value={o.reference} />
                <input type="hidden" name="status" value={s.status} />
                <SubmitButton title={s.hint}>{s.label}</SubmitButton>
              </form>
            ))}
            <form action={updateOrderStatus}>
              <input type="hidden" name="reference" value={o.reference} />
              <input type="hidden" name="status" value="cancelled" />
              <SubmitButton className="!bg-transparent !text-red-700 border border-red-300 hover:!bg-red-50">Cancel order</SubmitButton>
            </form>
          </div>
          <p className="text-xs text-charcoal/55 mt-3">
            Cancelling doesn't refund the customer. Refund them from your Paystack dashboard, and
            add the stock back on the product if needed.
          </p>
        </section>
      )}
    </div>
  );
}
