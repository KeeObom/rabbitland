"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";

const links = [
  { href: "/shop/rabbits", label: "Buy Rabbits" },
  { href: "/shop", label: "Shop" },
  { href: "/training", label: "Training" },
  { href: "/consultancy", label: "Consultancy" },
  { href: "/rabbits", label: "About Rabbits" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-forest text-cream border-b border-gold/30">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="Rabbit Land Agribusiness"
            width={44}
            height={44}
            className="rounded-full"
          />
          <span className="font-display text-lg leading-none hidden sm:block">
            Rabbit Land
            <span className="block text-[0.65rem] font-mono tracking-widest text-gold uppercase">
              Agribusiness
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-body text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative flex items-center gap-1 border border-gold rounded-full px-3 py-1.5 text-sm hover:bg-gold hover:text-forest-dark transition-colors"
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1 bg-gold text-forest-dark font-mono text-xs rounded-full px-1.5">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden text-cream"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden bg-forest-dark border-t border-gold/20 px-6 py-4 flex flex-col gap-4 font-body text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-gold">
              {l.label}
            </Link>
          ))}
          <Link href="/about" onClick={() => setOpen(false)} className="hover:text-gold">
            About Us
          </Link>
        </nav>
      )}
    </header>
  );
}
