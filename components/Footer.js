import Link from "next/link";
import { site, whatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream/90 mt-24">
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h4 className="font-display text-lg text-gold mb-3">Rabbit Land</h4>
          <p className="text-sm text-cream/70 leading-relaxed">
            Commercial rabbit farming, farm inputs and consultancy —
            built for people starting or scaling a rabbit business.
          </p>
        </div>

        <div>
          <h5 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
            Shop
          </h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop/rabbits" className="hover:text-gold">Live Rabbits</Link></li>
            <li><Link href="/shop/feed" className="hover:text-gold">Rabbit Feed</Link></li>
            <li><Link href="/shop/cages" className="hover:text-gold">Cages & Hutches</Link></li>
            <li><Link href="/shop/manure" className="hover:text-gold">Rabbit Manure</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-gold">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
            Company
          </h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/training" className="hover:text-gold">Online Training</Link></li>
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/rabbits" className="hover:text-gold">About Rabbits</Link></li>
            <li><Link href="/consultancy" className="hover:text-gold">Consultancy</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
            Get in touch
          </h5>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>{site.locationLabel}</li>
            <li>Nationwide delivery</li>
            <li><a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a></li>
            <li><a href={site.phoneHref} className="hover:text-gold">{site.phoneDisplay}</a></li>
            <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold">WhatsApp us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5">
        <div className="container-page flex flex-col sm:flex-row justify-between gap-2 text-xs text-cream/50 font-mono">
          <span>© {new Date().getFullYear()} Rabbit Land Agribusiness. All rights reserved.</span>
          <span>Commercial Farming · Training · Consultation</span>
        </div>
      </div>
    </footer>
  );
}
