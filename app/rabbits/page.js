import ImageSwatch from "@/components/ImageSwatch";
import ArcDivider from "@/components/ArcDivider";
import Link from "next/link";
import { breeds, careTopics } from "@/lib/data/rabbits";

export const metadata = {
  title: "About Rabbits | Rabbit Land Agribusiness",
};

const galleryLabels = [
  "Doe with litter",
  "Grow-out pen",
  "Feeding time",
  "Tiered hutch row",
  "Nest box detail",
  "Farm-gate manure bags",
];

export default function RabbitsPage() {
  return (
    <>
      <section className="bg-forest text-cream py-16 md:py-20">
        <div className="container-page">
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            The animal, the business
          </span>
          <h1 className="font-display text-4xl md:text-5xl mt-3 max-w-2xl leading-tight">
            Getting to know the rabbit before the farm
          </h1>
          <p className="mt-5 text-cream/80 max-w-xl">
            A short primer on the breeds we work with, how they're kept, and
            what a farm actually needs to get right — for anyone deciding
            whether rabbit farming fits their goals.
          </p>
        </div>
      </section>
      <div className="bg-forest">
        <ArcDivider color="#F5EFE1" />
      </div>

      {/* GALLERY */}
      <section className="container-page py-16">
        <h2 className="font-display text-3xl text-forest-dark mb-8">On the farm</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryLabels.map((label) => (
            <ImageSwatch key={label} label={label} className="h-48 rounded-lg" tone="sage" />
          ))}
        </div>
        <p className="text-xs text-charcoal/50 mt-4">
          Photos above are placeholders — drop real farm photography into
          <code className="mx-1 px-1.5 py-0.5 bg-forest/10 rounded">/public/images/gallery/</code>
          and swap them in.
        </p>
      </section>

      {/* BREEDS */}
      <section className="bg-sage/15 py-16">
        <div className="container-page">
          <h2 className="font-display text-3xl text-forest-dark mb-8">Breeds we work with</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {breeds.map((b) => (
              <div key={b.name} className="border border-forest/15 rounded-xl p-5 bg-white/60">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-display text-xl text-forest-dark">{b.name}</h3>
                  <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                    {b.use}
                  </span>
                </div>
                <p className="text-sm text-charcoal/70 mt-2">{b.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARE TOPICS */}
      <section className="container-page py-16">
        <h2 className="font-display text-3xl text-forest-dark mb-8">The basics of care</h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
          {careTopics.map((t) => (
            <div key={t.title}>
              <h3 className="font-display text-xl text-forest-dark mb-2">{t.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-4">
        <div className="bg-forest text-cream rounded-2xl p-8 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-display text-3xl">Ready to start?</h2>
            <p className="text-cream/80 mt-2">
              Buy health-checked stock, or learn the whole process first in a live online class.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/shop/rabbits" className="bg-gold text-forest-dark font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-gold-light">
              Buy rabbits
            </Link>
            <Link href="/training" className="border border-cream/40 font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:border-gold hover:text-gold">
              Online training
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
