import Link from "next/link";
import { listOrders, ORDER_VIEWS } from "@/lib/admin-data";
import { deliveryOptions } from "@/lib/config";
import { formatNaira, formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function AdminOrders({ searchParams }) {
  const view = ORDER_VIEWS[searchParams?.view] ? searchParams.view : "todo";
  const orders = await listOrders(view);

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-dark mb-6">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(ORDER_VIEWS).map(([key, v]) => (
          <Link
            key={key}
            href={`/admin/orders?view=${key}`}
            className={`text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border ${
              view === key ? "bg-forest text-cream border-forest" : "border-forest/20 text-forest-dark hover:border-gold"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      {view === "abandoned" && (
        <p className="text-sm text-charcoal/65 mb-4">
          Someone clicked Pay but didn't finish on Paystack. These were not paid, so there's
          nothing to send. You could WhatsApp them to help complete the order.
        </p>
      )}

      {orders.length === 0 ? (
        <p className="text-charcoal/60">No orders here.</p>
      ) : (
        <div className="border border-forest/15 rounded-xl bg-white/70 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left font-mono text-[0.65rem] uppercase tracking-widest text-charcoal/55 border-b border-forest/10">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {orders.map((o) => (
                <tr key={o.reference} className="hover:bg-cream">
                  <td className="px-4 py-3 whitespace-nowrap text-charcoal/70">
                    <Link href={`/admin/orders/${o.reference}`} className="block">{formatDateTime(o.created_at)}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.reference}`} className="block text-forest-dark font-medium">{o.customer_name}</Link>
                    <span className="text-xs text-charcoal/55">{o.customer_phone}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal/75">
                    {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70 whitespace-nowrap">
                    {deliveryOptions.find((d) => d.id === o.delivery_method)?.label || o.delivery_method}
                  </td>
                  <td className="px-4 py-3 text-right font-mono whitespace-nowrap">{formatNaira(o.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
