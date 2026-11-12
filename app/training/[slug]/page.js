import Link from "next/link";
import { notFound } from "next/navigation";
import TrainingRegisterForm from "@/components/TrainingRegisterForm";
import { getTrainingSessionBySlug } from "@/lib/catalog";
import { formatDateTime, formatNaira } from "@/lib/format";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const s = await getTrainingSessionBySlug(params.slug);
  return { title: s ? `${s.title} | Online Training | Rabbit Land` : "Training" };
}

export default async function TrainingSessionPage({ params }) {
  const s = await getTrainingSessionBySlug(params.slug);
  if (!s) return notFound();

  const left = Math.max(0, s.capacity - s.seatsTaken);
  const closed = left === 0 || (s.startsAt && new Date(s.startsAt) < new Date());

  return (
    <div className="container-page py-14">
      <Link href="/training" className="text-sm text-charcoal/60 hover:text-gold-dark">← All training</Link>

      <div className="grid lg:grid-cols-5 gap-12 mt-6">
        <div className="lg:col-span-3">
          <span className="stamp-badge border-gold text-gold-dark">Live online · {s.platform}</span>
          <h1 className="font-display text-4xl md:text-5xl text-forest-dark mt-4 mb-4 leading-tight">{s.title}</h1>
          <p className="text-charcoal/75 leading-relaxed mb-8">{s.description}</p>

          <dl className="grid sm:grid-cols-3 gap-3 mb-10">
            {[
              ["Starts", formatDateTime(s.startsAt)],
              ["Duration", s.durationLabel],
              ["Fee", formatNaira(s.price)],
            ].map(([label, value]) => (
              <div key={label} className="border border-forest/10 rounded-lg px-4 py-3 bg-white/50">
                <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-gold-dark">{label}</dt>
                <dd className="text-sm text-forest-dark mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>

          {s.topics?.length > 0 && (
            <>
              <h2 className="font-display text-2xl text-forest-dark mb-4">What we'll cover</h2>
              <ol className="space-y-3">
                {s.topics.map((t, i) => (
                  <li key={t} className="flex gap-4 items-baseline">
                    <span className="font-mono text-xs text-gold-dark w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-charcoal/80">{t}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="border border-forest/15 rounded-xl p-6 bg-white/60 lg:sticky lg:top-24">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-mono text-2xl text-forest-dark">{formatNaira(s.price)}</span>
              <span className="font-mono text-xs text-charcoal/60">
                {left === 0 ? "Fully booked" : `${left} of ${s.capacity} seats left`}
              </span>
            </div>
            <p className="text-sm text-charcoal/60 mb-6">One-time fee · paid securely with Paystack</p>
            <TrainingRegisterForm sessionSlug={s.slug} sessionTitle={s.title} closed={closed} />
          </div>
        </aside>
      </div>
    </div>
  );
}
