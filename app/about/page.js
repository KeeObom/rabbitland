import ImageSwatch from "@/components/ImageSwatch";

export const metadata = {
  title: "About Us | Rabbit Land Agribusiness",
};

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Who we are
      </span>
      <h1 className="font-display text-4xl text-forest-dark mt-2 mb-8 max-w-2xl">
        A rabbit business built on farm supplies and straight-talking advice
      </h1>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <ImageSwatch label="The farm" className="h-72 rounded-xl" tone="forest" />
        <div className="flex flex-col justify-center">
          <p className="text-charcoal/75 leading-relaxed mb-4">
            Rabbit Land Agribusiness supplies the inputs a commercial
            rabbitry needs — feed, cages and manure — and advises the people
            running them. The two sides of the business feed each other:
            selling equipment we'd actually recommend, and giving advice
            grounded in what's really sold and used on farms.
          </p>
          <p className="text-charcoal/75 leading-relaxed">
            We work with farms at every stage, from a first four-doe setup
            in a backyard to established operations looking to fix a
            specific problem — a stalled breeding cycle, rising feed costs,
            or losses they can't explain.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-xl text-forest-dark mb-2">What we sell</h3>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Healthy live rabbits for meat and breeding, feed formulated by
            growth stage, welded-mesh cages built for Nigerian farm
            conditions, and manure sold bagged or by the tonne.
          </p>
        </div>
        <div>
          <h3 className="font-display text-xl text-forest-dark mb-2">What we advise on</h3>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Housing layout, breeding schedules, feed costing and record
            systems — through one-on-one consultancy and live online training
            open to farmers anywhere in Nigeria.
          </p>
        </div>
        <div>
          <h3 className="font-display text-xl text-forest-dark mb-2">Where we operate</h3>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Based in Port Harcourt, Rivers State. Customers can pick up from the
            farm, and we deliver rabbits and supplies nationwide.
          </p>
        </div>
      </div>
    </div>
  );
}
