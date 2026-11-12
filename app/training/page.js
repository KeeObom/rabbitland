import Link from "next/link";
import ArcDivider from "@/components/ArcDivider";
import { getTrainingSessions } from "@/lib/catalog";
import { formatDateTime, formatNaira } from "@/lib/format";
import { whatsappLink } from "@/lib/config";

export const revalidate = 60;

export const metadata = {
  title: "Online Training | Rabbit Land Agribusiness",
  description: "Live online rabbit farming classes for beginners and growing farms, from anywhere in Nigeria.",
};

export default async function TrainingPage() {
  const sessions = await getTrainingSessions();
  const upcoming = sessions.filter((s) => !s.startsAt || new Date(s.startsAt) > new Date());

  return (
    <>
      <section className="bg-forest text-cream py-16 md:py-20">
        <div className="container-page">
          <span className="stamp-badge border-gold text-gold">Live · Online</span>
          <h1 className="font-display text-4xl md:text-5xl mt-4 max-w-2xl leading-tight">
            Learn rabbit farming from wherever you are.
          </h1>
          <p className="mt-5 text-cream/80 max-w-xl">
            Live online classes with real farm experience behind them — join from
            your phone or laptop, ask questions as we go, and leave with a
            plan you can actually use.
          </p>
        </div>
      </section>
      <div className="bg-forest">
        <ArcDivider color="#F5EFE1" />
      </div>

      <section className="container-page py-14">
        <h2 className="font-display text-3xl text-forest-dark mb-8">Upcoming sessions</h2>

        {upcoming.length === 0 ? (
          <div className="border border-forest/15 rounded-xl p-8 bg-white/60 text-center">
            <p className="text-charcoal/75 mb-4">No sessions are open for registration right now.</p>
            <a
              href={whatsappLink("Hello Rabbit Land! Please let me know when your next online training opens.")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Get notified on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {upcoming.map((s) => {
              const left = Math.max(0, s.capacity - s.seatsTaken);
              return (
                <Link
                  key={s.slug}
                  href={`/training/${s.slug}`}
                  className="group border border-forest/15 rounded-xl p-6 bg-white/60 hover:border-gold transition-colors flex flex-col"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                      {formatDateTime(s.startsAt)}
                    </span>
                    <span className="font-mono text-xs text-charcoal/60 shrink-0">{s.platform}</span>
                  </div>
                  <h3 className="font-display text-2xl text-forest-dark group-hover:text-gold-dark transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-charcoal/70 mt-2 mb-5">{s.summary}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <div className="font-mono text-lg text-forest-dark">{formatNaira(s.price)}</div>
                      <div className="text-xs text-charcoal/60">{s.durationLabel}</div>
                    </div>
                    <span className={`font-mono text-xs uppercase tracking-wide ${left === 0 ? "text-charcoal/50" : left <= 10 ? "text-gold-dark" : "text-forest-dark"}`}>
                      {left === 0 ? "Fully booked" : `${left} seats left`}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-sage/15 py-14">
        <div className="container-page grid md:grid-cols-3 gap-8">
          {[
            ["How it works", "Register and pay online. Your joining link is sent to your email and WhatsApp before the class."],
            ["What you need", "A phone or laptop with data. Cameras are optional — questions are always welcome."],
            ["After the class", "You keep the slides and a practical checklist, plus a follow-up Q&A on WhatsApp."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="font-display text-xl text-forest-dark mb-2">{title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
