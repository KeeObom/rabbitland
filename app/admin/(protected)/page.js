import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-data";
import { formatNaira, formatDateTime } from "@/lib/format";

function Stat({ label, value, href, note }) {
  const body = (
    <div className="border border-forest/15 rounded-xl p-5 bg-white/70 h-full hover:border-gold transition-colors">
      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-gold-dark">{label}</div>
      <div className="font-display text-3xl text-forest-dark mt-1">{value}</div>
      {note && <div className="text-xs text-charcoal/60 mt-1">{note}</div>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function AdminDashboard() {
  const s = await getDashboardStats();
  const monthName = new Date().toLocaleString("en-NG", { month: "long", timeZone: "Africa/Lagos" });

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-dark mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat label="Orders to handle" value={s.todo.length} href="/admin/orders" note="Paid, not yet dispatched" />
        <Stat label={`Sales in ${monthName}`} value={formatNaira(s.monthRevenue)} note={`${s.monthOrderCount} paid order${s.monthOrderCount === 1 ? "" : "s"}`} />
        <Stat label="Unread messages" value={s.unreadMessages} href="/admin/messages" />
        <Stat label="Low stock" value={s.lowStock.length} href="/admin/products" note="5 or fewer left" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-display text-xl text-forest-dark mb-3">Orders waiting</h2>
          {s.todo.length === 0 ? (
            <p className="text-sm text-charcoal/60">Nothing waiting. 🎉</p>
          ) : (
            <ul className="divide-y divide-forest/10 border border-forest/15 rounded-xl bg-white/70">
              {s.todo.slice(0, 8).map((o) => (
                <li key={o.reference}>
                  <Link href={`/admin/orders/${o.reference}`} className="flex justify-between gap-3 px-4 py-3 hover:bg-cream">
                    <span>
                      <span className="block text-sm text-forest-dark">{o.customer_name}</span>
                      <span className="block text-xs text-charcoal/55">{formatDateTime(o.created_at)}</span>
                    </span>
                    <span className="font-mono text-sm">{formatNaira(o.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-xl text-forest-dark mb-3">Low stock</h2>
            {s.lowStock.length === 0 ? (
              <p className="text-sm text-charcoal/60">All tracked products have more than 5 in stock.</p>
            ) : (
              <ul className="divide-y divide-forest/10 border border-forest/15 rounded-xl bg-white/70">
                {s.lowStock.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/admin/products/${p.slug}`} className="flex justify-between px-4 py-3 hover:bg-cream text-sm">
                      <span>{p.name}</span>
                      <span className={`font-mono ${p.stock === 0 ? "text-red-700" : "text-gold-dark"}`}>
                        {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl text-forest-dark mb-3">Upcoming training</h2>
            {s.upcomingSessions.length === 0 ? (
              <p className="text-sm text-charcoal/60">
                No upcoming sessions. <Link href="/admin/training/new" className="underline">Add one</Link>
              </p>
            ) : (
              <ul className="divide-y divide-forest/10 border border-forest/15 rounded-xl bg-white/70">
                {s.upcomingSessions.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/admin/training/${t.slug}`} className="flex justify-between gap-3 px-4 py-3 hover:bg-cream text-sm">
                      <span>
                        <span className="block text-forest-dark">{t.title}</span>
                        <span className="block text-xs text-charcoal/55">{formatDateTime(t.starts_at)}</span>
                      </span>
                      <span className="font-mono shrink-0">{t.seats_taken}/{t.capacity}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
