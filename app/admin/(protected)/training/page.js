import Link from "next/link";
import { listSessions } from "@/lib/admin-data";
import { formatDateTime, formatNaira } from "@/lib/format";

export default async function AdminTraining() {
  const sessions = await listSessions();
  const now = Date.now();
  const upcoming = sessions.filter((s) => !s.starts_at || new Date(s.starts_at).getTime() >= now).reverse();
  const past = sessions.filter((s) => s.starts_at && new Date(s.starts_at).getTime() < now);

  const List = ({ items }) => (
    <ul className="divide-y divide-forest/10 border border-forest/15 rounded-xl bg-white/70">
      {items.map((s) => (
        <li key={s.slug}>
          <Link href={`/admin/training/${s.slug}`} className={`flex justify-between gap-4 px-4 py-3 hover:bg-cream ${s.active ? "" : "opacity-55"}`}>
            <span>
              <span className="block text-sm text-forest-dark font-medium">{s.title}</span>
              <span className="block text-xs text-charcoal/55">
                {formatDateTime(s.starts_at)} · {s.platform} · {formatNaira(s.price)}{!s.active && " · Hidden"}
              </span>
            </span>
            <span className="font-mono text-sm shrink-0 text-right">
              {s.seats_taken}/{s.capacity}
              <span className="block text-[0.65rem] text-charcoal/50 uppercase">registered</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-forest-dark">Training</h1>
        <Link href="/admin/training/new" className="bg-forest text-cream font-mono text-xs uppercase tracking-wide px-5 py-2.5 rounded-full hover:bg-forest-light">
          + New session
        </Link>
      </div>
      <h2 className="font-display text-xl text-forest-dark mb-3">Upcoming</h2>
      {upcoming.length ? <List items={upcoming} /> : <p className="text-sm text-charcoal/55">No upcoming sessions.</p>}
      {past.length > 0 && (
        <>
          <h2 className="font-display text-xl text-forest-dark mt-10 mb-3">Past</h2>
          <List items={past} />
        </>
      )}
    </div>
  );
}
