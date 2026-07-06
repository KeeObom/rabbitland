import Link from "next/link";
import Image from "next/image";
import ArcDivider from "@/components/ArcDivider";
import ImageSwatch from "@/components/ImageSwatch";
import { categories, products } from "@/lib/data/products";
import { formatNaira } from "@/lib/data/products";

// Adding

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="bg-forest text-cream relative overflow-hidden">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="stamp-badge border-gold text-gold mb-6">
              Warri, Delta State
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] mt-4">
              A rabbit business,
              <br />
              <span className="italic text-gold">built to scale.</span>
            </h1>
            <p className="mt-6 text-cream/80 text-lg max-w-md">
              Feed, cages, manure and hands-on consultancy for anyone
              starting or growing a commercial rabbitry — whether that's
              four does in a backyard or four hundred on a farm.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-gold text-forest-dark font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
              >
                Shop Farm Supplies
              </Link>
              <Link
                href="/consultancy"
                className="border border-cream/40 text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:border-gold hover:text-gold transition-colors"
              >
                Book Consultancy
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border-2 border-gold/40">
              <Image
                src="/images/logo.jpg"
                alt="Rabbit Land Agribusiness crest"
                width={700}
                height={420}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-cream text-forest-dark rounded-xl px-5 py-3 shadow-lg hidden sm:block">
              <div className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                Bulk Orders
              </div>
              <div className="font-display text-lg">Welcomed daily</div>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-forest">
        <ArcDivider color="#F5EFE1" />
      </div>

      {/* WHY RABBIT FARMING */}
      <section className="container-page py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Fast cycle
            </span>
            <h3 className="font-display text-2xl mt-2 text-forest-dark">
              Short turnaround to market weight
            </h3>
            <p className="mt-3 text-charcoal/75 leading-relaxed">
              Rabbits reach market weight far faster than most livestock,
              which means quicker cash cycles for a new farm finding its feet.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Low footprint
            </span>
            <h3 className="font-display text-2xl mt-2 text-forest-dark">
              Runs on far less land than most livestock
            </h3>
            <p className="mt-3 text-charcoal/75 leading-relaxed">
              A productive rabbitry can start in a backyard, a rented plot,
              or a spare room converted into a hutch row — and scale from there.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Two revenue lines
            </span>
            <h3 className="font-display text-2xl mt-2 text-forest-dark">
              Meat and manure, from day one
            </h3>
            <p className="mt-3 text-charcoal/75 leading-relaxed">
              Every cage produces two sellable outputs — meat rabbits and
              nutrient-rich manure — long before a single litter is weaned.
            </p>
          </div>
        </div>
      </section>

      {/* SHOP CATEGORIES */}
      <section className="bg-sage/15 py-16 md:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                From the shop
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-forest-dark mt-2">
                Everything the cage row needs
              </h2>
            </div>
            <Link href="/shop" className="text-forest-dark font-mono text-sm underline underline-offset-4 hover:text-gold-dark">
              View full shop →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="group bg-white/70 rounded-xl overflow-hidden border border-forest/10 hover:border-gold transition-colors"
              >
                <ImageSwatch label={c.name} className="h-32 w-full" tone="forest" />
                <div className="p-4">
                  <h3 className="font-display text-lg text-forest-dark group-hover:text-gold-dark">
                    {c.name}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS STRIP */}
      <section className="container-page py-16 md:py-20">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
          Popular this month
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-forest-dark mt-2 mb-10">
          Frequently reordered
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="border border-forest/15 rounded-lg overflow-hidden bg-white/60 hover:border-gold transition-colors"
            >
              <ImageSwatch label={p.name} className="h-32 w-full" tone="sage" />
              <div className="p-3">
                <h4 className="font-display text-sm text-forest-dark leading-snug">
                  {p.name}
                </h4>
                <div className="font-mono text-sm text-gold-dark mt-1">
                  {formatNaira(p.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CONSULTANCY CTA */}
      <section className="bg-forest text-cream py-16 md:py-20">
        <div className="container-page grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="stamp-badge border-gold text-gold">
              Consultation Available
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-4 leading-tight">
              Starting a rabbitry, or fixing one that isn't working?
            </h2>
            <p className="mt-4 text-cream/80 max-w-md">
              We advise on site layout, breeding schedules, feed costing,
              record systems and the small management fixes that separate a
              hobby setup from a farm that pays for itself.
            </p>
            <Link
              href="/consultancy"
              className="inline-block mt-6 bg-gold text-forest-dark font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
            >
              See consultancy packages
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Site & housing review", "Breeding schedule design", "Feed cost planning", "Farm record systems"].map(
              (item) => (
                <div key={item} className="border border-gold/30 rounded-lg p-4">
                  <p className="font-display text-lg leading-snug">{item}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
