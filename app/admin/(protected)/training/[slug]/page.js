import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionRow, listRegistrations } from "@/lib/admin-data";
import { formatDateTime, formatNaira } from "@/lib/format";
import SessionForm from "@/components/admin/SessionForm";
import Notice from "@/components/admin/Notice";
import CopyButton from "@/components/admin/CopyButton";

export default async function EditSessionPage({ params, searchParams }) {
  const session = await getSessionRow(params.slug);
  if (!session) return notFound();
  const regs = await listRegistrations(session.id);

  const emails = regs.map((r) => r.email).join(", ");
  const phones = regs.map((r) => `${r.full_name}: ${r.phone}`).join("\n");

  return (
    <div>
      <Link href="/admin/training" className="text-sm text-charcoal/60 hover:text-gold-dark">← Training</Link>
      <h1 className="font-display text-3xl text-forest-dark mt-3 mb-2">{session.title}</h1>
      <p className="text-sm text-charcoal/60 mb-6">{formatDateTime(session.starts_at)}</p>
      <Notice searchParams={searchParams} />

      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-display text-xl text-forest-dark">
            Registered <span className="font-mono text-base text-charcoal/60">({regs.length}/{session.capacity})</span>
          </h2>
          {regs.length > 0 && (
            <div className="flex gap-2">
              <CopyButton text={emails}>Copy all emails</CopyButton>
              <CopyButton text={phones}>Copy names & phones</CopyButton>
            </div>
          )}
        </div>
        {regs.length === 0 ? (
          <p className="text-sm text-charcoal/55">No paid registrations yet.</p>
        ) : (
          <div className="border border-forest/15 rounded-xl bg-white/70 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left font-mono text-[0.65rem] uppercase tracking-widest text-charcoal/55 border-b border-forest/10">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {regs.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium text-forest-dark">{r.full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><a href={`tel:${r.phone}`} className="underline">{r.phone}</a></td>
                    <td className="px-4 py-3"><a href={`mailto:${r.email}`} className="underline">{r.email}</a></td>
                    <td className="px-4 py-3 text-charcoal/70">{r.location || "—"}</td>
                    <td className="px-4 py-3 text-charcoal/70">{r.experience || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNaira(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-charcoal/55 mt-3">
          Tip: before the class, paste "Copy all emails" into the BCC field of one email with the joining link.
        </p>
      </section>

      <h2 className="font-display text-xl text-forest-dark mb-4">Session details</h2>
      <SessionForm key={JSON.stringify(session)} session={session} />
    </div>
  );
}
