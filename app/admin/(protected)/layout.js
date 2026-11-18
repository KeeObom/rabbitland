import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { hasSupabase, sb } from "@/lib/supabase";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = { title: "Admin | Rabbit Land", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  requireAdmin();

  if (!hasSupabase) {
    return (
      <div className="container-page py-20">
        <h1 className="font-display text-3xl text-forest-dark mb-3">Database not connected</h1>
        <p className="text-charcoal/70">Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart the server.</p>
      </div>
    );
  }

  const [todo, unread] = await Promise.all([
    sb("orders?select=id&status=eq.paid"),
    sb("contact_messages?select=id&handled=eq.false"),
  ]).catch(() => [[], []]);

  return (
    <div className="min-h-screen md:flex bg-cream">
      <aside className="bg-forest text-cream md:w-56 md:min-h-screen p-4 md:p-5 flex md:flex-col gap-4 md:gap-8 items-center md:items-stretch md:sticky md:top-0 md:h-screen">
        <Link href="/admin" className="shrink-0">
          <span className="font-display text-lg block leading-tight">Rabbit Land</span>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-gold">Admin</span>
        </Link>
        <div className="flex-1 min-w-0">
          <AdminNav todo={todo.length} unread={unread.length} />
        </div>
        <div className="hidden md:flex flex-col gap-2 text-sm">
          <Link href="/" target="_blank" className="text-cream/70 hover:text-gold">View site ↗</Link>
          <form action={logout}>
            <button className="text-cream/70 hover:text-gold">Log out</button>
          </form>
        </div>
      </aside>
      <div className="flex-1 min-w-0 p-5 md:p-10">{children}</div>
      <form action={logout} className="md:hidden px-5 pb-8">
        <button className="text-sm text-charcoal/60 underline">Log out</button>
      </form>
    </div>
  );
}
