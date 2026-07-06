import Link from "next/link";
import ArcDivider from "@/components/ArcDivider";

const packages = [
  {
    name: "Starter Review",
    audience: "New or first-year farms",
    price: "From ₦45,000",
    includes: [
      "Site visit or virtual walkthrough",
      "Housing & stocking density review",
      "Basic feed and breeding plan",
      "Written report with next steps",
    ],
  },
  {
    name: "Growth Consultation",
    audience: "Farms scaling past 20 does",
    price: "From ₦120,000",
    includes: [
      "Full farm audit — housing, feed, records",
      "Custom breeding schedule per doe",
      "Feed cost & margin analysis",
      "90-day improvement plan with check-in",
    ],
  },
  {
    name: "Ongoing Advisory",
    audience: "Established commercial farms",
    price: "Custom quote",
    includes: [
      "Monthly performance review",
      "Disease & biosecurity protocol design",
      "Staff training on-site",
      "Direct line for urgent farm issues",
    ],
  },
];

export const metadata = {
  title: "Consultancy | Rabbit Land Agribusiness",
};

export default function ConsultancyPage() {
  return (
    <>
      <section className="bg-forest text-cream py-16 md:py-20">
        <div className="container-page">
          <span className="stamp-badge border-gold text-gold">
            Consultation Available
          </span>
          <h1 className="font-display text-4xl md:text-5xl mt-4 max-w-2xl leading-tight">
            Advice from people who've actually run the cage rows.
          </h1>
          <p className="mt-5 text-cream/80 max-w-xl">
            Whether you're deciding if rabbit farming is worth starting, or
            trying to work out why your current setup isn't turning a profit,
            we work through the same questions a good farm manager would.
          </p>
        </div>
      </section>
      <div className="bg-forest">
        <ArcDivider color="#F5EFE1" />
      </div>

      <section className="container-page py-16 md:py-20">
        <h2 className="font-display text-3xl text-forest-dark mb-10">Packages</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="border border-forest/15 rounded-xl p-6 bg-white/60 flex flex-col"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                {pkg.audience}
              </span>
              <h3 className="font-display text-2xl text-forest-dark mt-2 mb-1">
                {pkg.name}
              </h3>
              <p className="font-mono text-lg text-forest-dark mb-5">{pkg.price}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {pkg.includes.map((item) => (
                  <li key={item} className="text-sm text-charcoal/70 flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="text-center bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
              >
                Enquire
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sage/15 py-16 md:py-20">
        <div className="container-page grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl text-forest-dark mb-4">
              What a review usually covers
            </h2>
            <p className="text-charcoal/75 leading-relaxed">
              Most first visits turn up the same handful of issues — cages
              too close together, feed changed too abruptly, no written
              breeding schedule, no record of which doe is actually
              profitable. A review names the specific ones on your farm.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-forest-dark mb-4">
              Who this is for
            </h2>
            <p className="text-charcoal/75 leading-relaxed">
              People with land or space and a serious interest in commercial
              rabbit farming — from someone weighing up whether to start, to
              an existing farm whose numbers aren't adding up.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
